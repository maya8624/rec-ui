# Azure Static Web App Deployment

## Overview

This app (rec-ui) is deployed to Azure Static Web Apps via GitHub Actions. Every push to `main` triggers an automatic redeploy.

## One-Time Setup Steps

1. **Create the Static Web App in Azure portal**
   - Select your GitHub repo and branch (`main`)
   - Build preset: React / Vite
   - App location: `/`
   - Output location: `dist`

2. **Azure generates a GitHub Actions workflow file**
   - Added automatically to `.github/workflows/`
   - Deployment token stored as a GitHub secret

3. **Link the backend in Azure portal**
   - Go to your Static Web App → Settings → APIs → Link
   - Link your .NET backend (Azure App Service)
   - Azure proxies all `/api/*` requests from the Static Web App URL to the backend

4. **Set environment variables in Azure portal**
   - Go to your Static Web App → Settings → Environment variables
   - Set `VITE_API_BASE_URL` to the Static Web App's own URL + `/api`
   - e.g. `https://thankful-moss-027e9bb00.7.azurestaticapps.net/api`

## Ongoing Deployment

- Push to `main` → GitHub Actions runs `npm run build` → uploads `dist/` to Azure
- Deploy time: ~2-3 minutes
- Monitor runs under your repo's **Actions** tab on GitHub

## Azure Environments

| Slot | Description |
|------|-------------|
| Production | Main deployment slot, served from `main` branch |
| Preview | Temporary, auto-created per open pull request |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Static Web App URL + `/api` — Azure proxies this to the linked .NET backend |

> Local development uses `.env.development` or `.env.local` (points to `https://localhost:7289/api`) — these are not deployed.
