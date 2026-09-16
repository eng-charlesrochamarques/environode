# Environode Web

React/Vite dashboard for the Environode customer platform.

The web app will follow a domain-oriented structure so each area can grow without becoming tangled:

```text
src/
  app/
  assets/
  components/
    layout/
    ui/
  features/
    auth/
    dashboard/
    organizations/
    sites/
    devices/
    measurements/
    alerts/
    ai-summaries/
  hooks/
  lib/
  routes/
  styles/
```

## Main Customer Areas

- Login.
- Customer dashboard.
- Sites/installations.
- Equipment and devices.
- Device status.
- Current measurements.
- Historical measurements.
- Alerts and occurrences.
- Optional AI summaries.

Each authenticated user must only see data that belongs to their own organization.
