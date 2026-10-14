# Reglas de Desarrollo para el Frontend (AGENTS.md)

Este documento define las directrices arquitectónicas, técnicas y de diseño específicas y obligatorias para todo desarrollo dentro del directorio **`frontend/`**.

---

## 1. Pila Tecnológica del Cliente

* **Framework / Bundler:** React 19 + Vite (Single Page Application - SPA).
* **Enrutamiento:** React Router v6+.
* **Cliente HTTP:** Axios / Fetch con interceptor para inyectar token JWT automáticamente.
* **Estilos:** CSS Modular / Vanilla CSS con variables de diseño (tokens) o TailwindCSS (según se configure en el core).
* **Despliegue:** Vercel (distribución de bundle compilado `npm run build`).

---

## 2. Screaming Architecture (Feature-Driven)

El frontend está estructurado estrictamente alrededor de los **5 dominios funcionales del negocio** en `src/features/`. Está prohibido agrupar componentes de forma genérica en carpetas globales sin pertenencia a un dominio.

### Organización Modular:

```text
frontend/src/
 ├── core/                       # Código transversal y reutilizable
 │    ├── api/                   # Instancia configurada de cliente HTTP (Axios)
 │    ├── components/            # Componentes base (Botones, Modales, Inputs, Navbar)
 │    ├── context/               # Contextos globales (AuthContext, SubjectContext)
 │    ├── layouts/               # Layouts principales (MainLayout, AuthLayout)
 │    └── utils/                 # Formateadores, constantes y validadores globales
 ├── features/                   # Módulos de negocio (Vertical Slices)
 │    ├── auth/                  # Módulo 1: Autenticación y Contexto Docente
 │    ├── material-ingestion/    # Módulo 2: Carga y lectura de PDFs/Word
 │    ├── exam-generation/       # Módulo 3: Parametrización Bloom y Motor IA
 │    ├── exam-editor/           # Módulo 4: Vista Previa y Edición (Human-in-the-Loop)
 │    └── export-dashboard/      # Módulo 5: Historial y Exportación (PDF/Word)
 ├── router/                     # Definición de rutas y rutas protegidas (ProtectedRoute)
 ├── App.jsx                     # Componente raíz
 └── main.jsx                    # Punto de entrada de la aplicación
```

---

## 3. Anatomía Interna de una Feature

Cada subcarpeta dentro de `src/features/[nombre-feature]/` debe ser autocontenida y estructurarse de la siguiente manera:

1. **`components/`:** Componentes visuales que solo pertenecen a este módulo de negocio (ej. `BloomTaxonomyPicker.jsx`, `QuestionCard.jsx`, `FileUploadDropzone.jsx`).
2. **`hooks/`:** Custom hooks que encapsulan la lógica reactiva, peticiones asíncronas y estados del módulo (ej. `useGenerateExam.js`, `useExamEditor.js`, `useMaterialUpload.js`).
3. **`services/`:** Funciones de llamada HTTP que interactúan exclusivamente con los endpoints de esa feature (ej. `authService.js`, `examService.js`).

---

## 4. Comunicación con la API REST y Estado

1. **Variable de Entorno Base:**
   * La URL del backend debe consumirse siempre desde `import.meta.env.VITE_API_URL` (configurada en `.env` local y en el dashboard de Vercel).
2. **Manejo de Autenticación:**
   * El token JWT debe almacenarse de forma segura (localStorage o memoria de estado) e inyectarse en el header `Authorization: Bearer <token>` mediante un interceptor de Axios.
   * Si una petición responde `401 Unauthorized`, el interceptor debe limpiar la sesión y redirigir al login.
3. **Contrato de Respuestas del Backend:**
   * El frontend espera respuestas en el formato:
     * `{ success: true, data: { ... } }` para éxitos.
     * `{ success: false, error: "..." }` para errores.

---

## 5. Experiencia de Usuario (UX) y Buenas Prácticas

