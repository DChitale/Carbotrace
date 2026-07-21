import os
import logging
from typing import Dict, Any, List
import yaml

logger = logging.getLogger(__name__)


def parse_workflows(repo_dir: str) -> List[Dict[str, Any]]:
    """Scan and parse GitHub Action workflows in the repository."""
    workflows = []
    workflows_dir = os.path.join(repo_dir, ".github", "workflows")
    
    if not os.path.exists(workflows_dir):
        return workflows
        
    for file in os.listdir(workflows_dir):
        if file.endswith((".yml", ".yaml")):
            file_path = os.path.join(workflows_dir, file)
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    data = yaml.safe_load(f)
                    if isinstance(data, dict):
                        workflows.append(data)
            except Exception as e:
                logger.error(f"Error parsing workflow file {file_path}: {e}")
                
    return workflows


async def analyze_ci_pipeline(repo_dir: str) -> Dict[str, Any]:
    """Parse CI/CD workflows and calculate CI layer carbon emissions.

    Applies the specified scoring formulas:
    - Build_Carbon = Num_Builds * Build_Time_Min * CPU_Watts * Grid_Intensity * 0.0002
    - Redundant_Carbon = (PR_Builds * Build_Time * Watts) * 0.3
    - Caching_Penalty = Missing_Caching * 60s * Num_Builds * Watts * 0.0002
    """
    workflows = parse_workflows(repo_dir)
    num_workflows = len(workflows)
    
    # Defaults
    num_builds = 30 * max(num_workflows, 1)  # 30 builds per month per workflow
    pr_builds = 15 * max(num_workflows, 1)   # 15 PR builds per month per workflow
    build_time_min = 5.0                     # 5 minutes average build time
    cpu_watts = 150.0                        # 150W default runner power draw
    grid_intensity = 475.0                   # 475 gCO2/kWh global average grid intensity
    missing_caching = 1                      # Default to penalty
    
    if num_workflows > 0:
        caching_found = False
        
        for wf in workflows:
            # Check runs-on runner type
            jobs = wf.get("jobs", {})
            if isinstance(jobs, dict):
                for job_id, job_val in jobs.items():
                    if isinstance(job_val, dict):
                        runner = str(job_val.get("runs-on", "")).lower()
                        if "macos" in runner:
                            cpu_watts = 100.0  # MacOS runner (Apple Silicon is more efficient)
                        elif "ubuntu" in runner or "windows" in runner:
                            cpu_watts = 150.0
                            
                        # Scan steps for caching
                        steps = job_val.get("steps", [])
                        if isinstance(steps, list):
                            for step in steps:
                                if isinstance(step, dict):
                                    uses = str(step.get("uses", "")).lower()
                                    # Common cache methods
                                    if "cache" in uses or "setup-node" in uses or "setup-python" in uses:
                                        caching_found = True
            
            # Check custom build times or triggers in name/metadata (optional enhancement)
            triggers = wf.get("on", {})
            if isinstance(triggers, list):
                if "pull_request" not in triggers:
                    pr_builds = 0
            elif isinstance(triggers, dict):
                if "pull_request" not in triggers:
                    pr_builds = 0
                    
        if caching_found:
            missing_caching = 0

    # If there are no workflows, set builds and PR builds to 0
    if num_workflows == 0:
        num_builds = 0
        pr_builds = 0
        missing_caching = 0

    # Formulas
    build_carbon = num_builds * build_time_min * cpu_watts * grid_intensity * 0.0002
    redundant_carbon = pr_builds * build_time_min * cpu_watts * 0.3
    
    # 60s in minutes is 1.0 (so penalty is applied per build in minutes)
    caching_penalty = missing_caching * 1.0 * num_builds * cpu_watts * 0.0002
    
    ci_total = build_carbon + redundant_carbon + caching_penalty

    return {
        "num_workflows": num_workflows,
        "num_builds": num_builds,
        "pr_builds": pr_builds,
        "build_time_min": build_time_min,
        "cpu_watts": cpu_watts,
        "missing_caching": missing_caching,
        "build_carbon": build_carbon,
        "redundant_carbon": redundant_carbon,
        "caching_penalty": caching_penalty,
        "carbon": ci_total
    }
