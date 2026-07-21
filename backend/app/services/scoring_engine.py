import os
import logging
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession

from backend.app.services.dependency_analyzer import analyze_dependencies
from backend.app.services.ast_analyzer import analyze_ast_patterns
from backend.app.services.ci_analyzer import analyze_ci_pipeline
from backend.app.services.iac_analyzer import analyze_iac_infrastructure
from backend.app.services.codecarbon_parser import parse_codecarbon_emissions
from backend.app.services.carbon_intensity import get_realtime_carbon_intensity
from backend.app.services.aws_cost_explorer import analyze_aws_cost_explorer

logger = logging.getLogger(__name__)


def estimate_tests_carbon(repo_dir: str) -> Dict[str, float]:
    """Scan repo directory to estimate test suite metrics and carbon footprint.

    Formula: Test_Carbon = (Num_Tests * 0.5) + (Avg_Time * 0.2) + (Coverage_Gap * 2)
    """
    test_files_count = 0
    for root, _, files in os.walk(repo_dir):
        if any(part in root.split(os.sep) for part in (".git", ".venv", "venv", "node_modules")):
            continue
        for file in files:
            file_lower = file.lower()
            if (
                file_lower.startswith("test_") 
                or file_lower.endswith("_test.py") 
                or ".test." in file_lower 
                or ".spec." in file_lower
            ):
                test_files_count += 1

    # Base estimates
    num_tests = test_files_count * 8  # Estimate 8 tests per file
    avg_time = 0.4                    # Estimate 0.4 seconds per test
    coverage_gap = 35.0               # Estimate 35% gap in test coverage
    
    if num_tests == 0:
        # If no tests are found, assume a higher coverage gap
        coverage_gap = 100.0

    test_carbon = (num_tests * 0.5) + (avg_time * 0.2) + (coverage_gap * 2.0)
    
    return {
        "num_tests": num_tests,
        "avg_time": avg_time,
        "coverage_gap": coverage_gap,
        "carbon": test_carbon
    }


async def calculate_master_score(
    db: AsyncSession, 
    repo_dir: str
) -> Dict[str, Any]:
    """Orchestrates analysis across Code, CI/CD, and Infrastructure layers

    and computes the master Carbon Severity Score (0-10).
    """
    logger.info(f"Starting master score calculation for {repo_dir}...")
    
    # 1. Layer 1: Code-level Carbon
    dep_results = await analyze_dependencies(db, repo_dir)
    ast_results = await analyze_ast_patterns(repo_dir)
    test_results = estimate_tests_carbon(repo_dir)
    
    code_carbon_baseline = dep_results["carbon"] + ast_results["carbon"] + test_results["carbon"]
    
    # Check for CodeCarbon CSV overlay
    codecarbon_overlay = parse_codecarbon_emissions(repo_dir)
    if codecarbon_overlay:
        # Add actual measured physical emissions to code-level baseline
        code_carbon = code_carbon_baseline + codecarbon_overlay["emissions_g"]
    else:
        code_carbon = code_carbon_baseline

    # 2. Layer 2: CI/CD Pipeline Carbon
    ci_results = await analyze_ci_pipeline(repo_dir)
    ci_carbon = ci_results["carbon"]

    # 3. Layer 3: Infrastructure Carbon (IaC Static + AWS Live Data)
    infra_results = await analyze_iac_infrastructure(repo_dir)
    infra_carbon_iac = infra_results["carbon"]
    
    aws_live = await analyze_aws_cost_explorer()
    if aws_live:
        infra_results["aws_live"] = aws_live
        infra_carbon = infra_carbon_iac + aws_live["carbon"]
    else:
        infra_results["aws_live"] = None
        infra_carbon = infra_carbon_iac

    # Master scoring formula:
    # Total Score (0-10) = (Code/1000)×3 + (CI/800)×2 + (Infra/10000)×5
    calculated_score = (code_carbon / 1000.0) * 3.0 + (ci_carbon / 800.0) * 2.0 + (infra_carbon / 10000.0) * 5.0
    
    # Bound the score between 0 and 10
    total_score = min(max(calculated_score, 0.0), 10.0)
    
    # Generate risk items/warnings
    risks = []
    if ast_results["nested_loops"] >= 3:
        risks.append({
            "layer": "code",
            "severity": "HIGH",
            "message": f"Detected {ast_results['nested_loops']} nested loops, indicating potential performance/carbon inefficiencies."
        })
    if ast_results["n_plus_one_queries"] >= 1:
        risks.append({
            "layer": "code",
            "severity": "HIGH",
            "message": f"Detected {ast_results['n_plus_one_queries']} potential database N+1 query patterns."
        })
    if ci_results["missing_caching"] == 1:
        risks.append({
            "layer": "ci",
            "severity": "MEDIUM",
            "message": "CI workflows do not utilize package dependency caching, increasing build times."
        })
    if infra_results["num_instances"] > 0:
        for inst in infra_results["instances"]:
            # Warn if not using Graviton (ARM)
            inst_type = inst["instance_type"]
            if not any(arm_marker in inst_type for arm_marker in ("g", "a")):
                risks.append({
                    "layer": "infra",
                    "severity": "MEDIUM",
                    "message": f"Instance '{inst['name']}' ({inst_type}) can be migrated to AWS Graviton ARM for up to 40% carbon savings."
                })
            # Warn if in a dirty grid region (Mumbai, Singapore, etc.)
            grid_intensity = await get_realtime_carbon_intensity(inst["region"])
            if grid_intensity > 350.0:
                risks.append({
                    "layer": "infra",
                    "severity": "MEDIUM",
                    "message": f"Instance '{inst['name']}' is running in region '{inst['region']}' with high carbon grid intensity ({grid_intensity} gCO2/kWh). Recommend migrating to us-west-2 or ca-central-1."
                })

    return {
        "total_score": round(total_score, 2),
        "code_carbon": round(code_carbon, 2),
        "ci_carbon": round(ci_carbon, 2),
        "infra_carbon": round(infra_carbon, 2),
        "layers": {
            "code": {
                "carbon": round(code_carbon, 2),
                "breakdown": {
                    "dependencies": dep_results,
                    "ast_patterns": ast_results,
                    "tests": test_results,
                    "codecarbon_physical": codecarbon_overlay
                }
            },
            "ci": {
                "carbon": round(ci_carbon, 2),
                "breakdown": ci_results
            },
            "infra": {
                "carbon": round(infra_carbon, 2),
                "breakdown": infra_results
            }
        },
        "risks": risks
    }
