# PRD: Unified Civic Operations Pilot — Visakhapatnam (GVMC/GVSCCL)
**Codename:** VizagOps Unify | **Version:** 1.0 | **Duration:** 3-week hackathon pilot

---

## 1. Summary
A three-week pilot that connects GVMC's citizen grievance system, GVMC field-team status/location feeds, and GVSCCL's City Operations Center (COC) sensor/CCTV events into one lightweight middleware and dashboard. The system geospatially and temporally correlates a citizen complaint with nearby sensor events, auto-suggests the nearest available field team, and routes an alert — cutting the time between "complaint filed" and "team dispatched." Scope is deliberately narrow: one ward, two asset types (potholes + one CCTV/sensor feed), and a working demo with a clear handover runbook for GVMC IT to operate afterward.

## 2. Purpose & Objectives
**Problem:** Complaints, field reports, and COC sensor data live in three silos. A pothole complaint has no link to nearby CCTV footage or the nearest field crew, so triage and dispatch are manual and slow.

**Objectives:**
- Prove real-time correlation of complaint + sensor + field-team data is technically feasible with existing GVMC/GVSCCL APIs (or credible mocks).
- Reduce complaint-to-dispatch time by **40%** in the pilot ward versus baseline manual triage.
- Deliver an operable (not just demo-able) system GVMC IT can run post-hackathon with documented handover.

## 3. Scope
**In-scope:**
- One pilot ward/zone (to be designated by GVMC/GVSCCL owner)
- Two asset/incident types: pothole complaints + one live or simulated CCTV/sensor event stream
- Ingestion of: citizen complaints, field-team location/status, COC sensor events
- Geospatial + time-window matching engine
- Nearest-available-team routing logic
- Unified web dashboard (operator triage view) + thin mobile/web view for field teams
- Alert notification (WebSocket/SSE to dashboard; SMS/push optional stretch)
- Basic audit log and instrumentation

**Out-of-scope:**
- City-wide rollout beyond the pilot ward
- Rewriting or deep-integrating legacy GVMC/GVSCCL systems (read/write API only)
- Full CCTV video analytics (pilot uses event/alert metadata, not raw video ML)
- Citizen-facing mobile app redesign (existing grievance channel reused via API)

## 4. Stakeholders & Roles
| Role | Stakeholder | Responsibility |
|---|---|---|
| Executive sponsor / sign-off | GVMC Commissioner's Office / COC | Approves pilot ward, data access, go/no-go |
| Primary operator | GVMC IT | Owns system post-handover, manages credentials, first-line support |
| Technical data owner | GVSCCL Ops & Technical staff | Grants COC sensor/CCTV feed access, defines event schema |
| Secondary stakeholder | GVMC Grievance Dept. | Provides/validates complaint API access |
| Build team | Hackathon engineering team | Delivers pilot, documentation, handover |
| End beneficiaries | Citizens | Report issues, check status (no workflow change required) |

**Required approvals before Week 1 starts:** designated pilot ward, API/data-access credentials (or explicit approval to use mocks), one named GVMC IT point of contact.

## 5. User Personas & Key User Stories

**Persona A — COC/GVMC Operator (Priya, triage officer)**
- *Story:* As an operator, I want incoming complaints auto-matched with nearby sensor events so I can triage faster.
  - **AC:** Given a complaint within 150m and 30 min of a sensor event, the dashboard shows them linked within 5 seconds of ingestion. Pass/fail: linked card appears with both source IDs visible.
- *Story:* As an operator, I want the system to suggest the nearest available field team so I can dispatch with one click.
  - **AC:** Given ≥1 field team with status "available" within the ward, system ranks by distance and shows ETA; operator can assign in ≤2 clicks.

**Persona B — Field Team Member (Ravi)**
- *Story:* As a field team member, I want to receive an assigned incident with location and priority so I can respond without a phone call.
  - **AC:** Assignment appears on field client within 5 seconds of dispatch, with incident type, location pin, and priority.
- *Story:* As a field team member, I want to update my status (available/en route/on-site/done) so the system reflects reality.
  - **AC:** Status change POST updates dashboard map marker within 3 seconds.

**Persona C — Citizen (Lakshmi)**
- *Story:* As a citizen, I want to check my complaint status so I know it's being handled.
  - **AC:** GET status endpoint returns current state (received/matched/assigned/in-progress/resolved) matching dashboard state.

