# Software Requirements Specification (SRS)

## Carbotrace — Carbon-Aware Software Analytics Dashboard

| Field | Value |
| :--- | :--- |
| **Document Version** | 1.0 |
| **Date** | August 31, 2026 |
| **Author** | DC (Project Lead) |
| **Status** | Approved / Baseline |
| **License** | MIT |

---

## Table of Contents

- [1. Introduction](#1-introduction)
  - [1.1 Purpose](#11-purpose)
  - [1.2 Scope](#12-scope)
  - [1.3 Definitions, Acronyms, and Abbreviations](#13-definitions-acronyms-and-abbreviations)
  - [1.4 References](#14-references)
  - [1.5 Overview](#15-overview)
- [2. Overall Description](#2-overall-description)
  - [2.1 Product Perspective](#21-product-perspective)
  - [2.2 Product Functions](#22-product-functions)
  - [2.3 User Characteristics](#23-user-characteristics)
  - [2.4 Constraints](#24-constraints)
  - [2.5 Assumptions and Dependencies](#25-assumptions-and-dependencies)
- [3. Specific Requirements](#3-specific-requirements)
  - [3.1 External Interfaces](#31-external-interfaces)
  - [3.2 Functional Requirements](#32-functional-requirements)
  - [3.3 Performance Requirements](#33-performance-requirements)
  - [3.4 Design Constraints](#34-design-constraints)
  - [3.5 Software System Attributes](#35-software-system-attributes)
  - [3.6 Other Requirements](#36-other-requirements)

---

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) establishes the formal, end-to-end functional and non-functional requirements for the **Carbotrace** platform — an open-source, production-grade, carbon-aware software analytics dashboard and GreenOps audit engine.

This document is intended for:
- Core software developers, DevOps/GreenOps engineers, and architects maintaining or extending Carbotrace.
- Academic evaluators, peer reviewers, and defense committees assessing software sustainability tooling.
- Quality assurance (QA) teams and open-source contributors validating the integrity of carbon estimation models and scoring pipelines.

### 1.2 Scope
**Carbotrace** is an end-to-end sustainability intelligence platform that correlates static code analysis, continuous integration/continuous deployment (CI/CD) pipelines, and Infrastructure-as-Code (IaC) footprints into a unified **Carbon Severity Score (0–100 Eco-Score)**.

#### Core Capabilities:
- **Zero-Config Instant Analysis:** Analysis of public/private GitHub repositories by pasting a repository URL or authenticating via Personal Access Token (PAT).
- **Three-Layer Carbon Model:**
  1. *Layer 1 (Code-Level):* Dependency tree size estimation (npm, PyPI, Maven, RubyGems), Abstract Syntax Tree (AST) pattern scanning using `tree-sitter`, and CodeCarbon runtime `emissions.csv` overlay parsing.
  2. *Layer 2 (CI/CD Pipeline):* GitHub Actions workflow configuration parsing, build frequency estimations, runner power consumption modeling (Apple Silicon vs. x86 AMD/Intel), and cache penalty tracking.
  3. *Layer 3 (Infrastructure):* Terraform (`.tf`) and CloudFormation template parsing, Cloud Carbon Footprint (CCF) coefficient mapping, real-time grid carbon intensity querying via Electricity Maps API, and AWS Cost Explorer integration.
- **Privacy-First AI Recommendations:** Local LLM inference engine powered by Ollama (`qwen2.5-coder:1.5b`), generating contextual refactoring advice with zero code transmission to third-party endpoints.
- **Automated Pull Request Carbon Delta:** GitHub Action integration that performs base vs. head branch carbon diffs and posts markdown comments directly to pull requests with threshold warnings.
- **Interactive Web Dashboard:** High-density React + Vite interface featuring responsive score gauges, layer distribution charts, regional grid intensity maps, and historical audit tracking.

#### Out of Scope (v1.0):
- Real-time bytecode/runtime kernel tracing or physical socket wattage telemetry on production clusters.
- Non-GitHub VCS platforms (GitLab, Bitbucket, Azure Repos) in baseline version.
- Native mobile clients (Android/iOS).

### 1.3 Definitions, Acronyms, and Abbreviations

| Term / Acronym | Definition |
| :--- | :--- |
| **AST** | Abstract Syntax Tree — structural syntax graph of parsed source code. |
| **CCF** | Cloud Carbon Footprint — open-source standard methodology and coefficient dataset for cloud carbon modeling. |
| **CI/CD** | Continuous Integration / Continuous Deployment. |
| **CO2e** | Carbon Dioxide Equivalent — standard unit used to measure greenhouse gas footprints based on global warming potential. |
| **Eco-Score** | Standardized 0–100 composite sustainability rating (100 = optimal, minimal emissions). |
| **GreenOps** | Operational framework integrating sustainability and carbon efficiency into DevOps practices. |
| **IaC** | Infrastructure as Code — declarative infrastructure definitions (Terraform, CloudFormation). |
| **LLM** | Large Language Model (e.g., Qwen 2.5 Coder 1.5B) used for local, contextual code recommendations. |
| **N+1 Query** | Database access anti-pattern executing sequential queries inside a loop rather than batched queries. |
| **PAT** | Personal Access Token (GitHub) for authenticating API and clone requests. |
| **PUE** | Power Usage Effectiveness — ratio describing datacenter energy efficiency ($PUE \ge 1.0$). |
| **SCI** | Software Carbon Intensity (ISO/IEC 21031:2024 standard): $SCI = \frac{(E \times I) + M}{R}$. |
| **TDP** | Thermal Design Power — maximum power consumption under maximum theoretical workload. |
| **TimescaleDB** | PostgreSQL extension providing hypertable partitioning for time-series analytics. |

### 1.4 References
1. **IEEE Std 830-1998:** IEEE Recommended Practice for Software Requirements Specifications.
2. **ISO/IEC 21031:2024 (SCI):** Information technology — Software Carbon Intensity (SCI) specification.
3. **Cloud Carbon Footprint (CCF):** Open-source cloud emissions measurement methodology and hardware coefficient database.
4. **CodeCarbon (mlco2/codecarbon):** Empirical package tracking compute energy and emissions in grams CO2e.
5. **Eco-CI Energy Estimation:** Green Coding Solutions empirical baseline benchmarks for GitHub Actions virtual runners.
6. **GREENS 2025 / ICSE 2025:** Research survey on static code smells and software energy proxy signals.
7. **FastAPI & Pydantic:** ASGI framework and data validation documentation.
8. **tree-sitter:** Incremental AST parsing library specifications.

### 1.5 Overview
The rest of this document contains:
- **Section 2 (Overall Description):** Perspective, functions, user profiles, constraints, assumptions, and dependencies.
- **Section 3 (Specific Requirements):** Detailed external interfaces, categorized functional requirements (FR-100 to FR-1200), performance metrics, architectural constraints, and software quality attributes.

---

## 2. Overall Description

### 2.1 Product Perspective
Software systems account for ~3% of global carbon emissions. Developer tooling remains siloed between runtime profiling, cloud billing consoles, and static linter checks. Carbotrace unifies these domains into a standardized multi-layer architecture:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CARBOTRACE SYSTEM                             │
├────────────────────┬─────────────────────┬──────────────────────────────┤
│   Layer 1: Code    │   Layer 2: CI/CD    │   Layer 3: Infrastructure    │
│   ─────────────    │   ──────────────    │   ───────────────────────    │
│   • Manifest Sizes │   • Workflow Steps  │   • Terraform / CF Scanners  │
│   • tree-sitter AST│   • Runner Hardware │   • CCF Power Coefficients   │
│   • Test Heuristics│   • Caching Audits  │   • Grid Carbon Intensity    │
│   • CodeCarbon CSV │   • PR Redundancies │   • AWS Cost Explorer Sync   │
└────────────────────┴─────────────────────┴──────────────────────────────┘
                                  │
                                  ▼
        ┌──────────────────────────────────────────────────┐
        │     Scoring Engine (ISO/IEC 21031 Compliant)     │
        │    Composite Eco-Score (0–100) & Severity Grades │
        └─────────────────────────┬────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────┐                            ┌─────────────────────┐
│  React Dashboard │                            │ GitHub Action Diff  │
│  (Glassmorphism) │                            │ (Automated PR Posts)│
└──────────────────┘                            └─────────────────────┘
```

The system interacts with external entities as follows:
- **Client Tier:** React 18 SPA (Vite) communicating over REST APIs.
- **Service Tier:** FastAPI asynchronous server orchestrating analysis micro-services.
- **Persistence Tier:** PostgreSQL 16 with TimescaleDB for analysis history and registry package caching.
- **Inference Tier:** Local Ollama daemon executing Qwen 2.5 Coder for zero-data-leakage recommendations.
- **External Integration Tier:** GitHub REST/GraphQL API, npm/PyPI/Maven/RubyGems registries, Electricity Maps API, and AWS Cost Explorer.

### 2.2 Product Functions

| Function ID | Major Product Function | High-Level Operational Summary |
| :--- | :--- | :--- |
| **F-01** | Git Repository Ingestion | Clones target public/private repositories into secure temporary sandboxes with automated branch tracking. |
| **F-02** | Multi-Ecosystem Dependency Audit | Parses `package.json`, `requirements.txt`, `pom.xml`, and `Gemfile` to resolve total dependency count and package disk footprints. |
| **F-03** | AST Inefficiency Detection | Executes multi-language tree-sitter grammars (Python, JavaScript, Go) to detect nested loops, N+1 patterns, and unused imports. |
| **F-04** | CI/CD Pipeline Carbon Audit | Analyzes GitHub Actions workflow run frequencies, matrix jobs, caching flags, and runner hardware wattage profiles. |
| **F-05** | Cloud Infrastructure Carbon Audit | Parses Terraform and CloudFormation declarations, computing energy usage via CCF active/idle wattages and grid carbon intensity. |
| **F-06** | CodeCarbon Runtime Overlay | Detects and parses `emissions.csv` generated by CodeCarbon to integrate empirical runtime socket telemetry. |
| **F-07** | Composite Scoring & Risk Flagging | Synthesizes all layers into a normalized 0–100 Eco-Score with granular risk classification. |
| **F-08** | Privacy-Preserving LLM Advice | Queries a local Ollama model to produce actionable, structured code refactoring recommendations. |
| **F-09** | CI/CD Pull Request Carbon Diff | Compares base and PR branches inside GitHub Actions, posting automated PR reviews with carbon deltas. |
| **F-10** | Historical Analytics & Trends | Persists historical audits in TimescaleDB for regression detection and repository sustainability tracking over time. |

### 2.3 User Characteristics

| User Role | Responsibilities & Needs | Technical Profile |
| :--- | :--- | :--- |
| **Software Developers** | Building applications; requires instant feedback on PR carbon delta and code-level efficiency suggestions. | Proficient in Git, CLI, code editors, and modern web applications. |
| **GreenOps / DevOps Engineers** | Managing CI pipelines and cloud infrastructure; focuses on runner optimizations and cloud regional shifts. | Advanced knowledge of CI/CD, Terraform, AWS architectures, and Docker. |
| **Engineering Managers / Leads** | Tracking sustainability compliance across organizational repositories. | Requires executive-level summary charts, trends, and risk summaries. |
| **Academic / Sustainability Researchers** | Benchmarking software energy estimation models and validating empirical formulas. | Data-driven; requires access to exact formulas, coefficients, and raw metric breakdowns. |

### 2.4 Constraints
1. **Local LLM Execution:** Ollama must run locally on the host (`http://localhost:11434`) without uploading proprietary code to external APIs (OpenAI, Anthropic).
2. **Third-Party API Limits:** GitHub API rate limits (60 req/hr unauthenticated, 5000 req/hr with PAT) require aggressive dependency and package size caching.
3. **Database Architecture:** Requires PostgreSQL 16+ with the TimescaleDB extension enabled.
4. **Licensing Constraints:** The codebase and all bundled dependencies must comply with the MIT License.
5. **Static Analysis Bounds:** Static AST scanning serves as an efficiency proxy signal and cannot execute untrusted code or simulate arbitrary runtime dynamics.

### 2.5 Assumptions and Dependencies
- **Runtime Environment:** Server equipped with Python 3.11+, Node.js 18+, Docker Engine 24+, and at least 4 GB RAM.
- **Git Availability:** The host operating system or container must have the `git` binary installed and accessible in the system `$PATH`.
- **Electricity Data Fallback:** When the Electricity Maps API key is omitted or unreachable, the system assumes regional standard fallback intensities derived from the Cloud Carbon Footprint dataset.
- **Package Registries:** Package size endpoints (npmjs.org, pypi.org, maven.org, rubygems.org) remain operational and accessible via standard HTTPS.

---

## 3. Specific Requirements

### 3.1 External Interfaces

#### 3.1.1 User Interfaces
- **UI-01 (Hero Search View):** Single-input entry point accepting repository URLs with real-time format validation, branch selection, and execution options (include LLM, include Infra).
- **UI-02 (ScoreGauge Component):** Visual radial gauge rendering the 0–100 Eco-Score with contextual color grading:
  - `Grade A (85–100)`: Clean / Highly Sustainable (Green `#10B981`)
  - `Grade B (60–84)`: Moderate Impact / Optimization Opportunities (Amber `#F59E0B`)
  - `Grade C (0–59)`: High Carbon Footprint / Critical Refactoring Needed (Red `#EF4444`)
- **UI-03 (Layer Breakdown Cards):** Interactive cards displaying Layer 1 (Code), Layer 2 (CI/CD), and Layer 3 (Infra) metrics with nested detail views.
- **UI-04 (Emissions Distribution Chart):** Responsive Recharts visualizations depicting relative carbon contribution across dependencies, AST smells, CI builds, and cloud resources.
- **UI-05 (Risk Assessment List):** Severity-badged list (High / Medium / Low) highlighting concrete anti-patterns (e.g., missing CI caching, N+1 query detected).
- **UI-06 (Recommendation Panel):** Structured AI recommendations showing issue title, description, estimated carbon savings percentage, and implementation effort.
- **UI-07 (Audit History Table):** Paginated data grid of historical scans with sorting, timestamp filters, and direct analysis reloading.
- **UI-08 (GitHub Authentication Modal):** Secure PAT entry modal allowing repository auto-discovery and private repository scans.

#### 3.1.2 Hardware Interfaces
No direct hardware device connections required. The system leverages standardized POSIX/Win32 compute, network, and disk storage abstractions.

#### 3.1.3 Software Interfaces
- **SI-01 (GitHub REST API):** Communicates over HTTPS to retrieve repository metadata, branches, user profiles, and repository listings.
- **SI-02 (npm Registry API):** Interrogates `https://registry.npmjs.org/<pkg>` to extract tarball unpacked sizes.
- **SI-03 (PyPI JSON API):** Queries `https://pypi.org/pypi/<pkg>/json` to extract release distribution archive sizes.
- **SI-04 (Maven Central API):** Queries `https://search.maven.org/solrsearch/select` for Java artifact size metadata.
- **SI-05 (RubyGems API):** Queries `https://rubygems.org/api/v1/gems/<pkg>.json` for gem release footprints.
- **SI-06 (Electricity Maps API):** Fetches real-time regional grid carbon intensity in $gCO_2e/kWh$.
- **SI-07 (AWS Cost Explorer API):** Uses `boto3` to retrieve real cloud service usage hours and compute allocations.
- **SI-08 (Ollama REST API):** Connects to `http://localhost:11434/api/generate` with model `qwen2.5-coder:1.5b`.
- **SI-09 (PostgreSQL/TimescaleDB):** Connects via `asyncpg` on TCP port 5432 using standard connection pooling.

#### 3.1.4 Communications Interfaces
- **CI-01 (RESTful HTTP/HTTPS):** JSON payload transfer over HTTP/1.1 and HTTP/2.
- **CI-02 (CORS Protection):** Configured CORS middleware supporting development (`localhost:5173`) and production origins with strict header validations.

---

### 3.2 Functional Requirements

#### 3.2.1 Repository Ingestion & Management (FR-100)
- **FR-101:** The system shall accept a GitHub repository URL via `POST /api/analyze-repo`.
- **FR-102:** The system shall parse and validate repository URLs to extract `owner` and `repo_name`, rejecting malformed inputs with HTTP 400.
- **FR-103:** The system shall clone repositories into an isolated temporary directory (`temp_repos/<uuid>`) using GitPython.
- **FR-104:** The system shall support checking out user-specified branches or tags.
- **FR-105:** The system shall support authenticated cloning for private repositories using a GitHub Personal Access Token.
- **FR-106:** The system shall register or update the repository in the `repositories` table (`id`, `url`, `name`, `owner`, `language`, `last_analyzed_at`).
- **FR-107:** The system shall asynchronously remove cloned repositories from disk immediately upon analysis completion.
- **FR-108:** The system shall perform a clean purge of `temp_repos/` on backend startup and graceful shutdown.

#### 3.2.2 Dependency Carbon Analysis (FR-200)
- **FR-201:** The system shall detect and parse dependency files across ecosystems:
  - JavaScript / Node: `package.json`
  - Python: `requirements.txt`, `setup.py`, `pyproject.toml`
  - Java: `pom.xml`
  - Ruby: `Gemfile`
- **FR-202:** The system shall compute total dependency count and resolve package disk footprint in Megabytes (MB).
- **FR-203:** The system shall query the `package_cache` table to retrieve cached package sizes before querying external registries.
- **FR-204:** If a package is not present in the cache, the system shall fetch its size from the corresponding package registry and persist the result to `package_cache`.
- **FR-205:** The system shall compute dependency carbon emissions in grams CO2e using the SCI energy formula:
  $$\text{Energy}_{\text{install}}\text{ (kWh)} = \text{Size}_{\text{MB}} \times 0.000015$$
  $$\text{Carbon}_{\text{deps}}\text{ (g CO}_2\text{e)} = \text{Energy}_{\text{install}} \times \text{Grid Intensity}$$
- **FR-206:** If an external package registry query times out or returns 404, the system shall record a default fallback size and log a warning without failing the entire analysis.

#### 3.2.3 AST Static Code Pattern Analysis (FR-300)
- **FR-301:** The system shall initialize tree-sitter parsers for Python, JavaScript, and Go.
- **FR-302:** The system shall traverse the repository source tree, ignoring build artifacts, virtual environments, `.git`, and vendor directories.
- **FR-303:** The system shall detect **nested loops** ($depth \ge 2$) via AST node hierarchy analysis and record total occurrences.
- **FR-304:** The system shall detect **N+1 query patterns** (ORM or SQL query calls executed within loop constructs) and record total occurrences.
- **FR-305:** The system shall detect **unused imports** and record total occurrences.
- **FR-306:** The system shall identify oversized source files exceeding 1,000 lines of code.
- **FR-307:** The system shall calculate code efficiency penalty points according to the calibrated scoring weights:
  $$\text{AST Penalty} = \min(40, (\text{Nested Loops} \times 3) + (\text{N+1 Queries} \times 5) + (\text{Unused Imports} \times 0.5) + (\text{Large Files} \times 1))$$
- **FR-308:** The system shall output the total file count and breakdown of detected code smells.

#### 3.2.4 CI/CD Workflow Carbon Audit (FR-400)
- **FR-401:** The system shall detect and parse YAML configuration files in `.github/workflows/`.
- **FR-402:** The system shall estimate monthly build count based on configured workflow triggers (`push`, `pull_request`, `schedule`, `workflow_dispatch`).
- **FR-403:** The system shall inspect `runs-on` tags and assign average runner power ratings:
  - Linux / Windows (`ubuntu-latest`, `windows-latest`): 12.0W average active power.
  - macOS Apple Silicon (`macos-latest`, `macos-14`): 6.5W average active power.
- **FR-404:** The system shall detect missing dependency caching configurations (`actions/cache`, `setup-node` caching, `setup-python` caching).
- **FR-405:** The system shall calculate monthly CI energy and carbon emissions:
  $$\text{Energy}_{\text{CI}}\text{ (kWh)} = \text{Num Builds} \times \text{Build Time}_{\text{min}} \times \left(\frac{1}{60}\right) \times \text{Runner Watts} \times \frac{\text{PUE}}{1000}$$
  $$\text{Carbon}_{\text{CI}}\text{ (g CO}_2\text{e)} = \text{Energy}_{\text{CI}} \times \text{Grid Intensity} \times (1 + \text{Missing Cache Penalty} + \text{Redundant PR Penalty})$$
- **FR-406:** If no workflows exist, the system shall record zero CI carbon and generate an informational risk notification recommending CI sustainability tracking.

#### 3.2.5 Infrastructure-as-Code (IaC) Carbon Audit (FR-500)
- **FR-501:** The system shall parse Terraform files (`.tf`) and CloudFormation templates (`.json`, `.yaml`) in the repository.
- **FR-502:** The system shall extract cloud provider resource types, instance types (e.g., `t3.medium`, `c5.xlarge`), allocated storage (GB), and target deployment regions.
- **FR-503:** The system shall match instance types against the Cloud Carbon Footprint (CCF) coefficient dataset to retrieve average active/idle wattage and regional PUE.
- **FR-504:** The system shall calculate operational and embodied cloud carbon emissions:
  $$\text{Energy}_{\text{Infra}}\text{ (kWh)} = 730\text{ hours} \times \text{Instance Watts} \times \frac{\text{PUE}}{1000}$$
  $$\text{Carbon}_{\text{Service}}\text{ (g CO}_2\text{e)} = \text{Energy}_{\text{Infra}} \times \text{Regional Grid Intensity}$$
  $$\text{Carbon}_{\text{Embodied}}\text{ (g CO}_2\text{e)} = (\text{Energy}_{\text{Infra}} \times 0.1) + (\text{Storage}_{\text{GB}} \times 0.01)$$
  $$\text{Carbon}_{\text{Infra Total}} = \sum (\text{Carbon}_{\text{Service}} + \text{Carbon}_{\text{Embodied}})$$
- **FR-505:** If AWS credentials are provided in the environment, the system shall optionally augment IaC findings with live AWS Cost Explorer resource statistics.

#### 3.2.6 CodeCarbon Runtime Telemetry Overlay (FR-600)
- **FR-601:** The system shall scan for the presence of `emissions.csv` in the repository root or test output directories.
- **FR-602:** The system shall parse recorded metrics: duration (seconds), CPU energy (kWh), GPU energy (kWh), RAM energy (kWh), and measured emissions (g CO2e).
- **FR-603:** The system shall overlay measured physical telemetry directly into Layer 1 reporting when present.

#### 3.2.7 Master Carbon Scoring Engine (FR-700)
- **FR-701:** The system shall calculate the composite **Master Eco-Score (0–100)** as:
  $$\text{Eco-Score} = \max\left(0, \min\left(100, 100 - (\text{AST Penalty} + \text{Dep Penalty} + \text{CI Penalty} + \text{Infra Penalty})\right)\right)$$
- **FR-702:** The system shall assign categorical sustainability grades:
  - **Grade A:** Score $\ge 85$
  - **Grade B:** $60 \le \text{Score} < 85$
  - **Grade C:** Score $< 60$
- **FR-703:** The system shall generate structured risk objects with `layer`, `severity` (HIGH/MEDIUM/LOW), and `message`.
- **FR-704:** The system shall persist complete analysis records and layer details to the database under a single transaction.

#### 3.2.8 Local AI Recommendation Service (FR-800)
- **FR-801:** The system shall construct a structured system prompt summarizing repository size, language, detected AST smells, CI caching status, and infrastructure allocations.
- **FR-802:** The system shall dispatch an asynchronous HTTP request to the local Ollama instance (`qwen2.5-coder:1.5b`).
- **FR-803:** The system shall parse the LLM response into an array of structured objects containing:
  - `issue`: Title of identified inefficiency.
  - `description`: Technical explanation and remediation code sample.
  - `savings_percent`: Projected carbon reduction percentage.
  - `effort`: Implementation complexity (`LOW`, `MEDIUM`, `HIGH`).
  - `priority`: Remediation urgency (`LOW`, `MEDIUM`, `HIGH`).
- **FR-804:** If the LLM request fails or exceeds the 30-second timeout, the system shall provide rule-based fallback recommendations.

#### 3.2.9 GitHub Action PR Carbon Diff (FR-900)
- **FR-901:** The platform shall provide a GitHub Action (`action.yml`) executable within GitHub Actions CI workflows.
- **FR-902:** The action shall trigger on `pull_request` events, running an audit on the target base branch and feature head branch.
- **FR-903:** The action shall calculate the net carbon delta:
  $$\Delta \text{Eco-Score} = \text{Score}_{\text{PR}} - \text{Score}_{\text{Base}}$$
  $$\Delta \text{Carbon} = \text{Carbon}_{\text{PR}} - \text{Carbon}_{\text{Base}}$$
- **FR-904:** The action shall post a formatted markdown comment on the pull request detailing the delta, layer breakdown, risk changes, and top recommendations.
- **FR-905:** The action shall evaluate a user-defined threshold and set a workflow warning status if carbon emissions increase beyond the threshold.

#### 3.2.10 REST API Endpoints (FR-1000)

| Endpoint | Method | Input Parameters | Output Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/analyze-repo` | `POST` | `repo_url`, `branch`, `include_infra`, `include_llm`, `github_token` | `AnalysisResponse` JSON | Executes complete repository analysis pipeline. |
| `/api/repos` | `GET` | `page`, `page_size` | `List[RepoResponse]` JSON | Returns paginated list of analyzed repositories with latest scores. |
| `/api/analyses/{id}` | `GET` | `id` (Analysis ID) | `AnalysisResponse` JSON | Retrieves full historical analysis metrics and recommendations. |
| `/api/github/validate-token`| `POST` | `token` (GitHub PAT) | `GitHubUserResponse` JSON | Validates PAT and returns authenticated user metadata. |
| `/api/github/repos` | `GET` | `token` (Header/Query) | `List[GitHubRepoItem]` JSON| Lists public and private repositories accessible by token. |
| `/api/health` | `GET` | None | `{"status": "healthy"}` | Healthcheck verifying database connectivity. |

---

### 3.3 Performance Requirements
- **PR-01 (Analysis Latency):** Analysis of standard repositories ($\le 100$ source files) shall complete in $\le 15$ seconds (excluding LLM generation).
- **PR-02 (LLM Generation Latency):** Local LLM recommendation generation via Ollama (Qwen 2.5 Coder 1.5B) shall complete in $\le 5.0$ seconds on modern multi-core CPUs.
- **PR-03 (Package Registry Cache Response):** Cached dependency lookups from PostgreSQL shall return in $< 5\text{ ms}$.
- **PR-04 (Frontend Time to Interactive):** Initial dashboard page load and rendering shall complete in $< 2.0$ seconds over broadband connections.
- **PR-05 (Repository Size Handling):** The backend shall successfully ingest and parse repositories up to 1 GB without memory exhaustion or socket timeouts.
- **PR-06 (Database Query Efficiency):** Historical analytics queries on TimescaleDB hypertables shall execute in $\le 100\text{ ms}$ for datasets up to 1,000,000 analysis points.

---

### 3.4 Design Constraints
- **DC-01 (Backend Language & Framework):** Backend implemented in Python 3.11+ using FastAPI with strict Pydantic v2 validation models.
- **DC-02 (Database Architecture):** Persistent storage implemented in PostgreSQL 16 utilizing async SQLAlchemy 2.0 and `asyncpg` connection pools.
- **DC-03 (Frontend Stack):** Single Page Application built using React 18, Vite, and Vanilla CSS with custom glassmorphism design tokens (avoiding runtime Tailwind bloat).
- **DC-04 (AST Engine):** Multi-language AST parsing restricted to `tree-sitter` native bindings for thread safety and sub-millisecond AST node traversal.
- **DC-05 (Docker Orchestration):** Full deployment packageable and runnable via standard `docker-compose.yml` (`timescaledb` + `backend` services).

---

### 3.5 Software System Attributes

#### 3.5.1 Reliability & Fault Tolerance
- **RL-01:** Failure of any external third-party API (npm, PyPI, Electricity Maps, AWS) shall never crash the primary analysis pipeline; fallback formulas and cached coefficients must be applied automatically.
- **RL-02:** If the Ollama LLM service is offline or unreachable, the system shall complete scoring, persist metrics, and display standard rule-based recommendations.
- **RL-03:** Cloned repositories must be guaranteed deletion via Python `finally` constructs and background task workers, ensuring zero disk leakage even on unhandled runtime exceptions.

#### 3.5.2 Security & Data Privacy
- **SC-01 (Zero Code Leakage):** Source code and ASTs must never leave the local execution environment; all AI inferences are executed exclusively via local Ollama instances.
- **SC-02 (Credential Handling):** GitHub Personal Access Tokens and AWS access keys must never be stored in persistent database tables or emitted in application logs.
- **SC-03 (Input Sanitization):** Git clone URLs and branch arguments must be strictly sanitized to prevent command injection vulnerabilities.
- **SC-04 (CORS Restrictions):** API endpoints must enforce explicit Cross-Origin Resource Sharing rules.

#### 3.5.3 Maintainability & Code Quality
- **MT-01:** Codebase must adhere strictly to PEP 8 standards with full type annotations (`mypy` compliant) and Google/Sphinx style docstrings.
- **MT-02:** Database schema evolutions must be tracked and applied exclusively via versioned Alembic migration scripts.
- **MT-03:** Layer analyzers (`ast_analyzer.py`, `dependency_analyzer.py`, `ci_analyzer.py`, `iac_analyzer.py`) must be loosely coupled and isolated within dedicated service modules.

#### 3.5.4 Portability
- **PT-01:** The containerized backend must execute identically across Linux (x86_64, aarch64), macOS (Apple Silicon), and Windows WSL2 environments.
- **PT-02:** The frontend bundle must be compileable into static assets deployable on Nginx, Apache, Cloudflare Pages, or Vercel.

#### 3.5.5 Testability & Verification
- **TS-01:** Automated unit and integration test suite must achieve $\ge 80\%$ statement coverage across `app/services/` and `app/api/`.
- **TS-02:** Full test suite must execute cleanly via `pytest` without requiring live external internet connections by using mock fixtures.

---

### 3.6 Other Requirements

#### 3.6.1 Packaging & Deployment
- **DR-01:** The repository shall contain a multi-stage `Dockerfile.backend` and unified `docker-compose.yml` allowing single-command startup (`docker-compose up --build`).
- **DR-02:** The repository shall contain an environment configuration template (`.env.example`) specifying all database, API key, and LLM connection properties.

#### 3.6.2 Compliance & Standards Alignment
- **RG-01:** Energy calculations shall comply with the functional unit modeling guidelines set forth in ISO/IEC 21031:2024 (Software Carbon Intensity).
- **RG-02:** Cloud power calculations shall maintain fidelity with the Cloud Carbon Footprint (CCF) open-source methodology.

---

*End of Requirements Specification*
