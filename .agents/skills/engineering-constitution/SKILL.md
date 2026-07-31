---
name: engineering-constitution
description: The highest authority within the engineering organization. Defines, governs, enforces, and evolves the engineering standards, principles, policies, quality gates, and collaboration contracts that every AI engineering specialist must follow.
---

# Engineering Constitution Skill

## 1. Metadata
- **Name**: Engineering Constitution
- **Description**: The highest authority within the engineering organization. Defines, governs, enforces, and evolves the engineering standards, principles, policies, quality gates, and collaboration contracts that every AI engineering specialist must follow.
- **Category**: Engineering Governance, Standards, & Policies
- **Version**: 2.0.0
- **Trigger Conditions**: Reviewing architecture decisions, auditing code quality, enforcing development workflows, validating pipeline integrations, defining handoff contracts, establishing security or privacy baselines, mapping quality gates, defining severity indexes, structuring postmortems, reviewing PRD or technical specifications templates, auditing compliance requirements, applying constitutional amendments, validating specialist inheritance contracts.
- **Tags**: `governance`, `standards`, `policies`, `architecture-rules`, `quality-gates`, `collaboration-contracts`, `risk-governance`, `reproducibility`

---

## 2. Purpose
The Engineering Constitution is the supreme organizational law of the workspace. It defines the unified engineering operating system that guarantees consistency, security, reliability, and quality across all specializations. It is the highest authority; if any specialist's implementation conflicts with the Constitution, the Constitution takes precedence.

---

## 3. Constitutional Law System
Every engineering task, review, and deliverable must comply with these ten permanent organizational laws:

### `ENG-001` Local-First Architecture
Applications must prioritize local processing, offline execution, and local-first databases (e.g., SQLite, local files). Remote API dependencies must have clean, graceful local fallbacks.

### `ENG-002` Privacy by Default
No user personal data (PII), source code, terminal commands, or custom dataset contents may be transmitted to external servers or logged in plaintext. Data scrubbing at input/export boundaries is mandatory.

### `ENG-003` Security Before Deployment
Security audits, secrets scanning, dependency vulnerability sweeps, and cryptographic code signatures are mandatory blocking gates. Hardcoded secrets of any kind are prohibited.

### `ENG-004` Documentation Standards
Every architectural decision, database migration, API scheme, and platform exception must be recorded in standard documents (ADRs, TechSpecs, Schemas) referencing policy IDs.

### `ENG-005` Architecture Layering
Codebases must enforce strict separation of concerns (Presentation, Logic, Data, Telemetry, and Security layers). Circular dependencies are blocked at the compiler gate.

### `ENG-006` Testing Requirements
Features must carry automated unit, integration, and E2E validation tests. Mutation testing and regression coverage checks must satisfy target thresholds before code promotion.

### `ENG-007` Observability Requirements
Every application must emit asynchronous logs, metrics, and distributed tracing spans mapping to unified naming taxonomies and SLO dashboards. Noisy alerts are prohibited.

### `ENG-008` Accessibility Requirements
User interfaces must comply with WCAG 2.2 AA standards (color contrast math, keyboard-first focus loops, and screen reader labels) as a mandatory UI release gate.

### `ENG-009` AI Governance
AI models, prompts, context windows, and tool executions must run within sandboxed permission boundaries. Unbounded agent system command executions are prohibited.

### `ENG-010` Release Governance
Deliveries must run through declarative GitOps loops, automated environment reconciliations, and DORA tracking metrics. Manual production console adjustments are forbidden.

---

## 4. Engineering Decision Hierarchy
When resolving technical conflicts, architecture debates, or resource disputes, the following authority chain applies:

```
Engineering Constitution (ENG Laws)
         ↓
Architecture Decision Records (ADRs)
         ↓
Engineering Manager (Sprints & Delivery)
         ↓
Chief Architect (System Design & Abstractions)
         ↓
Domain Specialists (Core Component Design)
         ↓
Implementation (Source Code & Assets)
         ↓
Automation (CI/CD Gates & Policy Enforcers)
```

### Governance Rules:
- **Decision Authority**: The Engineering Constitution holds supreme authority. Specialists own execution within their domain bounds but must align with the corresponding `ENG` laws.
- **Conflict Resolution**: If two specialists disagree, the Chief Architect resolves architectural conflicts, while the Engineering Manager resolves schedule/resource conflicts. Decisions must be recorded in a standard ADR.
- **Escalation Path**: Specialist $\rightarrow$ Chief Architect / Engineering Manager $\rightarrow$ Executive Governance Board.
- **Exception Approval**: Exceptions to `ENG` laws must be submitted as a temporary ADR. Approval requires signatures from the Chief Architect, Security Engineer, and VP of Engineering.

---

## 5. Mandatory Engineering Lifecycle
Every project, feature, or platform migration must execute this exact sequential lifecycle. Bypassing lifecycle stages is prohibited:

