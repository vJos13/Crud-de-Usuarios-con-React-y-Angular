# CRUD de Gestión de Usuarios — React y Angular

Caso práctico de la Guía Semana 13: un **backend en Node.js** (Express + SQL Server) y **dos frontends**
(React y Angular) que hacen las mismas operaciones CRUD sobre la tabla `Users`.

```
/Crud_usuarios_react_angular
├── backend/                  # API REST en Node.js (puerto 3001)
│   ├── config/db.js          # Conexión a SQL Server (mssql)
│   ├── controllers/          # Lógica de negocio y validaciones
│   ├── models/               # Consultas SQL parametrizadas
│   ├── routes/userRoutes.js  # Rutas /api/users
│   ├── database/script.sql   # Crea la BD miapp_sql y la tabla Users
│   ├── docker-compose.yml    # (Opcional) SQL Server en Docker
│   └── server.js
├── react-frontend/           # Panel principal + CRUD en React (puerto 5173)
│   └── src/
│       ├── components/       # UserForm, UserList, StatsStrip, layout/ (Sidebar, Topbar, Footer)
│       ├── pages/            # Inicio, CRUD React, CRUD Angular, Comparativa, API
│       ├── hooks/            # useUsers, useTheme, useHashRoute
│       ├── services/         # userService.js (fetch)
│       ├── styles/           # crud.css (compartido) y shell.css
│       └── App.jsx
├── angular-frontend/         # CRUD en Angular 22 (puerto 4200)
│   └── src/app/
│       ├── user/             # user.ts, user.html, user.service.ts, user.model.ts
│       └── app.ts            # modo incrustado (?embed=1)
└── package.json              # npm run dev → levanta los 3 servidores
```

## El panel

Abre **http://localhost:5173**. La barra lateral tiene:

| Sección | Qué muestra |
|---|---|
| Inicio | Arquitectura, estadísticas en vivo y tarjetas de cómo se aplica cada framework |
| CRUD React | El CRUD hecho con componentes y hooks de React |
| CRUD Angular | La app Angular real (puerto 4200) incrustada en el panel |
| React vs Angular | Tabla comparativa y el mismo código escrito en cada framework |
| API REST y BD | Endpoints, prueba en vivo de `GET /api/users` y la tabla `Users` |

La app Angular también funciona sola en http://localhost:4200. Dentro del panel recibe el tema
(claro/oscuro) por `postMessage` y le informa su altura al panel.

## API REST

| Método | Ruta              | Acción               |
|--------|-------------------|----------------------|
| GET    | `/api/users`      | Listar usuarios      |
| GET    | `/api/users/:id`  | Obtener un usuario   |
| POST   | `/api/users`      | Crear usuario        |
| PUT    | `/api/users/:id`  | Actualizar usuario   |
| DELETE | `/api/users/:id`  | Eliminar usuario     |

Cuerpo de POST/PUT: `{ "name": "Ana Torres", "email": "ana@example.com" }`

## Cómo ejecutarlo

### 1. Base de datos (SQL Server)

**Opción A — SQL Server instalado (SSMS):** abre `backend/database/script.sql` en SSMS y ejecútalo.

**Opción B — Docker:**

```bash
cd backend
docker compose up -d
docker compose exec sqlserver /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'TuPassword123!' -C -i /scripts/script.sql
```

### 2. Levantar todo con un solo comando (recomendado)

Desde la carpeta raíz del proyecto:

```bash
npm install
npm run dev
```

Esto inicia el backend (3001), React (5173) y Angular (4200) en la misma terminal. Ctrl+C los apaga todos.
Si prefieres hacerlo por separado, sigue los pasos 3 a 5.

### 3. Backend

Edita `backend/.env` con tu usuario y contraseña de SQL Server y luego:

```bash
cd backend
npm install
npm start
```

Debe mostrar `Conectado a SQL Server` y `Servidor backend corriendo en http://localhost:3001`.

### 4. Frontend React

```bash
cd react-frontend
npm install
npm run dev
```

Abre http://localhost:5173

### 5. Frontend Angular

```bash
cd angular-frontend
npm install
npm start
```

Abre http://localhost:4200

## Diferencias respecto a la guía

- **Vite en lugar de Create React App**: CRA está obsoleto; `npm create vite@latest` es la herramienta recomendada hoy.
  Por eso el componente principal es `App.jsx` y el puerto es 5173.
- **Consultas parametrizadas** (`request.input(...)`) en lugar de interpolar `${name}` en el SQL,
  que en la guía permite inyección SQL.
- **Validaciones** de nombre y correo en el backend y en ambos formularios; correo único en la tabla.
- **Credenciales en `.env`** en vez de escribirlas en `server.js`.
- **Angular moderno**: componentes standalone, `signals`, `inject()` y el nuevo control de flujo (`@if`, `@for`).
