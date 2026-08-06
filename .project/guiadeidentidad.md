# Guía Única de Identidad Digital

## 1. Propósito
Esta guía define un sistema unificado de identidad digital para BoardFlow, combinando solidez institucional con claridad operativa. Su objetivo es reducir ambigüedad, acelerar desarrollo y garantizar coherencia visual y de experiencia.

## 2. Principios Rectores
- **Consistencia institucional**: todos los productos deben sentirse parte de la misma familia.
- **Prescripción clara**: menos decisiones ad‑hoc, más reglas explícitas.
- **Escalabilidad**: válida para productos simples y complejos.
- **Orientada a producto**: la identidad debe servir al flujo de trabajo real.

## 3. Identidad Visual
### 3.1 Paleta de color (tokens base)
- **Primary / Navy**: HSL 228 47% 22%
- **Secondary / Blue**: HSL 212 43% 50%
- **Accent / Amber**: HSL 38 92% 50%

#### Estados (Tokens Semánticos)
- **Success**: HSL 142 76% 36% (Verde institucional)
- **Warning**: HSL 38 92% 50% (Amber / Accent)
- **Error**: HSL 0 84% 60% (Rojo institucional / Destructive)
- **Info**: HSL 212 43% 50% (Blue / Secondary)

#### Superficies y Texto (Tokens Neutros)
- **Background**: HSL 220 30% 98% (Light) / HSL 228 47% 6% (Dark)
- **Card**: HSL 0 0% 100% (Light) / HSL 228 47% 12% (Dark)
- **Muted Foreground**: HSL 228 20% 45% (Gris para textos secundarios como el footer)
- **Radius**: 0.75rem (12px - Redondeo institucional)
> [!IMPORTANT]
> Los colores de estado deben usarse solo para comunicar estado, nunca como decoración.

### 3.2 Variantes de Sidebar (Tematización)
El sistema soporta dos variantes de Sidebar según la densidad y jerarquía del producto:

#### A. Sidebar Institucional (Light)
- **Fondo**: Blanco puro (`hsl(0, 0%, 100%)`).
- **Texto/Icono Inactivo**: Slate 500 (`hsl(228, 20%, 45%)`).
- **Ítem Activo**: 
    - Fondo: Navy (`hsl(228, 47%, 22%)`).
    - Texto/Icono: Blanco.

#### B. Sidebar Profesional (Dark) - *Ej: Gestión TI*
- **Fondo**: Navy (`hsl(228, 47%, 22%)`).
- **Texto/Icono Inactivo**: Slate 300 (`hsl(228, 20%, 80%)`).
- **Ítem Activo**:
    - Fondo: Accent/Amber (`hsl(38, 92%, 50%)`).
    - Texto/Icono: Navy (para máximo contraste).

> [!TIP]
> En la variante Dark, el logotipo **siempre** debe ir dentro de un contenedor blanco redondeado (`bg-white p-3 rounded-2xl`) para preservar la integridad de los colores institucionales del logo.

### 3.3 Logotipo y Nombre de Aplicación
BoardFlow utiliza una combinación de isotipo institucional y nombre de producto con una jerarquía clara.