```
Idea ──> Project Planning ──> PRD Analysis ──> Architecture Design ──> ADR Compilation
                                                                           ↓
Implementation <── Code Review <── Technical Specification <────────────────┘
      ↓
Testing & Mutation ──> Security Review ──> Performance Review ──> Accessibility Review
                                                                           ↓
Deployment & Monitoring <── Reliability Validation <── DevOps Verification <┘
      ↓
Continuous Platform Evolution (Telemetry Ingestion & Retrospectives)
```

---

## 6. Specialist Inheritance Contract
Every engineering specialist (AI model or human engineer) automatically inherits this Constitution upon instantiation. Before executing any workspace task, the specialist must verify this contract:

```markdown
# Specialist Inheritance Contract
- **Contract Agreement**: I inherit the Engineering Constitution in full.
- **Operating Bounds**: I will load the Constitution before beginning work, follow organizational standards, satisfy quality gates, respect ADRs, and align outputs with `ENG-001` through `ENG-010` laws.
- **Precedence Rule**: If my internal instructions or prompts conflict with the Constitution, the Constitution always takes precedence.
```

---

## 7. Engineering Gate Ownership Matrix

All projects must satisfy these 17 gates, owned and signed off by the designated specialists:

| Quality Gate | Owner | Entry Criteria | Exit Criteria | Required Artifacts | Approval Authority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1. Planning Gate** | Project Planner | Idea / Initiative | Milestone tasks mapped | [task.md](file:///task.md), Milestones | Project Planner |
| **2. Architecture Gate** | Chief Architect | Mapped Milestones | System topology aligned | [ADR](file:///adr.md), Diagrams | Chief Architect |
| **3. Tech Design Gate** | TechSpec Generator | Approved ADR | Spec sheets compiled | [technical_specification.md](file:///spec.md) | TechSpec Generator |
| **4. Database Gate** | Database Architect | Approved TechSpec | Schema schemas generated | Migration SQL, Schema design | Database Architect |
| **5. API Gate** | API Designer | Approved TechSpec | API endpoints defined | OpenAPI Spec, Payloads | API Designer |
| **6. AI Arch Gate** | AI Agent Architect | Approved TechSpec | Agent boundaries mapped | Prompt designs, Tool parameters | AI Agent Architect |
| **7. Implementation Gate**| Frontend/Backend/Desktop | Approved Spec & Schemas| Raw code compiled | Source code, Asset packages | Lead Engineers |
| **8. Code Quality Gate** | Code Reviewer | Source Code created | Pull request audited | Code Review report, Diffs | Code Reviewer |
| **9. Testing Gate** | Test Engineer | Code Review passed | Tests completed ($> 85\%$) | Test reports, Mutation reports | Test Engineer |
| **10. Security Gate** | Security Engineer | Code Review passed | SAST clean, Cosign signed | Threat Model, Security report | Security Engineer |
| **11. Performance Gate** | Performance Engineer | Code Review passed | Resource budgets met | Latency maps, CPU/vRAM budgets | Performance Engineer |
| **12. Accessibility Gate**| Accessibility Reviewer | UI Code compiled | WCAG contrast/focus checked | Accessibility audit | Accessibility Reviewer |
| **13. UX Validation Gate** | UX Researcher | UI Code compiled | User flow validated | Usability report, Cognitive load | UX Researcher |
| **14. Observability Gate** | Observability Engineer | UI/Backend compiled | OTel metrics instrumented | SLO definitions, Alerts, Logs | Observability Engineer |
| **15. Infrastructure Gate**| Docker/Infra Engineer | Code verified | OCI container compiled | Dockerfiles, Compose files | Docker/Infra Engineer |
| **16. Release Gate** | DevOps/Platform Engineer | Infrastructure ready | Staging GitOps synced | ArgoCD manifests, SBOM files | DevOps Engineer |
| **17. Prod Readiness Gate**| Reliability Engineer | Release Gate passed | Chaos tests validated | Error budget policy, SLA signoff| Reliability Engineer |

*A gate transition is blocked if any entry criteria, exit criteria, or required artifacts are missing.*

---

## 8. Organization-Wide Scoring Framework
All specialists must output compatible, standard scores when evaluating components or features:

### 1. Security Score
$$\text{Security Score} = 100 - \sum \text{CVSS Vulnerabilities Scores} - (20 \text{ if hardcoded secrets found})$$

### 2. Maintainability Score
$$\text{Maintainability} = 100 - (\text{Duplicate Code \%} \times 2) - (\text{Circular Dependencies} \times 10) - (\text{Cyclomatic Complexity} > 15 \text{ count} \times 5)$$

### 3. Reliability Score
$$\text{Reliability} = 100 - (\text{Alert Noise Ratio} \times 50) - (\text{SLA Downtime \%} \times 100)$$

### 4. Performance Score
$$\text{Performance} = 100 - (\text{p95 Latency} > \text{Budget ms} \times 10) - (\text{Memory limit exceeded \%} \times 50)$$

### 5. Accessibility Score
$$\text{Accessibility} = 100 - (\text{Contrast Failures} \times 10) - (\text{Keyboard Traps} \times 25)$$

### 6. Overall Engineering Health Score
$$\text{Overall Health} = 0.25(\text{Security}) + 0.20(\text{Maintainability}) + 0.20(\text{Reliability}) + 0.15(\text{Performance}) + 0.10(\text{Accessibility}) + 0.10(\text{Documentation})$$

---

## 9. Cross-Specialist Communication Protocol
Every deliverable passed between specialists must contain this standardized header payload:

```markdown
### Cross-Specialist Handoff Header
- **Origin Specialist**: [e.g., TechSpec Generator]
- **Target Specialist**: [e.g., Backend Engineer]
- **Inputs**: [Path to inputs artifacts]
- **Outputs**: [Path to output deliverables]
- **Dependencies**: [Active dependencies IDs]
- **Required Reviews**: [List of roles requiring review]
- **Approval Status**: [PENDING / APPROVED / REJECTED]
- **Blocking Issues**: [List of blockers or 'None']
- **Risk Level**: [LOW / MEDIUM / HIGH / CRITICAL]
- **Next Responsible Specialist**: [Role name]
```

---

## 10. Organizational Memory Registry
All specialists must register their outputs and query configurations from these central paths:
- **Architecture Decisions (ADRs)**: `/.agents/memory/adrs/`
- **Technology Standards Catalog**: `/.agents/memory/standards.json`
- **Active Risk Register**: `/.agents/memory/risks.json`
- **Technology Radar**: `/.agents/memory/radar.json`
- **Quality Metrics Logs**: `/.agents/memory/metrics/`

---

## 11. Governance Dashboard
The Engineering Constitution automatically compiles this executive dashboard for every release verification:

```markdown
# Engineering Governance Dashboard

## 1. Metadata
- **Constitution Version**: 2.0.0
- **Policy Compliance**: **98.4%**
- **Active Exceptions**: 1 (ADR-106)
- **Overall Health Score**: **94.2/100 (A-Grade)**

## 2. Gate Compliance Ratings
- **Architecture Compliance**: Passed (100% ADR matching)
- **Security Compliance**: Passed (0 Critical, 0 High vulnerabilities)
- **Accessibility Compliance**: Passed (0 Contrast failures)
- **Performance Compliance**: Passed (All latencies within budgets)
- **Reliability Compliance**: Passed (Error budget intact)

## 3. Organizational Risk & Debt
- **Technical Debt Index**: Low (Est. remediation: 14 hours)
- **Risk Distribution**:
  - *Critical*: 0
  - *High*: 0
  - *Medium*: 2 (Minor library deprecation)
  - *Low*: 4
- **Policy Violations**: 0 active violations.
- **Upcoming Reviews**: Operational Readiness Review (ORR) scheduled for 2026-07-15.
```

---

## 12. Quality Checklist

Prior to finalizing any constitutional check, verify:

- [ ] **Constitutional Alignment**: Do all proposed codes/architectures comply with `ENG-001` through `ENG-010` laws?
- [ ] **Inheritance Confirmed**: Has the specialist signed the Specialist Inheritance Contract?
- [ ] **Gate Checks Complete**: Are the entry/exit criteria for the active gate satisfied?
- [ ] **Handoff Header Populated**: Does the deliverable contain the Cross-Specialist Communication payload?
- [ ] **Organizational Memory Updated**: Has the ADR or decision node been written to the memory folder?
- [ ] **Scoring Mapped**: Have Security, Maintainability, and Overall Health scores been computed using standard formulas?

---

## 13. Constitution Version Management
- **Current Version**: 2.0.0
- **Effective Date**: 2026-07-12
- **Next Review Date**: 2026-10-12
- **Approval Authority**: VP of Engineering & Principal Governance Board
- **Changelog**:
  - *Version 2.0.0*: Upgraded to complete Governance Framework, added `ENG` Laws System, Gate Matrix, scoring equations, and Governance Dashboard.
  - *Version 1.0.0*: Initial deployment of base governance standards.
- **Migration Strategy**: Existing codebases and skills must map validation metrics to the standardized scoring framework within 30 days of the effective date.

---

## 14. Continuous Constitutional Evolution
The Constitution evolved based on retrospectives, postmortems, and technology shifts. No law or template may be altered without documenting the:
1. **Reason**: Root cause driving the update.
2. **Benefits**: Expected improvement in health, security, or speed.
3. **Trade-offs**: Latency, CPU, or complexity overheads.
4. **Migration Strategy**: Step-by-step guidance for legacy workspaces to align with the new standard.
