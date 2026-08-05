# Autenticación con Clerk

## Qué hace
Integra Clerk como proveedor de identidad y autenticación en la plataforma. Permite a los usuarios iniciar sesión y registrarse. El dashboard de generación de especificaciones de producto y la API de generación quedan protegidos: un usuario sin sesión ve una landing pública con un botón de inicio de sesión, y solo tras autenticarse accede al formulario, al historial y a la generación. El historial de borradores generados continúa persistido localmente en `localStorage` sin cambios.

## Por qué
Para preparar la plataforma para una futura personalización, control de uso y cuotas de API individuales, es fundamental contar con un sistema de autenticación seguro, moderno y fácil de integrar. Clerk proporciona una experiencia de usuario sobresaliente con flujos listos para usar (Social Logins, Email, etc.) sin necesidad de configurar bases de datos complejas en esta etapa.

## Criterios de Aceptación
- [ ] La aplicación se inicializa con el `<ClerkProvider>` envolviendo la aplicación en `src/app/layout.tsx`.
- [ ] Se crea un middleware (`src/middleware.ts`) que protege la aplicación, permitiendo acceso público a la landing page `/` pero asegurando otros endpoints y rutas críticas.
- [ ] El Header en `src/app/page.tsx` incluye botones para iniciar sesión (`<SignInButton>`) si el usuario no está autenticado, y el componente de menú de perfil de Clerk (`<UserButton>`) si está autenticado.
- [ ] El dashboard (formulario, historial y output) no se muestra si el usuario no ha iniciado sesión: en su lugar se renderiza una landing pública con un botón prominente "Inicia sesión para generar especificaciones".
- [ ] Mientras Clerk carga la sesión (`isLoaded === false`) se muestra un estado de carga para evitar que un usuario autenticado vea un parpadeo de la landing.
- [ ] Los enlaces compartidos (`#share=...`) siguen siendo públicos: un usuario sin sesión puede visualizar y guardar localmente una especificación compartida.
- [ ] El botón de generación en el formulario de entrada (`InputForm.tsx`) se reemplaza con un botón de llamada a la acción para iniciar sesión si el usuario no ha iniciado sesión.
- [ ] La ruta de la API de generación (`src/app/api/generate/route.ts`) está protegida en el servidor mediante el helper `auth()` de Clerk, retornando un error `401 Unauthorized` si la petición no está autenticada.
- [ ] No hay error de hidratación: el `<body>` incluye `suppressHydrationWarning` para ignorar atributos inyectados por extensiones del navegador (ej. `cz-shortcut-listen`).
- [ ] El historial de borradores en `localStorage` sigue funcionando exactamente igual sin interferencia del flujo de login.

## No incluye
- Sincronización de base de datos de usuarios (PostgreSQL/MongoDB).
- Persistencia del historial de especificaciones en base de datos (se mantiene en `localStorage`).
- Roles o permisos avanzados de usuario.
- Flujos de registro/perfil de usuario personalizados (se usan los componentes de modal listos de Clerk).
