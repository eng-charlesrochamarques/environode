# Environode API

Node.js/Express API for the Environode multi-tenant platform.

The API will use a module-oriented structure:

```text
src/
  config/
  db/
  middlewares/
  modules/
    auth/
    organizations/
    users/
    sites/
    devices/
    measurements/
    alerts/
    ai-summaries/
    telemetry/
  shared/
    errors/
    utils/
tests/
  fixtures/
  integration/
```

## Multi-Tenant Rule

All customer-facing queries must be scoped by `organizationId` from the authenticated user. A user from one organization must never read or modify another organization's sites, devices, measurements, alerts, or AI summaries.
