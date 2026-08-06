# BoardFlow

Gestion de proyectos con nucleo Scrum. SaaS multi-tenant: cada usuario puede
pertenecer a multiples Organizaciones, cada Organizacion tiene Proyectos, y
cada Proyecto tiene un Product Backlog y Sprints con time-box. El acceso se
controla con Roles dinamicos y permisos granulares (`recurso:accion`)
configurables por organizacion.

## Stack

- **Frontend**: React + TypeScript, Vite, Tailwind CSS, TanStack Query, dnd-kit.
- **Backend**: Node.js + Express + TypeScript, arquitectura MVC modular
  (`routes` / `controllers` / `services` / `db`).
- **Base de datos**: PostgreSQL + Prisma ORM.
- **Infraestructura**: Docker + Docker Compose.

## Estructura del proyecto

```
app/
├── client/       # Frontend (React) — components, pages, routes, hooks, styles por modulo
├── server/       # Backend (Express) — prisma/, src/{routes,controllers,services,db,...}
├── shared/       # Schemas Zod y tipos compartidos entre front y back
├── docs/         # Documentacion propia de BoardFlow
├── specs/        # Specs por feature (Spec Kit)
├── tests/        # Tests (unit/e2e)
└── legacy/       # Referencia del template base original, fuera de scope de build
```

## Desarrollo local

### Con Docker (recomendado)

```bash
docker compose up      # levanta Postgres + app (server y client en un solo puerto)
docker compose restart
docker compose down
```

La app queda disponible en `http://localhost:5007`. El contenedor corre
`prisma generate` + `prisma db push` automaticamente al levantar, asi la base
queda sincronizada con `server/prisma/schema.prisma` sin pasos manuales.

### Sin Docker

1. Copiar `.env.example` a `.env` y ajustar `DATABASE_URL`, `JWT_SECRET`, etc.
2. Levantar un PostgreSQL propio (o `docker compose up -d postgres`).
3. `npm install`
4. `npm run db:push` — sincroniza el schema de Prisma con la base.
5. `npm run dev` — levanta backend y frontend juntos en `http://localhost:5007`.

## Scripts

```bash
npm run dev          # servidor de desarrollo (API + client via Vite middleware)
npm run build         # build de produccion (client + server)
npm run start          # sirve el build de produccion
npm run check          # type-check con tsc
npm run e2e             # tests end-to-end (Playwright)
npm run db:generate      # genera el Prisma Client
npm run db:push           # sincroniza el schema contra la DB (dev)
npm run db:migrate         # crea/aplica una migracion versionada
npm run db:studio           # explorador visual de datos de Prisma
```

## Modelo de datos

Ver `server/prisma/schema.prisma` para el detalle completo de entidades
(User, Organization, Membership, Role, Permission, Project, Board, Column,
Sprint, Task, Label, Comment, Invitation, ActivityLog, etc.).
