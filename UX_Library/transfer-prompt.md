# Prompt Maestro: Adopción de Identidad Digital BoardFlow

Copia y pega el siguiente prompt en un nuevo proyecto para replicar exactamente la misma visual y experiencia de usuario (UX) utilizando esta librería.

---

## 🚀 Prompt para el Asistente de IA

"Actúa como un Ingeniero de Frontend Senior experto en UX Institucional. Mi objetivo es implementar la **Identidad Digital de BoardFlow** en este nuevo proyecto, utilizando una estructura de **Baseline** centralizada.

He copiado la carpeta `UX_Library/` a la raíz de este proyecto. Sigue estos pasos estrictamente para asegurar la consistencia total:

### 1. Configuración de Infraestructura
- **Path Alias**: Agrega el alias `"@ux/*": ["./UX_Library/*"]` en el archivo `tsconfig.json` (o `jsconfig.json`) bajo `compilerOptions.paths`.
- **CSS Maestro**: Importa o utiliza el contenido de `@ux/baseline/index.css` como la hoja de estilos global. Asegúrate de que las variables CSS (`--primary`, `--radius`, etc.) se carguen correctamente.

### 2. Refactorización del Layout (Shell)
- Sustituye el layout principal de la aplicación por el componente maestro `@ux/baseline/layout-shell.tsx`.
- Configura el **Sidebar** utilizando `@ux/baseline/sidebar.tsx`, pasando la lista de rutas (navItems) y los recursos de marca definidos por el proyecto.
- Implementa el **Footer** institucional utilizando el componente maestro de la librería con el año dinámico.

### 3. Alineación de Diseño y Dashboard
- Para cualquier dashboard o vista de métricas, utiliza exclusivamente el componente `@ux/baseline/kpi-card.tsx`.
- Respeta la regla de **alineación institucional** (todo a la izquierda en tarjetas, sin decoraciones ad-hoc).

### 4. Cumplimiento de Reglas Críticas
- **Tipografía**: Usa Space Grotesk para encabezados y Inter para el cuerpo, tal como define el manual.
- **Microcopy**: Aplica las reglas del anexo de 'Experiencia Conversacional' (Proper Case, voz activa, ortografía impecable).
- **Checklist**: Antes de finalizar, utiliza el archivo `@ux/checklist.md` para realizar una auditoría de calidad de cada pantalla.

Tu objetivo es que este proyecto sea consistente con la suite basada en BoardFlow en términos de 'look & feel' y comportamiento."
---

### 💡 Instrucciones Adicionales para el Usuario
1.  **Copiar la carpeta**: Primero, copia físicamente la carpeta `UX_Library/` de este proyecto al nuevo.
2.  **Pegar el prompt**: Dale el texto anterior a tu asistente de IA (como Antigravity) en el nuevo proyecto.
3.  **Listo**: El asistente entenderá que la "Verdad" reside en esa carpeta y construirá todo basándose en ella.
