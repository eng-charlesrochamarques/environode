# Platform Architecture

Environode's first priority is the web platform. Firmware remains important, but the first usable product should work with simulated devices before depending on physical hardware.

## Product Model

Each customer is represented by an `Organization`.

An organization owns:

- users;
- sites/installations;
- equipment/device records;
- measurements;
- alert rules;
- alert events;
- AI summaries.

## Customer Experience

After login, the customer sees only their own account area:

- dashboard overview;
- sites/installations;
- equipment and devices;
- online/offline status;
- latest temperature and humidity;
- history by device;
- alerts and occurrences;
- optional AI summaries.

## Frontend Structure

The web app is organized by feature:

- `auth`: login, session state, protected routes.
- `dashboard`: customer overview and key indicators.
- `organizations`: current customer context and future admin support.
- `sites`: installations/labs/storage areas.
- `devices`: equipment/device inventory and status.
- `measurements`: current and historical telemetry.
- `alerts`: deterministic alert rules and event history.
- `ai-summaries`: optional summaries generated from allowed customer data.

Shared visual pieces live in:

- `components/layout`;
- `components/ui`;
- `hooks`;
- `lib`;
- `routes`;
- `styles`.

## Backend Structure

The API is organized by module:

- `auth`: login, password hashing, JWT issuing.
- `organizations`: customer tenant root.
- `users`: customer users.
- `sites`: customer locations.
- `devices`: equipment and telemetry identity.
- `measurements`: telemetry history.
- `alerts`: deterministic rules and events.
- `telemetry`: device ingestion endpoint.
- `ai-summaries`: optional local AI summaries.

Shared infrastructure lives in:

- `config`;
- `db`;
- `middlewares`;
- `shared/errors`;
- `shared/utils`.

## Isolation Strategy

The authenticated user session carries an `organizationId`.

Every protected backend route must:

1. authenticate the user;
2. read `organizationId` from the token/session context;
3. filter database queries by that organization;
4. reject access to records from any other organization.

The frontend should not be trusted for authorization. It may hide irrelevant UI, but the backend must enforce isolation.

## Initial Navigation

The first platform version should expose:

- `/login`;
- `/app/dashboard`;
- `/app/sites`;
- `/app/devices`;
- `/app/devices/:deviceId`;
- `/app/alerts`;
- `/app/settings`.

## Firmware Deferral

Firmware work will be handled after the platform can demonstrate the full flow with simulated devices:

1. customer login;
2. customer dashboard;
3. device inventory;
4. telemetry ingestion;
5. status updates;
6. alerts.

