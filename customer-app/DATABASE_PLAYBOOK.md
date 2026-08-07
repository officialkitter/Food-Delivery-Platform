# Database Playbook

This document summarizes current database-related guidance implied by the app code and UX copy, and gives direct actions for each data store.

## 1) Account Profile Database
Purpose: Store account registration profile records (name, identifier, verification state).

Do:
- Validate required identity fields before write operations.
- Keep a clear registration pipeline: capture -> verify -> create account.
- Log create-account events with trace IDs in backend logs.

Do not:
- Create records when identifier or verification code is missing.
- Mix credential reset writes into the profile write path.

Typical operations:
- Create account profile.
- Read profile by identifier.
- Update non-sensitive profile metadata.

## 2) Credential and Access Database
Purpose: Store password hash state, recovery metadata, lock state, and auth audit metadata.

Do:
- Separate password reset flow from profile flow.
- Store only hashed passwords and rotation metadata.
- Record account lock events and reset events for audit.

Do not:
- Store plaintext passwords.
- Reuse old credential tokens after reset.

Typical operations:
- Start recovery session.
- Verify recovery challenge.
- Rotate password hash.
- Revoke prior sessions.

## 3) Transaction and Dispute Database (MongoDB)
Purpose: Persist merchant order transaction records and dispute claims.

Do:
- Keep immutable claim submissions once filed.
- Link each dispute to order ID, user ID, merchant ID, and timestamps.
- Add a status workflow: submitted -> under_review -> resolved -> closed.

Do not:
- Overwrite original dispute text.
- Delete audit-critical transaction references during active cases.

Typical operations:
- Insert dispute case.
- Append case timeline entries.
- Query open cases by category and age.

## 4) Security and Account Audit Log Store (MongoDB)
Purpose: Persist security events (lockouts, vault reset actions, high-risk operations).

Do:
- Write structured audit events with actor, action, source, and time.
- Keep events append-only.
- Use retention policy aligned with compliance requirements.

Do not:
- Allow destructive updates to historical audit rows.
- Log secrets or raw biometric data.

Typical operations:
- Insert lock event.
- Insert emergency reset event.
- Query by user, severity, and date.

## 5) Historical Analytics Database
Purpose: Hold long-term aggregate behavior/trend data after data minimization steps.

Do:
- Strip personal identifiers before archival.
- Move only aggregate or de-identified payloads for long-term storage.
- Track archival batch job execution and success/failure metrics.

Do not:
- Archive raw PII with analytics payloads.
- Keep unnecessary high-granularity personal location history.

Typical operations:
- Archive de-identified event summaries.
- Query trend aggregates for reporting.

## 6) Real-Time Location Stream Store
Purpose: Support active delivery tracking with frequent updates.

Do:
- Treat location as short-lived operational data.
- Overwrite prior coordinates as new updates arrive.
- Encrypt data in transit and gate access by role.

Do not:
- Retain permanent customer location trails without explicit policy.
- Expose real-time streams to unauthorized clients.

Typical operations:
- Upsert latest driver/order coordinate state.
- Expire stale location entries.

## 7) Device-Side Local Storage (App Cache)
Purpose: Persist local app state (token, profile cache, cart, theme, recent searches).

Do:
- Keep secure tokens in protected storage.
- Apply cache invalidation after logout, lock, or credential reset.
- Define TTL for non-critical cache entries.

Do not:
- Treat local cache as source of truth.
- Keep sensitive auth artifacts after vault reset flow.

Typical operations:
- Save/read token and profile cache.
- Clear auth-related keys on security events.

## Cross-Database Operating Rules
- Enforce least-privilege access per service.
- Use idempotent write patterns where retries are possible.
- Add request correlation IDs across all database writes.
- Classify data fields as PII, sensitive, or operational.
- Document retention windows per store and automate cleanup.

## Suggested Ownership Matrix
- Auth service: Account Profile DB, Credential DB, Security Audit Log.
- Order/Support service: Transaction and Dispute DB.
- Tracking service: Real-Time Location Stream Store.
- Analytics service: Historical Analytics DB.
- Mobile app: Device-side local storage hygiene only.

## Notes
This playbook was derived from current codebase hints (auth pipeline comments, support/privacy screens, and storage key definitions). If you share the exact "advice" text you want summarized, this file can be refined into a stricter policy document with exact rules and SLAs.
