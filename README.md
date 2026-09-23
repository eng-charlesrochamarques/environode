# Environode

Environode is a portfolio IoT platform for environmental monitoring in electronics labs and component storage areas.

The project will be built incrementally with an initial focus on the web platform:

- A React/Vite dashboard.
- A Node.js/Express API with MongoDB.
- A Node.js device simulator.
- STM32 firmware for a NUCLEO-H753ZI telemetry client in a later phase.
- Optional local AI summaries with Ollama/Qwen.

## Current Status

Customer portal prototype with fictional in-memory data, login, tenant isolation, and a central/sensor overview. This is a local demo, not a production deployment.

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

Demonstrate a multi-tenant IoT monitoring platform where each customer sees only their own central units, sensors, readings and alerts. A site is an optional physical location for grouping central units.

## Platform Priority

The first implementation phases prioritize the customer web platform:

- Customer login and protected account area.
- Organization-scoped dashboard.
- Site and equipment/device inventory.
- Device online/offline status.
- Current and historical telemetry.
- Deterministic alerts.

Firmware remains part of the roadmap, but it will be addressed after the platform foundation is stable.

## Local demo

Run `npm.cmd install`, then start `npm.cmd run dev:api` and `npm.cmd run dev:web` in separate terminals. Open `http://localhost:5173`. The login is neutral; use a fictional account from [docs/demo/README.md](docs/demo/README.md) for local testing. The first account has 10 central units with four sensors each. Readings are static demo values, not live telemetry.

Run `npm.cmd run test:api` to verify tenant isolation and `npm.cmd run build:web` to verify the frontend build. Security decisions and production gaps are documented in [docs/security/README.md](docs/security/README.md).
