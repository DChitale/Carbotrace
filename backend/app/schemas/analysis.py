from pydantic import BaseModel, HttpUrl
from typing import Optional, List, Dict, Any
from datetime import datetime


class AnalyzeRepoRequest(BaseModel):
    repo_url: str
    branch: Optional[str] = None
    include_infra: Optional[bool] = True
    include_llm: Optional[bool] = True


class RiskItem(BaseModel):
    layer: str
    severity: str
    message: str


class RecommendationItem(BaseModel):
    issue: str
    description: str
    savings_percent: float
    effort: str
    priority: str


class LayerBreakdown(BaseModel):
    carbon: float
    breakdown: Dict[str, Any]


class LayersBreakdown(BaseModel):
    code: LayerBreakdown
    ci: LayerBreakdown
    infra: LayerBreakdown


class AnalysisResponse(BaseModel):
    id: int
    repo_id: int
    total_score: float
    code_carbon: float
    ci_carbon: float
    infra_carbon: float
    created_at: datetime
    layers: Optional[LayersBreakdown] = None
    risks: Optional[List[RiskItem]] = None
    recommendations: Optional[List[RecommendationItem]] = None

    class Config:
        from_attributes = True


class RepoResponse(BaseModel):
    id: int
    url: str
    name: str
    owner: str
    language: Optional[str] = None
    last_analyzed_at: datetime
    history: Optional[List[AnalysisResponse]] = None

    class Config:
        from_attributes = True
