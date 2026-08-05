# Plantilla Spec-First para Claude

Estructura tu proyecto antes de escribir una línea de código o prompt

Créditos: dominicode | Construye con IA: De la Idea al Producto con Claude y Specs

[!IMPORTANTE]
Instrucción: Haz una copia de este documento (Archivo → Hacer una copia) y rellena cada sección antes de abrir Claude.

---

## SECCIÓN 1 — Visión del producto

La descripción más corta y clara de lo que construyes. Una o dos oraciones. Si no puedes explicarlo en dos oraciones, aún no está claro.

**Preguntas guía:**
- ¿Qué hace exactamente este producto?
- ¿Para quién es?
- ¿Qué problema resuelve en una frase?

**Ejemplo:**
"Una herramienta para que freelancers gestionen sus proyectos y facturas desde un solo lugar, sin necesidad de usar hojas de cálculo separadas."

**Tu visión:**
Democratizar el desarrollo tecnológico permitiendo que cualquier emprendedor sin bases técnicas transforme una idea breve en una especificación de producto exhaustiva, profesional y lista para desarrollo.

---

## SECCIÓN 2 — Usuarios y casos de uso

Quién usa el producto y para qué. No perfiles de marketing — acciones concretas que realiza cada tipo de usuario.

**Preguntas guía:**
- ¿Quién es el usuario principal?
- ¿Hay usuarios con roles diferentes? (admin, usuario estándar, visitante)
- ¿Cuáles son las 3 acciones principales que hace cada usuario?

**Ejemplo:**
- Usuario freelancer: crea proyectos, registra horas trabajadas, genera facturas.
- Usuario cliente: ve el progreso del proyecto, aprueba facturas.

**Tus usuarios y casos de uso:**
- **Validación inicial y aterrizaje de idea:** Transformar un concepto abstracto en un documento estructurado para evaluar su viabilidad antes de invertir recursos.
- **Cotización y contratación de proveedores:** Generar la documentación técnica necesaria para solicitar presupuestos precisos a agencias o desarrolladores freelance sin hablar su lenguaje.
- **Postulación a fondos o incubadoras:** Crear el anexo técnico del producto para presentaciones de negocio, convocatorias de inversión o programas de aceleración.
- **Planificación del Producto Mínimo Viable (MVP):** Definir el alcance crítico de la primera versión del producto, separando las funciones esenciales de las secundarias.

---

## SECCIÓN 3 — Funcionalidades

La lista completa de lo que hace el sistema, organizada por módulos. Escribe cada funcionalidad como "El usuario puede..." o "El sistema permite..." Esto te fuerza a pensar desde el comportamiento, no desde el código.

**Preguntas guía:**
- ¿Qué módulos tiene el sistema?
- ¿Qué puede hacer el usuario en cada módulo?
- ¿Qué hace el sistema automáticamente?

**Ejemplo:**
**Módulo de proyectos:**
- El usuario puede crear proyectos y editar nombre y descripción.
- El usuario puede archivar proyectos completados.
- El usuario puede ver el historial de horas por proyecto.
**Módulo de facturación:**
- El sistema calcula el total automáticamente.
- El usuario puede generar una factura en PDF.
- El usuario puede marcar facturas como pagadas.

**Tus funcionalidades:**

### 1. Área de Input (Entrada de Datos)
- El usuario puede ingresar una descripción breve o concepto de su idea de producto en un campo de texto libre.
- El sistema permite guiar al usuario mediante preguntas dinámicas opcionales (tipo de producto, audiencia, problema que resuelve) para enriquecer la entrada si la descripción inicial es muy corta.
- El usuario puede seleccionar el tipo de plataforma que desea construir (Web, App móvil, Software SaaS, etc.) mediante opciones simplificadas.

### 2. Área de Output (Generación y Resultados)
- El sistema permite estructurar la especificación técnica en secciones claras y no técnicas: Objetivos del MVP, Historias de Usuario principales, Módulos requeridos y Stack tecnológico sugerido.
- El usuario puede previsualizar el documento generado en tiempo real con un formato limpio y legible.
- El usuario puede exportar la especificación técnica finalizada en formatos estándar como PDF, Markdown o un enlace web compartible.

### 3. Área de Estados (Gestión del Flujo)
- El sistema permite visualizar el progreso de la generación del documento mediante un indicador visual mientras la IA procesa la información.
- El usuario puede guardar el borrador de su especificación para editarlo, refinarlo o consultarlo en el futuro.
- El sistema permite marcar versiones del documento para que el usuario pueda comparar el alcance técnico de una primera iteración frente a revisiones posteriores.

---

## SECCIÓN 4 — Flujos de usuario

