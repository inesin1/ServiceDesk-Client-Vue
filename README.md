# Service Desk — client

Web interface for an internal IT helpdesk: employees file tickets, IT specialists pick them up and close them, administrators manage users and reference data.

Built with Vue 3, Vite and TypeScript. The API lives in a separate repository: [ServiceDesk-Backend](https://github.com/inesin1/ServiceDesk-Backend).

## Running

```
npm install
npm run dev
```

The dev server listens on port 10011 and proxies `/api` to `http://localhost:1002`. Point it somewhere else with `VITE_API_URL` in `.env` — see `.env.example`.

## Commands

|                     |                                     |
| ------------------- | ----------------------------------- |
| `npm run dev`       | dev server with hot reload          |
| `npm run build`     | type check, then build into `dist/` |
| `npm run typecheck` | type check only                     |
| `npm run lint`      | ESLint with autofix                 |
| `npm run format`    | Prettier                            |

## Deployment

`Dockerfile` builds the bundle and serves it with nginx, which also proxies `/api` to the backend.