## 6. MVP Features (prioritized)
| # | Feature | Priority | Acceptance Criteria | Data Source (live/mock) |
|---|---|---|---|---|
| 1 | Complaint ingestion API | P0 | Valid POST creates record, returns ID within 200ms | GVMC grievance API or mock generator |
| 2 | Field-team status/location feed | P0 | Location updates reflected on map within 3s | GVMC field app feed or simulated GPS pings |
| 3 | COC sensor/CCTV event ingestion | P0 | Event with geotag + timestamp stored and queryable | GVSCCL COC feed or sample RTSP/alert JSON generator |
| 4 | Geospatial + time-window matching engine | P0 | Correlates complaint↔sensor event within configurable radius/time window; 90% precision on test dataset of 20 synthetic pairs | Internal logic |
| 5 | Nearest-team routing suggestion | P0 | Ranks available teams by haversine distance; returns top 3 with ETA | Internal logic + team feed |
| 6 | Operator dashboard (map + triage list) | P0 | Displays complaints, sensor events, team positions on one map; live update via WebSocket | React.js |
| 7 | One-click assignment & notification | P0 | Assignment writes to DB and pushes to field client in <5s | WebSocket/SSE |
| 8 | Field client (status view + assignment) | P1 | Thin web/Expo view shows assigned incidents and status toggle | React/Expo |
| 9 | Citizen status-check endpoint | P1 | Returns correct state string for given complaint ID | REST |
| 10 | Basic audit log | P1 | Every state change logged with actor, timestamp, action | Internal DB |
| 11 | Instrumentation dashboard (latency, match rate) | P2 | Shows ingestion-to-assignment latency per incident | Internal metrics |
| 12 | SMS/push alert (stretch) | P2 | Notification sent on assignment | Third-party SMS gateway (optional) |

## 7. Data & Integration Requirements

### 7.1 Citizen complaint — create
`POST /api/v1/complaints`
```json
{
  "citizen_id": "anon-8841",
  "type": "pothole",
  "description": "Large pothole near bus stop",
  "location": { "lat": 17.6868, "lng": 83.2185 },
  "ward_id": "GVMC-W12",
  "reported_at": "2026-07-30T09:12:00+05:30"
}
```
Response:
```json
{
  "complaint_id": "CMP-20260730-0042",
  "status": "received",
  "created_at": "2026-07-30T09:12:01+05:30"
}
```

### 7.2 Citizen complaint — status retrieval
`GET /api/v1/complaints/{complaint_id}`
```json
{
  "complaint_id": "CMP-20260730-0042",
  "status": "assigned",
  "matched_sensor_event_id": "SEN-2026-9981",
  "assigned_team_id": "FT-07",
  "eta_minutes": 12,
  "last_updated": "2026-07-30T09:15:40+05:30"
}
```

### 7.3 Field team location/status update
`POST /api/v1/field-teams/{team_id}/status`
```json
{
  "team_id": "FT-07",
  "status": "available",
  "location": { "lat": 17.6890, "lng": 83.2170 },
  "updated_at": "2026-07-30T09:10:00+05:30"
}
```

### 7.4 COC sensor/CCTV event ingestion
`POST /api/v1/sensor-events`
```json
{
  "event_id": "SEN-2026-9981",
  "asset_id": "CCTV-VZG-114",
  "event_type": "road_obstruction",
  "location": { "lat": 17.6871, "lng": 83.2183 },
  "timestamp": "2026-07-30T09:11:30+05:30",
  "confidence": 0.82,
  "source": "COC"
}
```

### 7.5 Alert routing message (server → field team)
```json
{
  "alert_id": "ALR-0042-07",
  "incident_id": "CMP-20260730-0042",
  "team_id": "FT-07",
  "priority": "high",
  "eta_minutes": 12,
  "location": { "lat": 17.6868, "lng": 83.2185 },
  "matched_sensor_event_id": "SEN-2026-9981",
  "issued_at": "2026-07-30T09:15:40+05:30"
}
```

### 7.6 Minimal Data Model
- **Complaint**(id, type, description, location, ward_id, status, created_at, matched_event_id, assigned_team_id)
- **SensorEvent**(id, asset_id, event_type, location, timestamp, confidence, source)
- **FieldTeam**(id, status, location, last_updated)
- **Assignment**(alert_id, incident_id, team_id, priority, eta, issued_at)
- **AuditLog**(id, entity_type, entity_id, action, actor, timestamp)

### 7.7 Transformation rules
- All incoming timestamps normalized to IST ISO-8601.
- Geolocation validated against ward boundary polygon; reject/flag if outside pilot ward.
- Matching window: default 150m radius, 30-minute time delta (configurable via env vars).

