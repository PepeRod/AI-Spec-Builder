# Toggle de Modo Claro/Oscuro

## Qué hace
Agrega un botón de alternancia (sun/moon icon) en el header del sitio que permite al usuario cambiar entre modo claro y oscuro manualmente. La preferencia se persiste en `localStorage` y prevalece sobre la preferencia del sistema operativo.

## Por qué
Actualmente el dark mode solo responde a `prefers-color-scheme` del SO. El usuario no tiene control manual, lo que es frustrante cuando quiere un modo distinto al del sistema o cuando el SO no soporta la media query. Un toggle mejora la accesibilidad y la experiencia de usuario.

## Criterios de Aceptación
- [ ] El toggle es un botón iconográfico (sol/luna) ubicado en el header, junto al badge de Gemini
- [ ] Al hacer clic cambia inmediatamente entre modo claro y oscuro sin recargar la página
- [ ] Usa class-based dark mode (`class="dark"` en `<html>`) en lugar de la media query del SO
- [ ] La preferencia se guarda en `localStorage` y persiste entre sesiones
- [ ] Al primer ingreso, respeta `prefers-color-scheme` del SO como valor por defecto si no hay valor guardado
- [ ] No hay flash de modo incorrecto en la primera renderización (hydration mismatch)
- [ ] Todos los componentes existentes con clases `dark:` reaccionan correctamente al toggle
- [ ] El icono del botón refleja el modo actual (sol en modo claro, luna en modo oscuro)

## No incluye
- Selector de modo "Sistema" (solo Claro/Oscuro, sin opción "Auto")
- Temas personalizados o colores configurables por el usuario
- Modo oscuro en páginas de error de Next.js (`error.tsx`, `not-found.tsx`, `loading.tsx`)
- Animaciones de transición entre modos
- Botón de toggle en el footer o en rutas secundarias (solo en el header)
