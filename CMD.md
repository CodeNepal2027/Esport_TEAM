# Commands and Setup Guide

This file is meant to help new contributors work on the project quickly without needing to inspect multiple files.

---

## 1. Setup

### Activate virtual environment

In PowerShell:

```powershell
cd "C:\Users\eastpoint\Desktop\OPTECH\Template\Esport_TEAM"
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& .\venv\Scripts\Activate.ps1)
```

If the venv is already active:

```powershell
activate
```

---

## 2. Backend Commands

### Go to backend folder

```powershell
cd Backend
```

### Run migrations for master database

```powershell
py manage.py migrate --database=default
```

### Run migrations for tenant database

```powershell
py manage.py migrate --database=tenant
```

### Run Django development server

```powershell
py manage.py runserver 0.0.0.0:8000
```

### Create an admin user

```powershell
py manage.py createsuperuser
```

### Create tenant user

```powershell
python manage.py create_tenant_user --username t2k_username --password t2k@pass --slug t2k
```

### Delete tenant user

```powershell
py manage.py delete_tenant_user
```

### Check project status / debug

```powershell
py manage.py check
```

---

## 3. Frontend Commands

### Go to frontend folder

```powershell
cd Frontend
```

### Install dependencies

```powershell
npm install
```

### Run local dev server

```powershell
npm run dev -- --host 0.0.0.0
```

### Build production bundle

```powershell
npm run build
```

### Preview production build locally

```powershell
npm run preview -- --host 0.0.0.0
```

---

## 4. Database Notes

This project uses two databases:

- `master.sqlite3` for shared tenant metadata
- `tenant.sqlite3` for tenant-specific content and per-tenant data

Important:

```powershell
py manage.py migrate --database=default
py manage.py migrate --database=tenant
```

Run both when starting fresh or after pulling code with new migration files.

---

## 5. Tenant User Commands

The app includes custom commands for tenant user creation and deletion.

### Create tenant user

```powershell
py manage.py create_tenant_user
```

This command is meant to help create a user associated with a tenant workspace.

### Delete tenant user

```powershell
py manage.py delete_tenant_user
```

This is used to remove an existing tenant user safely.

---

## 6. Common Troubleshooting

### If tenant does not match expected organization

Check:

- `Frontend/.env`
- `Frontend/src/config/org_config.jsx`
- `Frontend/src/config/env_export.js`
- backend master organization data

### If database migration fails

Run:

```powershell
py manage.py migrate --database=default
py manage.py migrate --database=tenant
```

Then re-check the database routing config in `Backend/Backend/settings.py`.

### If frontend keeps showing default OPTECH branding

Check:

- `VITE_USE_DEMO`
- `VITE_DEFAULT_TENANT_SLUG`
- hostname resolution logic in `Frontend/src/config/org_config.jsx`
- whether Vercel env variables are configured correctly

---

## 7. Production / Vercel Setup

For Vercel deployments, configure environment variables in the Vercel dashboard:

```env
VITE_USE_DEMO=false
VITE_DEFAULT_TENANT_SLUG=abc
VITE_MASTER_API_URL=https://esport-team-backend.vercel.app/api
VITE_BACKEND_URL_PRODUCTION=https://esport-team-backend.vercel.app/api
VITE_BACKEND_URL_DEVELOPMENT=http://127.0.0.1:8000/api
```

Local `.env` files do not automatically deploy to Vercel.

---

## 8. Quick Start for New Contributors

```powershell
cd "C:\Users\eastpoint\Desktop\OPTECH\Template\Esport_TEAM"
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned) ; (& .\venv\Scripts\Activate.ps1)
cd Backend
py manage.py migrate --database=master
py manage.py migrate --database=tenant
py manage.py runserver 0.0.0.0:8000
```

Then in another terminal:

```powershell
cd "C:\Users\eastpoint\Desktop\OPTECH\Template\Esport_TEAM\Frontend"
npm install
npm run dev -- --host 0.0.0.0
```

---

## 9. Useful Tips

- Always work in the backend venv if running Django commands
- Always use the correct database target when migrating
- If a tenant config seems wrong, check hostname matching first
- If backend API is failing, confirm the API URL and tenant config in `.env`
- Keep the master DB clean and centralized while tenant data stays isolated

---

## 10. Summary

This project is a multi-tenant platform. The main idea is simple:

- master DB = tenant registry + organization metadata
- tenant DB = tenant-specific content and data
- frontend = reads current host + env + backend config to determine branding

If you understand the above flow, working on the project becomes much easier.
