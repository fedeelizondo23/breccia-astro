# Breccia Mármol Website

Sitio web en Astro + Tailwind (frontend) y Express + MongoDB (backend).

## Requisitos

- Node.js 20+
- pnpm 10+

## Frontend (Astro)

Desde la raíz del proyecto:

```sh
pnpm install
pnpm dev
```

El sitio se levanta en `http://localhost:4321` (o el siguiente puerto disponible).

## Backend (API)

```sh
pnpm --dir backend install
pnpm --dir backend dev
```

API local en `http://localhost:5000`.

## Variables de entorno backend

1. Copia `backend/.env.example` a `backend/.env`
2. Configura los valores reales.

Variables importantes para contacto:

- `CONTACT_EMAIL_USER`: cuenta Gmail remitente
- `CONTACT_EMAIL_APP_PASSWORD`: App Password de Gmail
- `CONTACT_EMAIL_TO`: correo destino (por defecto `brecciamarmol@gmail.com`)
- `CORS_ORIGIN`: orígenes frontend permitidos

## Formulario de contacto

- Endpoint: `POST /api/contact/send`
- Seguridad aplicada:
	- validación de payload con Joi
	- rate-limit por IP
	- honeypot antispam (`website`)
	- sin exponer credenciales en frontend

## Build de producción

```sh
pnpm build
```

La configuración de imágenes usa servicio passthrough para evitar bloqueos de build por optimización nativa.