## 8. Technical Architecture
**Components:** Node.js REST/WebSocket API → Ingestion layer (complaint, sensor, field-team feeds) → Matching engine (geospatial + time-window, in-process or lightweight worker) → Routing engine (nearest-available-team) → Redis (state/pub-sub for real-time updates) → PostgreSQL/SQLite (persistent store) → React.js dashboard (WebSocket client) → Thin Expo/React field client.

**Event flow (sequence):**
1. Complaint or sensor event POSTed to ingestion API.
2. Event normalized and persisted; published to internal event bus (Redis pub/sub).
3. Matching engine subscribes, checks geospatial+time proximity against recent events of the other type.
4. On match, enrichment step queries FieldTeam table for nearest "available" team (haversine sort).
5. Routing engine creates Assignment record, publishes alert.
6. WebSocket/SSE pushes update to operator dashboard and field client simultaneously.
7. Operator can confirm/override before final dispatch (configurable auto-vs-manual mode for demo).
8. Audit log entry written at each state transition.

**Stack rationale:** Node.js chosen for shared business logic across web/mobile, native WebSocket support, and team familiarity within a 3-week window. Redis gives cheap pub/sub + ephemeral state without standing up a full message broker. Postgres/SQLite kept minimal — schema in §7.6 only.

## 9. Non-Functional Requirements
- **Performance:** Ingestion-to-dashboard-update latency <5s for 95% of events (pilot-scale load: <50 concurrent events/min).
- **Reliability:** Middleware retries failed upstream calls 3x with backoff; falls back to mock generator if live API unreachable (logged, not silent).
- **Security:** Token-based API auth (per-source API keys), least-privilege scopes (complaint API cannot write sensor data and vice versa), all traffic over HTTPS.
- **Privacy:** Citizen PII minimized — store citizen_id as anonymized reference, not name/phone, in the pilot dataset; full audit log of access.
- **Observability:** Structured logs (JSON) for every ingestion/match/routing event; basic metrics endpoint (match rate, avg latency, active teams).

## 10. Implementation Plan & Timeline
**Week 1 — Foundation & Access**
- Confirm pilot ward, data-owner sign-off, API credentials or mock-mode decision.
- Stand up Node.js API skeleton, DB schema, Redis pub/sub.
- Build mock generators for complaints, sensor events, field-team feed (fallback-ready from day 1).
- Deliverable: ingestion APIs live (mock or real), data model finalized.

**Week 2 — Core Logic & Dashboard**
- Build matching engine (geospatial+time), routing/nearest-team logic.
- Build operator dashboard (map, triage list, live updates via WebSocket).
- Build thin field client (assignment view + status toggle).
- Deliverable: end-to-end flow working in mock mode; live API swapped in where available.

**Week 3 — Integration, Instrumentation, Demo Prep, Handover**
- Swap mocks for live feeds where access is granted; regression test.
- Add audit log, basic metrics dashboard, security hardening (API keys, HTTPS).
- Run test plan (§11) to validate latency/response-time improvement.
- Prepare demo scripts, record baseline-vs-pilot comparison.
- Write handover runbook, transfer credentials/docs to GVMC IT.
- Deliverable: working pilot + runbook + demo.

## 11. Demo Plan (scripted scenarios)
1. **Pothole + CCTV correlation:** Simulate a pothole complaint near a CCTV asset already reporting "road_obstruction." Dashboard shows auto-linked card within 5s; operator assigns nearest team in 2 clicks; field client receives alert instantly.
2. **No sensor match (baseline path):** Complaint filed with no nearby sensor event — system still routes to nearest available team, showing the system degrades gracefully rather than blocking on missing data.
3. **Team unavailable / escalation:** All nearby teams marked "busy" — system shows next-nearest with adjusted ETA and flags as "delayed priority" for operator awareness.

## 12. Success Metrics & Validation Plan
- **Primary KPI:** 40% reduction in complaint-to-assignment time, measured as (baseline manual triage time from grievance log sample) vs. (pilot system timestamp: complaint received → assignment issued).
- **Test plan:** Run 20–30 synthetic/live complaints through the pilot ward during Week 3; log ingestion, match, and assignment timestamps; compare against a manually-collected baseline sample (last 20 grievance-log resolutions in the same ward, response-time field).
- **Secondary metrics:** match precision (correct complaint↔sensor pairing rate on labeled test set), dashboard update latency, field-team acknowledgment time.

