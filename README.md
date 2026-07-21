# 🌱 Carbotrace — Carbon-Aware Software Analytics Dashboard

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![TimescaleDB](https://img.shields.io/badge/TimescaleDB-PostgreSQL_16-336791.svg?style=flat&logo=postgresql)](https://www.timescale.com/)
[![tree-sitter](https://img.shields.io/badge/AST-tree--sitter-green.svg)](https://tree-sitter.github.io/)
[![Ollama](https://img.shields.io/badge/LLM-Ollama_Qwen_2.5_Coder-black.svg)](https://ollama.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Carbotrace** is a production-grade software carbon footprint measurement and analytics platform. It provides developers and GreenOps teams with unified visibility into software sustainability across **Code-level patterns**, **CI/CD build pipelines**, and **Cloud Infrastructure**.

---

## 📋 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Three-Layer Carbon Model](#-three-layer-carbon-model)
- [Key Features](#-key-features)
- [Carbon Scoring Formulas](#-carbon-scoring-formulas)
- [System Architecture](#-system-architecture)
- [Quick Start Guide](#-quick-start-guide)
  - [Option A: Docker Compose (Recommended)](#option-a-docker-compose-recommended)
  - [Option B: Manual Local Setup](#option-b-manual-local-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [GitHub Action PR Carbon Diff](#-github-action-pr-carbon-diff)
- [Testing](#-testing)
- [License](#-license)

---

## 🏗️ Architectural Overview

Software technology accounts for ~3% of global greenhouse emissions. Existing developer tooling is fragmented into isolated silos (code linters vs AWS billing). **Carbotrace** bridges these silos by correlating static code AST analysis, CI/CD pipeline triggers, and Infrastructure-as-Code configurations into a single standardized **Carbon Severity Score (0.0 to 10.0)**.

---

## 📊 Three-Layer Carbon Model

1. **Layer 1: Code-Level Carbon**
   - Package dependency size & registry metrics (npm, PyPI, Maven, RubyGems).
   - Abstract Syntax Tree (AST) pattern scanning using `tree-sitter` (detecting nested loops, N+1 query patterns, unused imports).
   - Test suite execution footprint estimations.
   - CodeCarbon physical runtime `emissions.csv` overlay parsing.

2. **Layer 2: CI/CD Pipeline Carbon**
   - GitHub Actions workflow structure & run frequency analysis.
   - Runner hardware power profile estimation (macOS Apple Silicon vs Ubuntu/Windows).
   - Redundant PR build calculations and package caching penalty checks.

3. **Layer 3: Infrastructure Carbon**
   - Infrastructure-as-Code (IaC) parsing for Terraform (`.tf`) and CloudFormation (`.json`, `.yaml`).
   - Integration with Cloud Carbon Footprint (CCF) hardware active wattage maps & regional PUE factors.
   - Live grid carbon intensity queries via Electricity Maps API (with static regional averages fallback).
   - Live AWS Cost Explorer API integration for actual cloud resource usage.

---

## ⚡ Key Features

- **Instant URL Analysis:** Paste any public GitHub repository URL to receive a full sustainability audit in seconds.
- **Privacy-First Local LLM:** Recommendations powered by local Ollama (`qwen2.5-coder:1.5b`) with zero code leakage to external AI endpoints.
- **GitHub Action PR Carbon Diff:** Automatically posts PR comments comparing base vs head branch carbon delta, warning developers if carbon score exceeds threshold.
- **Package Size Caching:** PostgreSQL-backed cache for PyPI, npm, Maven, and RubyGems package sizes.
- **Modern Glassmorphic UI:** High-density React + Vite dashboard featuring Recharts visualizations and real-time scanning progress.

---

## 📐 Carbon Scoring Formulas

### Master Carbon Severity Score (0 - 10)
```
Total Score = min(10.0, max(0.0, (Code_Carbon / 1000) × 3 + (CI_Carbon / 800) × 2 + (Infra_Carbon / 10000) × 5))
```

### Layer 1: Code-Level Carbon (g CO2e/month)
```
Dependency_Carbon = (Num_Dependencies × 0.5) + (Package_Size_MB × 0.12)
Pattern_Carbon    = (Nested_Loops × 50) + (N+1_Queries × 75) + (Unused_Imports × 5)
Test_Carbon       = (Num_Tests × 0.5) + (Avg_Duration_Sec × 0.2) + (Coverage_Gap_% × 2.0)
Code_Total        = Dependency_Carbon + Pattern_Carbon + Test_Carbon (+ CodeCarbon_Measured_g)
```

### Layer 2: CI/CD Carbon (g CO2e/month)
```
Build_Carbon     = Num_Builds × Build_Time_Min × CPU_Watts × Grid_Intensity × 0.0002
Redundant_Carbon = (PR_Builds × Build_Time_Min × CPU_Watts) × 0.3
Caching_Penalty  = Missing_Caching_Flag × 1.0min × Num_Builds × CPU_Watts × 0.0002
CI_Total         = Build_Carbon + Redundant_Carbon + Caching_Penalty
```

### Layer 3: Infrastructure Carbon (g CO2e/month)
```
Energy_kWh       = Active_Hours (730h) × Instance_Watts × PUE (1.15) / 1000
Service_Carbon   = Energy_kWh × Grid_Intensity (gCO2e/kWh)
Embodied_Carbon  = (Energy_kWh × 0.1) + (Storage_GB × 0.01)
Infra_Total      = Sum(Service_Carbon + Embodied_Carbon)
```

---

## 💻 System Architecture

```mermaid
graph TD
    User([User / Browser]) -->|HTTP| Frontend[React + Vite Frontend]
    GitHubPR[GitHub Pull Request] -->|Webhook / Action| Action[Carbotrace GitHub Action]
    
    Frontend -->|REST API| Backend[FastAPI Backend]
    Action -->|REST API| Backend
    
    subgraph Backend Engine
        Backend --> GithubClient[GitHub Client / Cloner]
        Backend --> ASTAnalyzer[AST Analyzer - tree-sitter]
        Backend --> DepAnalyzer[Dependency Analyzer]
        Backend --> CIAnalyzer[CI/CD Workflow Analyzer]
        Backend --> IaCAnalyzer[IaC Infrastructure Analyzer]
        Backend --> LLMService[LLM Recommendation Engine]
        Backend --> CostExplorer[AWS Cost Explorer Client]
    end
    
    DepAnalyzer -->|Cache Lookup| DB[(TimescaleDB / PostgreSQL)]
    LLMService -->|Local Inference| Ollama[Ollama - Qwen 2.5 Coder]
    IaCAnalyzer -->|Grid Intensity| ElecMaps[Electricity Maps API]
```

---

## 🚀 Quick Start Guide

### Option A: Docker Compose (Recommended)

Run the entire platform (TimescaleDB + FastAPI Backend) with a single command:

```bash
docker-compose up --build
```

- **Backend API:** `http://localhost:8000`
- **Interactive API Docs (Swagger):** `http://localhost:8000/docs`

---

### Option B: Manual Local Setup

#### 1. Database Setup
Ensure PostgreSQL / TimescaleDB is running on port 5432:
```bash
docker run -d --name carbotrace-db -p 5432:5432 -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=carbotrace timescale/timescaledb:latest-pg16
```

#### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn backend.app.main:app --reload --port 8000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The React frontend will launch on `http://localhost:5173`.

#### 4. (Optional) Local LLM Setup
Install [Ollama](https://ollama.com/) and pull the recommended lightweight coding model:
```bash
ollama pull qwen2.5-coder:1.5b
ollama serve
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgres@localhost:5432/carbotrace` | Async SQLAlchemy database URL |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama service endpoint |
| `OLLAMA_MODEL` | `qwen2.5-coder:1.5b` | Model used for GreenOps recommendations |
| `ELECTRICITY_MAPS_API_KEY` | *(Optional)* | API key for real-time grid intensity |
| `AWS_ACCESS_KEY_ID` | *(Optional)* | AWS credentials for Cost Explorer scanning |
| `AWS_SECRET_ACCESS_KEY` | *(Optional)* | AWS secret key for Cost Explorer scanning |
| `AWS_DEFAULT_REGION` | `us-east-1` | Default AWS region fallback |

---

## 🔌 API Reference

### `POST /api/analyze-repo`
Clones, parses, scores, and generates LLM recommendations for a GitHub repository.

**Request Body:**
```json
{
  "repo_url": "https://github.com/facebook/react",
  "branch": "main",
  "include_infra": true,
  "include_llm": true
}
```

**Response:**
```json
{
  "id": 1,
  "repo_id": 1,
  "total_score": 3.42,
  "code_carbon": 125.3,
  "ci_carbon": 67.2,
  "infra_carbon": 0.0,
  "created_at": "2026-07-20T12:00:00Z",
  "layers": { ... },
  "risks": [ ... ],
  "recommendations": [ ... ]
}
```

### `GET /api/repos`
Retrieves a paginated list of previously analyzed repositories.

### `GET /api/analyses/{id}`
Retrieves detailed breakdown and stored recommendations for a specific analysis ID.

### `GET /api/health`
Health check endpoint verifying database connectivity.

---

## 🐙 GitHub Action PR Carbon Diff

Include Carbotrace in your repository workflows to get automated carbon delta comments on every Pull Request:

Add `.github/workflows/carbotrace.yml`:

```yaml
name: Carbotrace Carbon Audit
on:
  pull_request:
    branches: [ main, master ]

jobs:
  carbon-audit:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Run Carbotrace Audit
        uses: dchitale/carbotrace/action@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          carbotrace-url: 'http://your-carbotrace-instance.com/api'
          threshold: '0.1'
```

---

## 🧪 Testing

Run the full automated test suite using `pytest`:

```bash
cd backend
python -m pytest tests/ -v --cov=app
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.