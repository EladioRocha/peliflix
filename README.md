# Peliflix — Movie Catalog

A server-rendered movie catalog built with **Express, EJS, Passport, and PostgreSQL**. The source includes movie search, ratings, comments, favorites, profiles, and movie management routes.

## Setup

Install Node.js, npm, and PostgreSQL. From the repository root:

```sh
npm ci
```

Configure a local `.env` using the variable names below. Use your own development values rather than any historical configuration stored in the repository.

| Variable | Purpose |
| --- | --- |
| `USER` | PostgreSQL user. |
| `PASSWORD` | PostgreSQL password. |
| `HOST` | PostgreSQL host. |
| `DATABASE` | Database name. |
| `DATABASEPORT` | PostgreSQL port. |
| `DEVPORT` | Application listening port, for example `3000`. |
| `PORT` | Optional override for `DEVPORT`. |

The database schema is not provisioned automatically. Review the SQL in [src/api/controllers](src/api/controllers) and prepare matching tables before testing the catalog. The repository does not provide a complete migration workflow.

```sh
npm start
```

Open `http://localhost:3000` if you chose port 3000. `npm run dev` calls `nodemon`, but that tool is not declared in the package dependencies; `npm start` is the documented entry point.

## Application layout

| Path | Purpose |
| --- | --- |
| [src/app.js](src/app.js) | Express, sessions, uploads, templates, and startup. |
| [src/api/database/index.js](src/api/database/index.js) | PostgreSQL pool configuration. |
| [src/routes](src/routes) | Root, `/usuarios`, and `/peliculas` routes. |
| [src/api/controllers](src/api/controllers) | User and movie queries and handlers. |
| [src/helpers/passport.js](src/helpers/passport.js) | Local authentication strategy. |
| [src/views](src/views) | Catalog, detail, editor, profile, and favorites views. |

## Project status

This is a historical learning project with older dependencies and no automated test script. `node --check src/app.js` checks syntax without connecting to PostgreSQL. Full account, upload, and movie workflows need a configured test database. The application contains a hard-coded session secret and a tracked historical `.env`; replace configuration for your own environment before deployment.
