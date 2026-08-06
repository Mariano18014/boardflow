Esta carpeta contiene la **Librería de Identidad Digital (UX Library)** de BoardFlow. Es la "Fuente Única de Verdad" (Single Source of Truth) para el diseño y comportamiento de la interfaz.

### Estructura
- **manual-identidad-ux.md**: Guía completa de principios, colores y tipografía.
- **baseline/**: Archivos maestros de código (CSS y React) que definen la estructura base.
- **checklist.md**: Lista de verificación para auditorías de calidad UX.

### Uso
Los componentes en `baseline/` están diseñados para ser importados o referenciados por la aplicación principal en `client/src/`. Cualquier cambio visual global debe realizarse aquí.
