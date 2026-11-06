# Trucking Logistics

React dispatch dashboard for loads, trucks, drivers, and customers. Includes a fleet map, polling updates, sample JSON records, and interchangeable Node.js and PHP APIs.

## Run locally

Use Node.js 20 or newer and npm. From this directory:

```bash
npm ci
cp .env.example .env
npm --prefix truckingapi ci
node truckingapi/server.js
```

In another terminal, run `npm start` and open http://localhost:3000. The example environment points to the Node API at http://localhost:8101/api. Google Maps requires your own browser API key in `REACT_APP_GOOGLE_MAPS_API_KEY`; the remaining pages can run without a map key. Restart the development server after changing environment variables.

## Build and deploy

```bash
npm run build
```

Deploy `build/` to your static host. Asset paths are relative, and hash routing supports hosting in a subdirectory. Set `REACT_APP_API_BASE_URL` before building to your API base URL, without a trailing slash. It defaults to the same-origin `/api` path. No deployment host is embedded in the source.

For the PHP backend, host `truckingapi/` on PHP with Apache rewrite support and set the frontend API base to `/truckingapi` (or the path where you mount it). The Node backend uses `/api` and listens on port 8101 by default; override it with `PORT`.

Both backends read and write `truckingapi/data/*.json`. Included records are demo fixtures with 555 phone numbers. The APIs expose CRUD operations without authentication and use permissive CORS for development; configure authentication and allowed origins before exposing the API beyond a trusted environment.

## MCP server

The companion [Trucking Logistics MCP server](https://github.com/cmergenthal/trucking-logistics-mcp-php) reads and writes the same JSON files. Clone the repositories side by side, or set `TRUCKING_MCP_DATA_DIR` to the absolute path of `truckingapi/data`.

## Checks and configuration

```bash
npm test -- --watchAll=false
npm run build
```

Local `.env` files, keys, access logs, dependencies, and generated deployment files are excluded from Git. `.env.example` contains placeholders and local development URLs. Browser environment variables are embedded in builds, so use only a restricted browser key for Google Maps.
