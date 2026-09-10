# Elysium Pixelmon

### Tech Stack:

- React
- ASP.NET
- PostgreSQL

## Install Requirements

The following software must be installed to run each part of the app:

- Node v17+ (Necessary for Client)
- .NET 8 SDK (Necessary for API)
- Postgres v18+ (Necessary for database unless connecting to Prod database)

## Client ENV Config

- The following happens inside the `/Pixelmon.Client` folder
- Copy `.env.sample` and rename it to `.env`
- Enter your local host and api port for VITE_API_URL for development or `https://pixelmon-api.linkpc.net` to hit production
- Choose any string for the VITE_AUTH_STORAGE_KEY as its just a reference for where to store user auth tokens

**When deploying to Prod, the .env variables are injected into the build files so ensure production is the selected endpoint.**

_like all client side projects, do not put any secrets inside, only config_

## API database configuration

- The following happens inside the `/Pixelmon.Api` folder
- Copy `SetEnv.sample.cmd` and rename it to `SetEnv.cmd`
- Enter your secrets, environment should stay as Development except in Production
- Run `./setenv.cmd`
- You can now run the API with `dotnet run`
