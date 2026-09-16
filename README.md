# Environode

Environode is a portfolio IoT platform for environmental monitoring in electronics labs and component storage areas.

The project will be built incrementally with an initial focus on the web platform:

- A React/Vite dashboard.
- A Node.js/Express API with MongoDB.
- A Node.js device simulator.
- STM32 firmware for a NUCLEO-H753ZI telemetry client in a later phase.
- Optional local AI summaries with Ollama/Qwen.

## Current Status

Phase 0: repository structure and architecture documentation.

No application code has been implemented yet.

## Repository Layout

```text
environode/
  apps/
    web/
  services/
    api/
  firmware/
    stm32-h753/
  tools/
    device-simulator/
  docs/
    api/
    architecture/
    demo/
    firmware/
    security/
  docker-compose.yml
  .env.example
  .gitignore
  README.md
```

## MVP Goal

Demonstrate a multi-tenant IoT monitoring platform where each customer has its own account area to view sites, equipment, device status, telemetry, deterministic alerts, and optional AI-generated summaries that never control critical alert decisions.

## Platform Priority

The first implementation phases prioritize the customer web platform:

- Customer login and protected account area.
- Organization-scoped dashboard.
- Site and equipment/device inventory.
- Device online/offline status.
- Current and historical telemetry.
- Deterministic alerts.

Firmware remains part of the roadmap, but it will be addressed after the platform foundation is stable.
