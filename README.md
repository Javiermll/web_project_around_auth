# Around The U.S. — React con Autenticacion JWT

Versión de la red social "Around" con sistema completo de registro, inicio de sesión y rutas protegidas con JWT, desarrollada como proyecto de formación en el bootcamp TripleTen.

## Descripcion / Objetivo

Extensión de la aplicación React "Around The U.S." que agrega autenticación real mediante JWT: registro de usuarios, inicio de sesión, persistencia de sesión en `localStorage` y protección de rutas para usuarios no autenticados.

## Tecnologias y herramientas

- React 19 (componentes funcionales, hooks: `useState`, `useEffect`, `useContext`)
- Vite como bundler y servidor de desarrollo
- React Router DOM v7 (rutas `/`, `/signin`, `/signup`)
- JavaScript ES6+ / JSX
- Context API para estado global de autenticación
- JWT (JSON Web Token) almacenado en `localStorage`
- CSS por componente con BEM adaptado a React
- ESLint con reglas de React Hooks
- API de autenticación de TripleTen (`se-register-api.en.tripleten-services.com/v1`)
- Git / GitHub para control de versiones

## Funcionalidades principales

- **Autenticacion JWT completa:** registro (`POST /signup`), inicio de sesión (`POST /signin` devuelve token), validación de sesión (`GET /users/me`) y cierre de sesión con limpieza de `localStorage`.
- **Rutas protegidas:** componente `ProtectedRoute` que redirige usuarios no autenticados a `/signin`; rutas públicas `/signin` y `/signup` inaccesibles si ya hay sesión activa.
- **Persistencia de sesion:** al recargar, si existe token en `localStorage`, se valida automáticamente y se restaura la sesión sin pedir credenciales.
- **Componentes de autenticacion:** `Login` y `Register` con formularios validados, hints de navegación entre vistas y estados de envío. `InfoTooltip` como modal de resultado (éxito/error) reutilizable.
- **Header adaptativo:** en desktop muestra email y botón "Cerrar sesión"; en móvil despliega menú hamburguesa con los mismos datos.

## Rol

Proyecto individual: implementación completa del flujo de autenticación, enrutamiento con React Router, componentes de login/registro, lógica de token en `localStorage` y diseño de UI/UX.

## Resultado / Impacto

- Flujo de autenticación completo en 3 pasos: registro → inicio de sesión → contenido protegido.
- 4 nuevos componentes implementados: `Login`, `Register`, `InfoTooltip`, `ProtectedRoute`.
- Persistencia de sesión automática mediante validación de token en el montaje de `App`.
- Header responsivo con menú hamburguesa en móvil y layout expandido en páginas de auth en desktop.
- Footer oculto en páginas de autenticación según especificación de diseño (Figma).

## Instalacion y ejecucion

```bash
npm install
npm run dev       # http://localhost:5173
npm run build
npm run preview
```

## Repositorio

- GitHub: https://github.com/Javiermll/web_project_around_auth
- Github Pages: https://javiermll.github.io/web_project_around_auth/