1. **Retroalimentación en Procesos con IA:**
   * La generación de exámenes mediante modelos de lenguaje toma varios segundos. Es **obligatorio** mostrar estados de carga claros (spinners, skeletons, barras de progreso y mensajes informativos) para evitar la sensación de bloqueo.
2. **Edición Human-in-the-Loop Fluida:**
   * El editor de evaluaciones (`exam-editor`) debe permitir editar el enunciado de las preguntas, alternativas de respuesta, clave correcta y justificación pedagógica de manera inmediata y sin recargar la página.
3. **Diseño Limpio y Accesible:**
   * Interfaz profesional orientada a docentes universitarios.
   * Paleta de colores armónica, tipografías legibles y diseño adaptable (*responsive*) para pantallas de escritorio, laptops y tablets.

---

## 6. Principio DRY y Componentes Atómicos Anti-Monolíticos (Frontend)

1. **Cumplimiento Estricto del Principio DRY:**
   * **Componentes Base en `src/core/components/`:** Elementos como botones, modales de confirmación, campos de formulario (*inputs*, *selects*), *loaders* e íconos deben crearse una sola vez en el core y reutilizarse en todas las features. Prohibido duplicar estilos o estructuras de botones en cada módulo.
   * **Hooks Reutilizables:** Lógicas comunes (como peticiones con estado de carga `useFetch`, manejo de formularios `useForm` o notificaciones `useToast`) deben ubicarse en `src/core/hooks/` o utilidades compartidas.
   * **Servicio HTTP Central:** Las cabeceras de autorización, manejo de errores de red y URLs base se definen una única vez en `core/api/client.js`.

2. **Prohibición Total de Componentes Monolíticos (Descomposición Atómica):**
   * **Límite de Tamaño por Archivo:** Ningún componente JSX debe superar ~150-200 líneas de código. Si una vista se aproxima a ese tamaño, **debe** descomponerse en subcomponentes atómicos dentro de la carpeta `components/` de la respectiva feature.
   * **Ejemplo en `exam-editor/`:**
     * ❌ **Monolito Prohibido:** Un archivo `ExamEditorView.jsx` de 500 líneas que maneja el título, las 20 preguntas, la edición de cada opción, la rúbrica y los botones de exportar.
     * ✅ **Diseño Atómico Obligatorio:**
       * `ExamEditorPage.jsx` (Vista contenedora ligera que usa el hook `useExamEditor`).
       * `components/ExamHeader.jsx` (Título, metadata y estado).
       * `components/QuestionList.jsx` (Iterador de preguntas).
       * `components/QuestionCard.jsx` (Tarjeta individual de pregunta).
       * `components/OptionItem.jsx` (Fila editable de opción con su radio/checkbox).
       * `components/RubricDrawer.jsx` (Panel lateral o modal de rúbricas).
       * `components/ApprovalActionBar.jsx` (Barra inferior de acciones).
   * **Separación de Lógica y Presentación:** Los componentes visuales deben enfocarse en renderizar la interfaz. Toda la lógica de negocio, cálculos de puntaje, validaciones y llamadas a la API deben extraerse a **custom hooks** en la carpeta `hooks/`.

---

## 7. Conmutación Modular en Frontend (Feature Flags / Vistas de Suscripción)

1. **Aislamiento de Features (`src/core/features/`):**
   * El frontend debe consultar o recibir la configuración de módulos activos (vía endpoint de perfil/configuración o variables `VITE_FEATURE_*`).
   * Componente protector `<FeatureGuard feature="CLAVE_FEATURE" fallback={<UpgradePrompt />}>`: Envuelve rutas o botones conmutables.

2. **Degradación Elegante de UI:**
   * Si un módulo (ej. Rúbricas o Antifraude) está desactivado para el usuario o plan actual:
     * La navegación y el sidebar no deben arrojar 404 ni enlaces rotos.
     * Se oculta la opción limpiamente o se muestra un banner indicativo ("Funcionalidad disponible en plan Pro / Próximamente").
     * El resto de la aplicación (Login, Carga de Archivos, Generación básica) continúa operando con normalidad.

---