## 13. Risks, Assumptions & Mitigations
| Risk | Likelihood | Mitigation |
|---|---|---|
| Live COC/CCTV API access delayed or denied | High | Use mock/sample event generator (scripted, documented); demo remains fully functional |
| Grievance API access delayed | Medium | Mock complaint intake API matching real schema; swap later with zero code change to matching engine |
| No designated pilot ward/owner by Week 1 | Medium | Escalate via Commissioner's Office contact identified pre-kickoff; default to a placeholder ward for build, swap coordinates later |
| Field team adoption/usage friction | Medium | Keep field client to 2 screens (assignment view, status toggle); no training beyond a 1-page guide |
| Data privacy concerns block real citizen data use | Medium | Use anonymized/synthetic citizen identifiers for pilot; no PII stored |
| Budget overrun on hosting/SMS gateway | Low | SMS notification kept as stretch/optional; core demo uses WebSocket only (no per-message cost) |

**Key assumption:** GVMC/GVSCCL designate one technical point of contact each within Week 1; without this, timeline shifts by the delay incurred.

## 14. Budget & Resource Estimate (Rs 8,000–15,000)
| Item | Estimate (INR) | Notes |
|---|---|---|
| Cloud hosting (VM/App service, 1 month) | 3,000–5,000 | Small instance, Node.js + Redis + DB |
| Domain/SSL (if needed) | 0–1,000 | Free-tier SSL via Let's Encrypt where possible |
| SMS gateway credits (stretch feature) | 0–2,000 | Optional; skip if budget tight |
| Redis/DB managed instance (or self-hosted free tier) | 1,000–3,000 | Can use free tier for pilot scale |
| Misc (monitoring tool, testing tools) | 1,000–2,000 | Free/open-source preferred |
| Contingency | ~2,000 | Buffer for overages |
| **Total** | **~8,000–15,000** | Fits indicative budget; SMS/monitoring are first cuts if trimming needed |

**Roles needed:** 1 backend engineer (Node.js/API/matching logic), 1 frontend engineer (React dashboard + field client), 1 part-time PM/coordinator (stakeholder liaison, demo script, runbook), optional 1 QA/tester for Week 3.

## 15. Handover & Runbook Summary
**Ownership handoff steps:**
1. Transfer repository access and deployment credentials to GVMC IT.
2. Rotate all API keys/tokens used during hackathon; issue fresh production-scoped keys to GVMC IT.
3. Walk through architecture diagram and data model with GVMC IT technical contact (1 session, ~1 hour).
4. Hand over documentation: this PRD, API schemas, DB schema, deployment steps, known limitations list.
5. Confirm monitoring dashboard access and alert thresholds with GVMC IT.
6. Define escalation contact chain (build team contact for 2–4 weeks post-handover for critical bug support).

**Required access for GVMC IT:** hosting/cloud console, DB admin credentials, API key management, source repository (with README + setup script), monitoring dashboard login.

**Known limitations to document:** mock-mode fallback still present where live APIs weren't connected; single-ward scope only; no video ML analytics; SMS notification untested at scale if included.

---

## Appendix A: Sequence of Events (Alert Routing) — Pseudocode
```
on complaint_received(c):
  persist(c); publish("complaint.new", c)

on sensor_event_received(e):
  persist(e); publish("sensor.new", e)

on "complaint.new" or "sensor.new":
  candidates = find_within(radius=150m, time_window=30min, opposite_type)
  if candidates exist:
    match = best_candidate(candidates)
    link(c, match)
  nearest_teams = field_teams.filter(status="available").sort_by(distance_to(c.location))
  if nearest_teams:
    assignment = create_assignment(c, nearest_teams[0], eta=calc_eta())
    publish("alert.issued", assignment)
    notify_dashboard(assignment); notify_field_client(assignment)
  else:
    flag_as("awaiting_team", c)
```

## Appendix B: Minimal DB Schema (reference)
```
complaints(id PK, type, description, lat, lng, ward_id, status, created_at, matched_event_id FK, assigned_team_id FK)
sensor_events(id PK, asset_id, event_type, lat, lng, timestamp, confidence, source)
field_teams(id PK, status, lat, lng, updated_at)
assignments(id PK, incident_id FK, team_id FK, priority, eta_minutes, issued_at)
audit_log(id PK, entity_type, entity_id, action, actor, timestamp)
```

## One-Page Handover Checklist
- [ ] Pilot ward confirmed and documented
- [ ] All API keys rotated and reissued to GVMC IT
- [ ] Repository + deployment scripts transferred
- [ ] Architecture walkthrough session completed
- [ ] Monitoring dashboard access confirmed
- [ ] Known limitations document reviewed and signed off
- [ ] Escalation contact chain agreed (2–4 week support window)
- [ ] Baseline-vs-pilot metrics report delivered to Commissioner's Office