#### Construcción del Cabezal (Sidebar)
![Logo y Nombre](https://raw.githubusercontent.com/lucid-icons/lucide/main/icons/shield-check.svg) *(Nota: Referencia visual al isotipo institucional)*

- **Logo**: Isotipo institucional del proyecto.
    - Altura: 100px (Desktop) / 70px (Dark mode contrast).
    - Contenedor: En modo oscuro, usar fondo blanco `p-3` con radio institucional y sombra leve para legibilidad.
- **Nombre de Aplicación**:
    - **Texto**: "APP [Nombre]" (Ej: APP BoardFlow).
    - **Regla de Oro**: Prohibido el uso de ALL CAPS (Todo Mayúsculas). Debe usarse **Proper Case** (Solo primera letra en mayúscula por palabra significativa).
    - **Ortografía**: Es obligatorio el uso de tildes y gramática correcta en español (Ej: "Gestión", no "GESTIÒN").
    - **Fuente**: Space Grotesk (`font-heading`).
    - **Peso**: Bold (700).
    - **Tamaño**: 15px.
    - **Color**: Navy (`text-slate-800`) en claro / `text-slate-100` en oscuro.
    - **Ubicación**: Centrado bajo el logo, con un margen superior de 8px (`mt-2`).

### 3.4 Tipografía
- **Headings**: Space Grotesk
- **Body / UI**: Inter

#### Reglas:
- H1–H3: Space Grotesk
- H4 en adelante + labels + inputs: Inter
> [!IMPORTANT]
> Nunca mezclar tipografías en un mismo componente.

## 4. Layout y Estructura
### 4.1 Estructura base
- **Sidebar izquierda**
    - Expandida: 280px
    - Colapsada: 80px
- **Header superior**: fijo, altura estándar
- **Main content**: centrado, `max-w-7xl`
- **Padding Global**: El contenido principal (`main content`) debe tener un padding mínimo de `p-6` (24px) o `p-8` (32px) para evitar que los elementos toquen el Sidebar o los bordes de la pantalla.

### 4.2 Sistema de Espaciado (8px Grid)
Para garantizar el ritmo visual, todas las medidas de padding, margin y gap deben ser múltiplos de **4px** o **8px**.
- **Base**: 4px (p-1), 8px (p-2), 16px (p-4), 24px (p-6), 32px (p-8).
- **Regla**: Nunca usar valores "mágicos" (ej: 13px, 21px). Si una medida no es múltiplo de 4, el diseño es incorrecto.

### 4.3 Iconografía
- **Librería**: Lucide Icons.
- **Peso de Trazo (Stroke)**: Siempre **2px** (default) o **1.5px** para un look más refinado en dashboards densos.
- **Tamaño Estándar**: 16px (text-sm) o 20px (general). Solo usar >24px para ilustraciones o empty states.
- **Consistencia**: Un mismo concepto siempre usa el mismo icono (Ej: `User` para perfil, nunca alternar con `Contact`).

### 4.4 Pie de Página (Footer)
El sistema utiliza un pie de página global para garantizar la autoría y la vigencia del producto.

- **Ubicación**:
    - Al final del contenido principal (`main content`).
    - En la base del menú lateral móvil (`drawer`).
- **Contenido**: `© {Año Actual} {Nombre de la Organización} — Todos los derechos reservados.`
- **Reglas de Estilo**:
    - **Automatización**: El año debe ser dinámico (calculado por sistema), nunca estático.
    - **Tipografía**: Sentence case (solo primera letra en mayúscula), peso estándar (sin negrita).
    - **Tamaño**: Muy pequeño (10px–11px) y color sutil (Slate 400 o similar).
    - **Simplicidad**: No debe competir visualmente con el contenido de la aplicación.

### 4.5 Comportamiento Responsive (obligatorio)
Breakpoints sugeridos (Tailwind): `sm (≥640)`, `md (≥768)`, `lg (≥1024)`, `xl (≥1280)`.

#### Desktop (≥1024 / lg)
- Sidebar visible (expandida o colapsada).
- Header fijo.
- Main centrado `max-w-7xl`.
- Formularios en 2 columnas cuando el contenido lo justifique.

#### Tablet (768–1023 / md–lg)
- Sidebar colapsada por defecto.
- Prioridad al contenido principal; acciones primarias en header.
- Formularios preferentemente 1 columna o 2 columnas suaves (según densidad).

#### Mobile (<768 / <md)
- Sidebar oculta y accesible vía drawer (menú).
- Navegación secundaria bajo demanda.
- Formularios siempre 1 columna.
- Acciones primarias siempre visibles (sticky footer o header) cuando el flujo lo requiera.

#### Reglas de coherencia
- El colapso/expansión no debe cambiar jerarquía de información; solo presentación.
- No ocultar información crítica sin alternativa accesible.

### 4.6 Estructura de Cabeceras de Página (Page Headers)
El cabezal de cada sección es el ancla visual del usuario. Debe seguir esta estructura obligatoria:

- **Título (H1)**: Space Grotesk Bold, Navy.
- **Descripción**: Inter Regular, Slate 500. Debe explicar brevemente el propósito de la pantalla.
- **Acciones Primarias**: Si hay botones de acción (ej: "Nueva Licencia"), deben ubicarse a la **derecha** del título, alineados al tope.
- **Espaciado**: El bloque de cabecera debe tener un `mb-8` (32px) para separar el título del contenido/filtros.

### 4.7 Alineación de Controles y Filtros
- Los buscadores y filtros deben ir en una línea dedicada bajo el cabezal, nunca mezclados con el título.
- El ancho máximo de un buscador aislado no debe superar los 400px para evitar "estiramientos" visuales innecesarios.

## 5. Componentes UI
### 5.1 Stack obligatorio
- React + TypeScript + Vite
- Tailwind CSS v4
- Shadcn/UI
- Iconos: Lucide

### 5.2 Librerías complementarias (cuando aplique)
- Animaciones: Framer Motion
- Charts: Recharts
- Mapas: Leaflet

## 6. Estados y Flujos
### 6.1 Estados de sistema (genéricos)
- Idle
- Loading
- Empty
- Error
- Success

### 6.2 Estados de negocio (ejemplo)
Cada producto debe mapear sus estados de negocio a colores y patrones comunes:
- Borrador
- En revisión / En firma
- Aprobado
- Rechazado
- Finalizado

### 6.3 Capacidades por Rol (Refuerzo Institucional)
- **Gestión por Rol**: Los roles privilegiados pueden gestionar registros y configuraciones preservando la trazabilidad total mediante auditoría.
- **Métricas Base**: El dashboard debe exponer indicadores operativos genéricos que cada proyecto pueda reemplazar por sus métricas de negocio.

> [!NOTE]
> El color refuerza el estado, pero el texto siempre es obligatorio.

## 7. Lenguaje Visual y UX
### 7.1 Estética General
- Glassmorphism sutil (blur + transparencia leve) en headers y overlays.
- Bordes redondeados consistentes: usar el token `--radius-institutional` (12px).
- **Tarjetas (Cards)**:
    - Fondo: Blanco puro (`bg-card`).
    - Padding interno: Siempre `p-6` (24px).
    - Alineación: El contenido interno (iconos, números, etiquetas) debe estar perfectamente alineado a la izquierda. Se prohíbe el centrado vertical/horizontal de datos en tarjetas de KPI a menos que sea un gráfico circular.
    - **Iconografía**: Los iconos dentro de las tarjetas deben usar el color `Secondary / Blue` por defecto. Si el dato representa una alerta o categoría específica (ej: Vencimientos), se permite el uso de `Accent / Amber` o el color semántico correspondiente (Success/Error).
- **Contrastes de Sección**: Para separar áreas densas (como el Dashboard), se recomienda usar un fondo de página levemente grisáceo (`hsl(220, 30%, 98%)`) que haga resaltar las tarjetas blancas (`bg-card`).
- Formularios como eje central de interacción: prioridad a la claridad del input sobre la decoración.
- Panel de ayuda contextual siempre disponible en el lateral derecho.

### 7.2 Sombras y Elevación (Depth)
Para evitar que los elementos compitan visualmente, se definen tres niveles de profundidad:
- **Nivel 1 (Básico)**: `0 1px 2px rgba(0,0,0,0.05)`. Para tarjetas y elementos de lista.
- **Nivel 2 (Intermedio)**: `0 4px 6px rgba(0,0,0,0.1)`. Para botones en hover y menús desplegables.
- **Nivel 3 (Superior)**: `0 20px 25px rgba(0,0,0,0.15)`. Exclusivo para modales y diálogos críticos.
- **Regla**: No usar sombras de colores ni sombras duras (hard shadows). El objetivo es la sutileza.

## 8. Accesibilidad (básica por defecto)
La accesibilidad no se activa: está presente por defecto. El usuario solo puede ajustar preferencias desde su perfil.

### 8.1 Accesibilidad activa por defecto (no configurable)
Estas reglas aplican siempre, sin intervención del usuario:
- Contraste mínimo AA.
- Estados no comunicados solo por color.
- Focus visible y consistente en todos los elementos interactivos.
- Navegación por teclado completa (tab order lógico, Escape cierra modales).
- Labels visibles en formularios y errores claros por campo.
- Tamaños mínimos de interacción (≥44×44px en mobile).
- Respeto automático a configuraciones del sistema cuando existan.

### 8.2 Preferencias de accesibilidad (Perfil → Preferencias)
Estas opciones existen en todas las apps y arrancan en valores seguros.

#### Visual
- Tema: Seguir sistema / Claro / Oscuro.
- Tamaño de texto: Normal / Grande.

#### Movimiento
- Reducir movimiento: Seguir sistema / Reducir.

#### Ayudas
- Ayudas contextuales: Siempre / Solo primera vez / Nunca.

#### Reglas
- Persisten por usuario.
- Cambios visibles de forma inmediata cuando aplique.
- Opción "Restablecer valores predeterminados".

## 9. Gobernanza del sistema
- Esta guía es un manual vivo.
- Cambios deben documentarse y versionarse.
- Ningún producto puede romper tokens base sin justificación.

## 11. Anexo: Portabilidad Tecnológica
Para replicar esta identidad en otros entornos (Vue, Angular, HTML/JS puro), se deben seguir estas pautas de abstracción:

### 11.1 Sistema de Tokens (CSS Variables)
No depender de clases de Tailwind. Definir una hoja de estilos base (`identity-v2.css`):
```css
:root {
  --base-navy: 228 47% 22%;       /* Primary */
  --base-blue: 212 43% 50%;       /* Secondary */
  --base-amber: 38 92% 50%;       /* Accent */
  --radius-institutional: 0.75rem; 
  --blur-glass: 8px;
}
```

### 11.2 Tipografía Universal
Cargar vía Google Fonts o auto-alojado:
- **Títulos**: `family=Space+Grotesk:wght@700`
- **Cuerpo**: `family=Inter:wght@400;500;700`

### 11.3 Lógica de Accesibilidad Agnóstica
Usar atributos `data-*` en el tag `<html>` para que los estilos reaccionen sin importar el framework:
- `html[data-theme="dark"]`
- `html[data-text-scale="large"]`
- `html[data-motion="reduced"]`

### 11.4 Reglas de Layout Progresivo
Si no se usa Flexbox/Grid de Tailwind, mantener las proporciones:
- Sidebar: 280px (Desktop) / 0px + Drawer (Mobile).
- Contenedor: `max-width: 1280px` centrado.
- Footer: Texto 11px, `sentence-case`, peso 400.

### 11.5 Implementación en Frameworks de Backend (Laravel / Symfony / etc.)
La identidad es totalmente compatible con arquitecturas donde el HTML se genera en el servidor:

- **Template Engines**: En Blade (Laravel) o Twig (Symfony), el sistema de tokens CSS se carga como un asset global.
- **Lógica de Footer**:
    - **Laravel**: `@php echo date('Y'); @endphp` o `{{ now()->year }}`.
    - **Symfony**: `{{ "now"|date("Y") }}`.
- **Gestión de Assets**: Usar Vite o Webpack Encore para compilar los estilos base definidos en esta guía, garantizando que las fuentes y colores sean idénticos.
- **Interoperabilidad**: Al usar las mismas variables CSS (`--base-navy`, etc.), un componente renderizado en PHP se verá exactamente igual a uno renderizado en React.

## 12. Anexo II: Experiencia Conversacional (Tono, Voz y Microcopy)
La identidad digital del proyecto no es solo visual, sino también lingüística. La forma en que el sistema "habla" define la confianza del usuario.

### 12.1 El Tono Institucional Moderno
- **Humano, no Robótico**: Evitar el uso excesivo de la voz pasiva.
- **Activo y Directo**: Dirigirse al usuario directamente para facilitar la acción.
    - *Correcto*: "Tu registro fue guardado con éxito."
- **Inclusivo y Accesible**: Usar un lenguaje neutral que no asuma género ni nivel técnico avanzado.
- **Calidad Lingüística**: El sistema debe reflejar profesionalismo. El uso de tildes, mayúsculas correctas y puntuación es un requerimiento funcional, no estético. Una "o" con tilde grave (ò) en lugar de aguda (ó) se considera un **bug de identidad**.


### 12.2 Reglas de Microcopy (Textos de Interface)
- **Botones**: Deben empezar con un verbo de acción claro.
    - *Ej*: "Enviar Registro", "Descargar PDF", "Guardar Borrador".
- **Tooltips**: No repetir lo que dice el label. Deben aportar valor o contexto adicional.
- **Mensajes de Error (Feedback de Seguridad)**:
    - **Qué pasó**: Explicar el problema sin culpar al usuario.
    - **Cómo se arregla**: Dar una instrucción clara de salida.
    - *Ej*: "El formato del archivo no es compatible. Por favor, suba una imagen JPG o PNG."

### 12.3 Estados Vacíos (Empty States): El "Diseño para el momento cero"
Una pantalla vacía es una oportunidad de capacitación. Un Empty State debe tener siempre tres elementos:
1. **Iconografía/Ilustración**: Sutil, en tonos Slate 200/300.
2. **Mensaje de Contexto**: Título claro que explique la ausencia de datos.
3. **Llamada a la Acción (CTA)**: Un botón que permita al usuario salir de ese estado (ej: "Crear primer trámite").

### 12.4 Psicología de la Carga (Loading States)
- Usar **Skeletons** para cargas de página (dan sensación de velocidad).
- Usar **Spinners** solo para acciones cortas (como enviar un formulario).

---

## 13. Anexo III: Gobernanza y Evolución del Sistema
Para que esta guía no se convierta en un documento estático, se establece un modelo de mantenimiento evolutivo.

### 13.1 Metodología de Diseño Atómico
Todos los nuevos desarrollos deben pensarse bajo esta jerarquía:
1. **Átomos**: Colores, fuentes, inputs básicos.
2. **Moléculas**: Un campo de búsqueda con su botón, una tarjeta de perfil.
3. **Organismos**: El Sidebar completo, una tabla de gestión con filtros.

### 13.2 La "Fuente Única de Verdad" (Single Source of Truth)
- Cualquier cambio de identidad (ej: cambiar el azul institucional) debe realizarse **exclusivamente** en los tokens CSS (`:root`). 
- **Prohibido**: Hardcodear colores hexadecimales o HSL dentro de componentes individuales.

### 13.3 Proceso de Contribución
Si un desarrollador crea un componente nuevo que no está en la guía:
1. **Validación**: Se chequea contra los principios rectores (Sección 2).
2. **Abstracción**: Se eliminan lógicas de negocio para hacerlo genérico.
3. **Documentación**: Se añade al manual con su ejemplo de uso.

### 13.4 Versionado del Manual
Esta guía utiliza versionado semántico:
- **Major (1.0.0 → 2.0.0)**: Cambios estructurales de marca o identidad.
- **Minor (1.1.0 → 1.2.0)**: Nuevos componentes o secciones de ayuda.
- **Patch (1.1.1)**: Corrección de textos o aclaraciones técnicas.

---

## 14. Anexo IV: Checklist de Calidad (Quick Audit)
Antes de dar por finalizada una pantalla o componente, verifique el cumplimiento de los siguientes puntos:

### 14.1 Fundamentos Visuales (Tokens)
- [ ] **Color**: ¿Se usan exclusivamente variables CSS (`--base-navy`, etc.)? (Prohibido Hardcode).
- [ ] **Semántica**: ¿Los colores de estado (Success/Error) se usan solo para comunicar estados?
- [ ] **Tipografía**: ¿Space Grotesk se usa solo para H1, H2 y H3? ¿Inter para el resto?
- [ ] **Pesos**: ¿Se evitan grosores de fuente no definidos (como `font-black`)?

### 14.2 Layout y Grilla
- [ ] **Ritmo**: ¿Todos los márgenes, paddings y gaps son múltiplos de **4px** u **8px**?
- [ ] **Sidebar**: ¿Respeta los 280px (Desktop) u 80px (Colapsado)?
- [ ] **Responsive**: ¿El formulario pasa a 1 columna en pantallas móviles (<768px)?
- [ ] **Contenedor**: ¿El contenido principal está limitado a `max-w-7xl` (1280px)?

### 14.3 Branding y Logotipo
- [ ] **Nombre**: ¿Aparece como "APP [Nombre]" centrado bajo el logo?
- [ ] **Estilo**: ¿El nombre usa Space Grotesk Bold, 15px y margen superior de 8px?
- [ ] **Contraste**: En modo oscuro, ¿el logo está dentro de un contenedor blanco redondeado?

### 14.4 Componentes y UX
- [ ] **Iconografía**: ¿Todos los iconos Lucide tienen un `stroke` de 1.5px o 2px?
- [ ] **Botones**: ¿El texto empieza con un verbo de acción claro (ej: "Guardar", no "Aceptar")?
- [ ] **Empty States**: ¿Toda pantalla sin datos tiene ilustración, contexto y un botón de acción (CTA)?
- [ ] **Feedback**: ¿Se usan Skeletons para carga de datos y Spinners para envíos de formularios?
- [ ] **Footer**: ¿Es pequeño (11px), en `sentence case` y tiene el año dinámico?

### 14.5 Accesibilidad (Obligatorio)
- [ ] **Navegación**: ¿Se puede operar toda la pantalla usando solo el teclado (Tab / Enter / Esc)?
- [ ] **Foco**: ¿El anillo de enfoque (focus ring) es visible y no está oculto?
- [ ] **Contraste**: ¿El texto cumple con el ratio mínimo de contraste AA (4.5:1)?
- [ ] **Formularios**: ¿Todos los campos tienen un `<label>` visible y mensajes de error descriptivos?

### 14.6 Tono y Microcopy
- [ ] **Voz**: ¿Se usa voz activa (Directo al usuario) en lugar de pasiva o robótica?
- [ ] **Errores**: ¿El mensaje de error explica qué pasó y cómo se soluciona sin culpar al usuario?

---

## 15. Regla de Oro (Final)
> [!IMPORTANT]
> Si una pantalla no puede explicarse usando esta guía, el problema es la pantalla, no la guía.