## 8. Convención de Commits y Versionamiento Atómico (Git)

1. **Commits Atómicos en Frontend:**
   * Crear commits pequeños y atómicos por cada componente, hook, servicio o vista creada/corregida.
   * Prohibido subir pantallas completas monolíticas en un solo commit.

2. **Convención Estricta (Conventional Commits):**
   * Formato: `<tipo>(<alcance>): <descripción>`
   * Tipos: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `test:`, `style:`.

3. **Estructura de Repositorios Independientes:**
   * El proyecto se gestiona exclusivamente a través de dos repositorios Git independientes:
     * Frontend: `https://github.com/jaimezzapata/front-proyecto-grados.git` (en `frontend/`).
     * Backend: `https://github.com/jaimezzapata/back-proyecto-grados.git` (en `backend/`).
   * No se utiliza ni se realizan commits en el directorio global de la raíz; todo versionamiento se ejecuta directamente dentro de cada proyecto respectivo (`frontend/` o `backend/`).

---

## 9. Sistema de Temas Visuales Multiestilo y Modos Claro / Oscuro

Para ofrecer una experiencia visual única y personalizable, el frontend debe soportar un motor de conmutación de estilos basado estrictamente en **Tokens Semánticos de CSS** (`data-theme` y `data-mode` en el elemento raíz `<html>` o contenedor principal).

### 9.1 Catálogo de Estilos Artísticos Soportados:

1. **Minimalismo (Swiss Modernism / Zen):**
   * **Concepto:** Sobriedad absoluta, enfoque total en el contenido, amplio espacio negativo, líneas sutiles y micro-interacciones imperceptibles. Diseñado para docentes que prefieren una interfaz libre de distracciones visuales.
   * **Tokens:** Bordes ultrafinos (`1px solid var(--border-subtle)`), sombras difusas tenues, tipografía limpia (*Inter* / *Plus Jakarta Sans*) y paleta neutra monocromática con un único acento refinado.
   * **Variantes:** Modo Claro (blanco perla y gris pizarra tenue) y Modo Oscuro (carbón mate y gris niebla).

2. **Neobrutalismo:**
   * **Concepto:** Geometrías puras, bordes negros gruesos (`2.5px solid #000`), sombras duras sin desenfoque (`4px 4px 0px #000`), esquinas rectangulares y botones con sensación de pulsado mecánico.

3. **Pop Art:**
   * **Concepto:** Inspirado en Lichtenstein y Warhol; paleta primaria vibrante (amarillo, cian, magenta), micro-tramas de semitono (*halftone dots*) y etiquetas con aspecto de viñeta editorial.

4. **Memphis Design:**
   * **Concepto:** Vanguardia de los años 80; patrones geométricos lúdicos (zigzags, triángulos, píldoras), esquinas redondeadas orgánicas y paleta en tonos pastel audaces (menta, coral, lila).

5. **Cyber Neón:**
   * **Concepto:** Estética Synthwave / Cyberpunk; resplandores luminosos exteriores (*outer glows* cian y fucsia), tarjetas translúcidas de cristal (*glassmorphism*) y sensación de terminal avanzada de IA.

### 9.2 Regla de Oro DRY para Estilos (Prohibida la Lógica Duplicada):
* **Prohibido condicionar componentes con lógica JSX:** Ningún componente visual debe tener condicionales del tipo `if (theme === 'neon')` o `className={theme === 'brutalist' ? '...' : '...'}`.
* **Componentes Agnósticos:** Los componentes de `src/core/components/` (`Button`, `Card`, `Input`, `Badge`) deben ser agnósticos y consumir exclusivamente variables CSS globales (ej. `border: var(--border-width) solid var(--border-color); box-shadow: var(--shadow-main);`).
* **Conmutación Universal:** El estado del tema (`theme`: `minimalism | brutalism | popart | memphis | neon`) y el modo (`mode`: `light | dark`) se gestiona centralizadamente mediante un hook global `useTheme()` en `src/core/theme/ThemeContext.jsx` y se persiste en `localStorage`.




