# Checklist de Calidad UX (BoardFlow)

Verifique el cumplimiento de estos puntos antes de finalizar cualquier pantalla o componente.

### 1. Fundamentos Visuales (Tokens)
- [ ] **Color**: ¿Se usan exclusivamente variables CSS (`--base-navy`, etc.)? (Prohibido Hardcode).
- [ ] **Semántica**: ¿Los colores de estado (Success/Error) se usan solo para comunicar estados?
- [ ] **Tipografía**: ¿Space Grotesk se usa solo para H1, H2 y H3? ¿Inter para el resto?
- [ ] **Pesos**: ¿Se evitan grosores de fuente no definidos (como `font-black`)?

### 2. Layout y Grilla
- [ ] **Ritmo**: ¿Todos los márgenes, paddings y gaps son múltiplos de **4px** u **8px**?
- [ ] **Sidebar**: ¿Respeta los 280px (Desktop) u 80px (Colapsado)?
- [ ] **Responsive**: ¿El formulario pasa a 1 columna en pantallas móviles (<768px)?
- [ ] **Contenedor**: ¿El contenido principal está limitado a `max-w-7xl` (1280px)?

### 3. Branding y Logotipo
- [ ] **Nombre**: ¿Aparece como "APP [Nombre]" centrado bajo el logo?
- [x] **Nombre**: ¿Aparece como "APP [Nombre]" centrado bajo el logo?
- [x] **Estilo**: ¿El nombre usa Space Grotesk Bold, 15px y margen superior de 8px?
- [x] **Contraste**: En modo oscuro, ¿el logo está dentro de un contenedor blanco redondeado?

### 4. Componentes y UX
- [x] **Iconografía**: ¿Todos los iconos Lucide tienen un `stroke` de 1.5px o 2px?
- [x] **Botones**: ¿El texto empieza con un verbo de acción claro (ej: "Guardar", no "Aceptar")?
- [x] **Empty States**: ¿Toda pantalla sin datos tiene ilustración, contexto y un botón de acción (CTA)?
- [x] **Feedback**: ¿Se usan Skeletons para carga de datos y Spinners para envíos de formularios?
- [x] **Footer**: ¿Es pequeño (11px), en `sentence case` y tiene el año dinámico?

### 5. Accesibilidad (Obligatorio)
- [x] **Navegación**: ¿Se puede operar toda la pantalla usando solo el teclado (Tab / Enter / Esc)?
- [x] **Foco**: ¿El anillo de enfoque (focus ring) es visible y no está oculto?
- [x] **Contraste**: ¿El texto cumple con el ratio mínimo de contraste AA (4.5:1)?
- [x] **Formularios**: ¿Todos los campos tienen un `<label>` visible y mensajes de error descriptivos?

### 6. Tono y Microcopy
- [ ] **Errores**: ¿El mensaje de error explica qué pasó y cómo se soluciona sin culpar al usuario?
