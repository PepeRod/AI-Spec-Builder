# SpecGenius 🛠️
### Creador de Especificaciones de Producto para Emprendedores

**SpecGenius** es una aplicación moderna e interactiva diseñada para democratizar el desarrollo tecnológico. Permite a cualquier persona sin conocimientos de programación transformar una idea de negocio abstracta en una especificación técnica de producto (Product Spec / MVP Requirements) completa, estructurada y lista para ser entregada a un equipo de desarrollo de software.

## 🚀 Características Clave

1. **Aterrizaje de Ideas Directo:** Interfaz simple para ingresar el concepto del producto en lenguaje natural.
2. **Asistente de Enriquecimiento Inteligente:** Formulario guiado opcional con preguntas clave (usuarios, problemas, generación de valor) para dar contexto relevante a la IA.
3. **Generación Estructurada con Gemini:** Utiliza la API estructurada de Google Gemini para garantizar una especificación robusta que incluye objetivos del MVP, historias de usuario en formato *Como/Quiero/Para*, módulos técnicos detallados y stack sugerido.
4. **Glosario Interactivo:** Cada término técnico inevitable incluye explicaciones claras y analogías del mundo real al hacer clic sobre él.
5. **Comparación de Versiones:** Compara visualmente el alcance de diferentes borradores/iteraciones (V1 vs V2) de una misma idea.
6. **Exportación Completa:** Permite descargar el documento en formato Markdown, imprimirlo/guardarlo como un PDF maquetado profesionalmente o copiar todo el contenido al portapapeles.
7. **Enlaces Web Compartibles:** Exporta la especificación técnica serializándola en una URL compartible completamente del lado del cliente (sin base de datos) que otros usuarios pueden abrir y guardar al instante en sus borradores locales.

---

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js 15](https://nextjs.org/) + [React 19](https://react.dev/)
- **Estilos (CSS):** [Tailwind CSS v4](https://tailwindcss.com/)
- **Inteligencia Artificial:** [Google Gen AI SDK (Gemini)](https://github.com/google/generative-ai-js)
- **Despliegue sugerido:** [Vercel](https://vercel.com)

---

## ⚙️ Configuración del Entorno

1. Realiza una copia del archivo `.env.local.example` y renombralo a `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
2. Abre el archivo `.env.local` e introduce tu clave de API de Google Gemini en la variable:
   ```env
   GEMINI_API_KEY=tu_clave_de_api_aqui
   ```

---

## 🚀 Instalación y Ejecución

Instala las dependencias y corre el servidor local:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador para interactuar con la aplicación.

---

## 📦 Producción y Build

Para generar la compilación de producción:

```bash
npm run build
```

> **Nota sobre entornos virtualizados:** Si estás compilando en contenedores virtuales con recursos de CPU/RAM muy limitados y experimentas fallos por el compilador nativo SWC (`SIGBUS`), la configuración de Next.js está optimizada con `workerThreads: false` y `cpus: 1` para minimizar la carga. Si las limitaciones son extremas, se puede forzar el uso de Babel añadiendo un archivo `.babelrc` con `{"presets": ["next/babel"]}`.