Los pasos exactos que sigue un usuario para completar cada acción principal. Incluye el flujo cuando todo funciona (happy path) y qué pasa cuando algo falla.

**Preguntas guía:**
- ¿Cuáles son las 3-5 acciones más importantes en tu producto?
- ¿Qué pasos sigue el usuario para completar cada una?
- ¿Qué pasa si algo sale mal en cada paso?

**Ejemplo — Crear una factura:**
1. El usuario va a "Facturas" en el menú.
2. Hace clic en "Nueva factura".
3. Selecciona el proyecto (el sistema rellena automáticamente el cliente y horas).
4. El usuario revisa el total y puede editarlo.
5. Hace clic en "Generar PDF".
6. Error: si no hay horas registradas, el sistema muestra un aviso antes de generar.

**Tus flujos principales:**

### El Flujo Feliz (Camino Ideal)

**Paso 1: Ingreso y Contextualización.** El usuario abre la aplicación y se encuentra con una interfaz limpia que le pide el nombre de su proyecto y una descripción breve de su idea en lenguaje natural. Selecciona la plataforma (Web, App Móvil, SaaS) mediante botones simples.

**Paso 2: Enriquecimiento Asistido (Opcional pero recomendado).** Si la descripción es muy corta, el sistema activa un asistente con 3 preguntas clave (¿Quién lo usará? ¿Cuál es el problema principal? ¿Cómo imaginas que ganará dinero?). El usuario responde de forma sencilla.

**Paso 3: Confirmación y Disparo.** El usuario hace clic en el botón "Generar Especificación Técnica".

**Paso 4: Procesamiento y Feedback Visual.** La pantalla cambia a un estado de carga. El sistema muestra un indicador de progreso dinámico acompañado de mensajes que explican qué está haciendo la IA en ese momento (ej. "Escribiendo historias de usuario...", "Estructurando la base de datos ideal...").

**Paso 5: Previsualización y Ajustes.** El sistema renderiza el documento estructurado en pantalla. El usuario revisa las secciones (MVP, Historias de Usuario, Stack sugerido) explicadas con glosarios interactivos para términos técnicos.

**Paso 6: Exportación.** El usuario hace clic en "Exportar" y descarga su documento en PDF o copia un enlace web público para enviárselo a su equipo o desarrolladores.

### Rutas de Contingencia (Qué pasa si algo falla)

Para evitar la frustración de un usuario no técnico, el sistema maneja los fallos en tres puntos críticos:

**1. Fallo de Conexión o Timeout de la IA (Durante el procesamiento)**
- **Qué ocurre:** La API de la IA tarda demasiado en responder o la conexión a internet del usuario se interrumpe a mitad de la generación.
- **Solución del sistema:** El sistema detiene el indicador de carga y muestra una pantalla de error amigable: "Nos tomó más tiempo de lo esperado entender la idea".
- **Acción:** En lugar de perder la información, el sistema conserva el texto original que el usuario escribió en el Input y le presenta un botón destacado de "Reintentar generación".

**2. Entrada Ambigua o Insuficiente (Fallo de lógica)**
- **Qué ocurre:** El usuario escribe algo demasiado vago (ej. "Quiero hacer un Uber para perros") y la IA no tiene suficiente contexto para armar un MVP coherente.
- **Solución del sistema:** En lugar de lanzar una especificación genérica o inservible, el sistema detecta la falta de datos y muestra una alerta: "¡Tu idea suena genial! Pero necesitamos un poco más de detalle para crear una spec precisa".
- **Acción:** El sistema redirige al usuario al paso de Enriquecimiento Asistido, precargando preguntas específicas basadas en lo poco que escribió (ej. "¿Los paseadores de perros se registran en la misma app o en otra diferente?").

**3. Error al Exportar o Guardar el Documento**
- **Qué ocurre:** El documento se generó correctamente en pantalla, pero la descarga del PDF falla o el servidor no responde al intentar guardar el borrador.
- **Solución del sistema:** La aplicación muestra una notificación flotante (Toast) notificando el problema técnico temporal, pero mantiene el documento completamente visible en la pantalla.
- **Acción:** Habilita de inmediato un botón secundario de emergencia: "Copiar todo al portapapeles". Así, el usuario puede respaldar su información manualmente en un bloc de notas local mientras se restablece el servicio de descarga.

---

## SECCIÓN 5 — Arquitectura

La estructura técnica del sistema. Qué componentes necesita, cómo se comunican, qué tecnologías usar. Si no tienes decisiones técnicas previas, deja este campo en "a decidir" y usa Claude con el resto de la spec para definirla.

