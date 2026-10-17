import json
import logging
import hashlib
import aiohttp
from typing import Dict, List, Any

from backend.app.config import settings

logger = logging.getLogger(__name__)

# Simple in-memory cache for LLM results (hash of input -> recommendations list)
_llm_cache: Dict[str, List[Dict[str, Any]]] = {}


def generate_static_recommendations(analysis_results: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate high-quality static recommendations as a fallback when LLM is unavailable."""
    recommendations = []
    
    # 1. Check dependencies
    code_breakdown = analysis_results.get("layers", {}).get("code", {}).get("breakdown", {})
    dep_info = code_breakdown.get("dependencies", {})
    num_deps = dep_info.get("num_dependencies", 0)
    size_mb = dep_info.get("size_mb", 0.0)
    
    if num_deps > 40:
        recommendations.append({
            "issue": f"High dependency count ({num_deps} packages)",
            "description": "Evaluate and prune unused packages in package.json or requirements.txt. Use tools like depcheck or pip-audit to identify unused libraries.",
            "savings_percent": 12.0,
            "effort": "LOW",
            "priority": "MEDIUM"
        })
    if size_mb > 150.0:
        recommendations.append({
            "issue": f"Large dependency footprint ({round(size_mb, 1)} MB)",
            "description": "Consider replacing large packages with lightweight alternatives (e.g. use native JS methods instead of lodash, or use alpine/slim base images in python).",
            "savings_percent": 18.0,
            "effort": "MEDIUM",
            "priority": "HIGH"
        })

    # 2. Check AST patterns
    ast_info = code_breakdown.get("ast_patterns", {})
    nested_loops = ast_info.get("nested_loops", 0)
    n_plus_one = ast_info.get("n_plus_one_queries", 0)
    unused_imports = ast_info.get("unused_imports", 0)
    
    if nested_loops > 0:
        recommendations.append({
            "issue": f"Detected {nested_loops} nested loop(s)",
            "description": "Refactor nested loops using lookup maps/dictionaries or set-based intersections to reduce CPU instructions from O(N^2) to O(N).",
            "savings_percent": 15.0,
            "effort": "MEDIUM",
            "priority": "MEDIUM"
        })
    if n_plus_one > 0:
        recommendations.append({
            "issue": f"Detected {n_plus_one} N+1 database queries",
            "description": "Optimize database queries by utilizing eager loading, joins, or batch/bulk queries instead of performing queries inside loop bodies.",
            "savings_percent": 25.0,
            "effort": "HIGH",
            "priority": "HIGH"
        })
    if unused_imports > 0:
        details_list = ast_info.get("unused_imports_details", [])
        if details_list:
            desc = "Remove unused import statements to reduce memory overhead and start-up latency:\n"
            desc += "\n".join(f"- '{d['name']}' in {d['file']} at line {d['line']}" for d in details_list)
        else:
            desc = "Remove unused import statements to reduce memory overhead and compile/start-up latency."
            
        recommendations.append({
            "issue": f"Found {unused_imports} unused imports",
            "description": desc,
            "savings_percent": 3.0,
            "effort": "LOW",
            "priority": "LOW"
        })

    # 3. Check CI
    ci_breakdown = analysis_results.get("layers", {}).get("ci", {}).get("breakdown", {})
    missing_caching = ci_breakdown.get("missing_caching", 0)
    
    if missing_caching == 1:
        recommendations.append({
            "issue": "Missing dependency caching in CI workflow",
            "description": "Enable caching in your GitHub Actions workflows (e.g. actions/setup-node with 'cache: npm' or actions/cache). This saves build time and carbon emissions by skipping registry fetches.",
            "savings_percent": 20.0,
            "effort": "LOW",
            "priority": "HIGH"
        })

    # 4. Check Infra
    infra_breakdown = analysis_results.get("layers", {}).get("infra", {}).get("breakdown", {})
    num_instances = infra_breakdown.get("num_instances", 0)
    
    if num_instances > 0:
        recommendations.append({
            "issue": "Migrate cloud instances to Graviton ARM",
            "description": "Upgrade Intel/AMD based EC2 instances to AWS Graviton (e.g., t3 -> t4g, m5 -> m6g). Graviton instances offer up to 40% better price-performance and significantly lower carbon profiles.",
            "savings_percent": 35.0,
            "effort": "MEDIUM",
            "priority": "HIGH"
        })
        recommendations.append({
            "issue": "Region shift to low-carbon grid",
            "description": "Deploy infrastructure in green/low-carbon AWS regions (e.g., migrate from ap-south-1 or us-east-1 to Oregon us-west-2 or ca-central-1) to reduce operational carbon footprint by up to 80%.",
            "savings_percent": 60.0,
            "effort": "HIGH",
            "priority": "HIGH"
        })
        
    # Ensure we return at least a default recommendation
    if not recommendations:
        recommendations.append({
            "issue": "Optimize codebase build size",
            "description": "Regularly run audits on code quality and remove unreferenced dependencies.",
            "savings_percent": 5.0,
            "effort": "LOW",
            "priority": "LOW"
        })
        
    return recommendations


async def generate_recommendations(analysis_results: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Generate carbon recommendations using local Ollama model (with static fallback)."""
    # Create input cache hash
    input_str = json.dumps({
        "total_score": analysis_results.get("total_score"),
        "code_carbon": analysis_results.get("code_carbon"),
        "ci_carbon": analysis_results.get("ci_carbon"),
        "infra_carbon": analysis_results.get("infra_carbon")
    }, sort_keys=True)
    input_hash = hashlib.sha256(input_str.encode("utf-8")).hexdigest()
    
    if input_hash in _llm_cache:
        return _llm_cache[input_hash]

    logger.info(f"Generating LLM recommendations using model {settings.OLLAMA_MODEL}...")
    
    prompt = f"""
    You are an expert GreenOps AI coding assistant.
    Analyze the following software carbon footprint analysis data and provide EXACTLY 3-4 actionable, high-impact recommendations to reduce carbon footprint.
    Format your response STRICTLY as a JSON array of objects, where each object has these fields:
    - "issue" (string: short description of the issue)
    - "description" (string: detailed fix description)
    - "savings_percent" (float: estimated percent carbon savings, e.g. 15.0)
    - "effort" (string: "LOW", "MEDIUM", or "HIGH")
    - "priority" (string: "LOW", "MEDIUM", or "HIGH")

    Analysis Data:
    {json.dumps(analysis_results, indent=2)}

    Output valid JSON only. Do not wrap in markdown tags or include conversational text.
    """
    
    # Priority: local Ollama first, then Ollama Cloud, then static rules.
    url = f"{settings.OLLAMA_LOCAL_HOST}/api/generate"
    payload = {
        "model": settings.OLLAMA_LOCAL_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }
    
    try:
        timeout = aiohttp.ClientTimeout(total=45)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(url, json=payload) as response:
                if response.status == 200:
                    result = await response.json()
                    response_text = result.get("response", "").strip()
                    
                    # Clean up JSON wrappers if LLM returned them
                    if "```json" in response_text:
                        response_text = response_text.split("```json")[1].split("```")[0].strip()
                    elif "```" in response_text:
                        response_text = response_text.split("```")[1].strip()
                        
                    parsed = json.loads(response_text)
                    recs = []
                    if isinstance(parsed, list):
                        recs = parsed
                    elif isinstance(parsed, dict) and "recommendations" in parsed and isinstance(parsed["recommendations"], list):
                        recs = parsed["recommendations"]

                    if len(recs) > 0:
                        _llm_cache[input_hash] = recs
                        logger.info(f"Successfully generated {len(recs)} recommendations from Ollama LLM.")
                        return recs
    except Exception as e:
        logger.warning(f"Local Ollama recommendation generation failed: {e}. Trying Ollama Cloud.")

    # Step 2: Ollama Cloud (OpenAI-compatible /v1 API) when an API key is configured.
    if settings.OLLAMA_API_KEY:
        try:
            cloud_url = f"{settings.OLLAMA_HOST.rstrip('/')}/v1/chat/completions"
            cloud_headers = {"Authorization": f"Bearer {settings.OLLAMA_API_KEY}"}
            cloud_payload = {
                "model": settings.OLLAMA_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            }
            timeout = aiohttp.ClientTimeout(total=60)
            async with aiohttp.ClientSession(timeout=timeout) as session:
                async with session.post(cloud_url, json=cloud_payload, headers=cloud_headers) as response:
                    if response.status == 200:
                        result = await response.json()
                        response_text = result["choices"][0]["message"]["content"].strip()

                        # Clean up JSON wrappers if LLM returned them
                        if "```json" in response_text:
                            response_text = response_text.split("```json")[1].split("```")[0].strip()
                        elif "```" in response_text:
                            response_text = response_text.split("```")[1].strip()

                        parsed = json.loads(response_text)
                        recs = []
                        if isinstance(parsed, list):
                            recs = parsed
                        elif isinstance(parsed, dict) and "recommendations" in parsed and isinstance(parsed["recommendations"], list):
                            recs = parsed["recommendations"]

                        if len(recs) > 0:
                            _llm_cache[input_hash] = recs
                            logger.info(f"Successfully generated {len(recs)} recommendations from Ollama Cloud.")
                            return recs
                    else:
                        logger.warning(f"Ollama Cloud returned status {response.status}. Falling back to static engine.")
        except Exception as e:
            logger.warning(f"Ollama Cloud recommendation generation failed: {e}. Falling back to static engine.")

    # Step 3: Static fallback
    recs = generate_static_recommendations(analysis_results)
    _llm_cache[input_hash] = recs
    return recs