**Preguntas guía:**
- ¿Es una app web, móvil o ambas?
- ¿Necesita backend propio o puede usar servicios externos?
- ¿Cómo se almacenan los datos?
- ¿Hay autenticación de usuarios?
- ¿Se integra con otros servicios?

**Ejemplo:**
- Frontend: React (web)
- Backend: Node.js + API REST
- Base de datos: PostgreSQL
- Autenticación: Supabase Auth
- Hosting: Vercel (frontend) + Railway (backend)

**Tu arquitectura:**
- **Frontend:** Next.js 16 + React + Tailwind CSS
- **Backend:** API Routes de Next.js
- **IA:** Google Gen AI SDK (Gemini)
- **Deploy:** Vercel

---

## SECCIÓN 6 — Requisitos no funcionales

Las restricciones que el sistema debe cumplir aunque el usuario no las vea directamente. Muchos proyectos los ignoran hasta que el problema aparece en producción.

**Preguntas guía:**
- ¿Cuántos usuarios simultáneos necesita soportar?
- ¿Hay datos sensibles?
- ¿Necesita funcionar sin conexión?
- ¿En qué idiomas?

**Ejemplo:**
- Rendimiento: carga inicial < 3 segundos.
- Seguridad: datos de cada usuario privados e inaccesibles para otros.
- Escalabilidad: diseñado para hasta 1.000 usuarios en v1.
- Idioma: español en la primera versión.

**Tus requisitos:**

### 1. Rendimiento
- **Tiempo de respuesta inicial:** La interfaz de usuario debe cargar en menos de 2 segundos bajo conexiones 4G/banda ancha estándar.
- **Tiempo de generación (IA):** El procesamiento completo del documento no debe exceder los 20 segundos. Si la API de la IA tarda más, el sistema debe implementar una estrategia de streaming (mostrar el texto a medida que se genera) para reducir la percepción de espera.
- **Concurrencia:** La arquitectura base debe soportar al menos 50 usuarios simulados generando especificaciones en paralelo sin degradar el tiempo de respuesta del servidor.

### 2. Seguridad
- **Cifrado de datos:** Todo el tráfico de la aplicación debe viajar encriptado a través de HTTPS (TLS 1.3).
- **Privacidad de la propiedad intelectual:** Las ideas de negocio y las especificaciones generadas no se utilizarán para entrenar modelos públicos de IA. Los datos del usuario en la base de datos deben estar aislados por cuenta.
- **Protección del Input:** El sistema debe sanitizar los campos de texto para evitar ataques de inyección (como Prompt Injection maliciosa que intente manipular la API de la IA o vulnerabilidades XSS en la interfaz web).

### 3. Accesibilidad
- **Simplicidad cognitiva (UX):** El diseño visual debe evitar tecnicismos. Los términos de desarrollo que la IA incluya por necesidad (ej. API, Base de datos relacional) deben contar con un sistema de tooltips (glosario emergente al pasar el cursor) que los explique con analogías sencillas.
- **Contraste y lectura:** Cumplimiento con el estándar WCAG 2.1 Nivel AA en contraste de color para asegurar que el texto sea perfectamente legible en pantallas móviles y de escritorio.
- **Responsividad:** La herramienta debe ser 100% Mobile-First. Los emprendedores suelen usar estas herramientas en movimiento desde sus smartphones.

---

## Fuera de Alcance (Lo que NO vamos a construir)

Para mantener el proyecto viable como un MVP rápido y enfocado, los siguientes elementos quedan estrictamente excluidos de esta primera versión:

- **Exportación directa a herramientas de gestión (Jira/Trello):** El sistema no se conectará mediante API a software de desarrollo para crear tableros de tareas automáticamente. La salida será estrictamente documental (PDF/Markdown).
- **Generación de código o layouts:** La herramienta no creará código frontend (HTML/CSS), no programará bases de datos ni generará diseños visuales/wireframes automáticos. Se limita al documento de requerimientos escritos.
- **Colaboración en tiempo real multiusuario:** No habrá un sistema tipo Google Docs donde varias personas editen la especificación al mismo tiempo ni hilos de comentarios entre socios dentro de la plataforma.
- **Estimación de costos y tiempos de desarrollo reales:** La IA no calculará cotizaciones monetarias (ej. "Esto te costará $5,000 USD") ni semanas exactas de trabajo, ya que esto varía según el mercado, la región y el programador senior/junior que se contrate.
- **Pasarela de pagos compleja o planes empresariales:** En esta primera fase, el acceso será gratuito o con un modelo de créditos muy simple mediante una integración básica (ej. Stripe estándar), dejando fuera esquemas de suscripción corporativa o facturación personalizada.

### Features

Fondo claro
Loigin con Clerk