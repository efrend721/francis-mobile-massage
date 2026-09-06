---
name: diseno-identidad
description: Skill maestra que contiene el patrón de UI oficial aprobado: Nordic Thermal Mist con acentos botánicos de eucalipto, variables CSS del design system, tipografías y componentes UI.
---

# Skill: Patrón de UI Definitivo - Nordic Thermal Mist + Botanical Accents

Este documento es la referencia visual oficial aprobada para el proyecto.

## 🖼️ Vista Previa Definitiva
La visualización aprobada se encuentra guardada en:
`assets/design_preview_definitivo.jpg`

---

## 🎨 Variables CSS Oficiales (Design Tokens)

```css
:root {
  /* Colores de Marca y Acción */
  --color-primary: #364F59;          /* Azul Niebla Nórdico (Marca, botones principales) */
  --color-primary-hover: #293D45;    /* Azul Pizarra Oscuro para interacciones */
  --color-primary-light: #4F6D7A;    /* Azul Pizarra Suave (Badges, acentos) */
  --color-primary-subtle: #E8EFF2;   /* Tinte azul niebla suave (Fondos activos) */

  /* Acentos Botánicos de Eucalipto */
  --color-botanical: #5A7B6E;        /* Verde Eucalipto Suave (Hojas, acentos orgánicos) */
  --color-botanical-light: #EBF2EE;  /* Fondo sutil botánico */
  --color-botanical-glow: rgba(90, 123, 110, 0.15);

  /* Fondos y Superficies */
  --color-bg-main: #F4F6F8;          /* Gris Perla Niebla (Fondo general relajante) */
  --color-bg-card: #FFFFFF;          /* Blanco Puro (Tarjetas limpias y pulcras) */
  --color-bg-card-warm: #FAF8F5;     /* Blanco cálido con tinte lino */
  --color-bg-dark: #1E2A32;          /* Pizarra Nocturna (Footer de alta gama) */

  /* Acentos de Madera Clara y Calidez */
  --color-accent-oak: #C7B198;       /* Roble Claro / Champán (Marcos, estrellas, bordes) */
  --color-accent-oak-light: #F2ECE4; /* Fondo sutil de madera/arena */

  /* Tipografía y Contraste */
  --color-text-main: #1A242B;        /* Carbón Pizarra Nórdico (Máxima legibilidad) */
  --color-text-muted: #5D6D75;       /* Gris Glaciar Neutro (Descripciones) */
  --color-text-light: #F4F6F8;       /* Texto claro sobre fondos oscuros */

  /* Tipografías de Google Fonts */
  --font-heading: 'Outfit', 'Playfair Display', Georgia, serif;
  --font-body: 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif;

  /* Bordes, Radios y Sombras */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --radius-full: 9999px;
  --shadow-card: 0 10px 30px rgba(54, 79, 89, 0.06);
  --shadow-hover: 0 18px 40px rgba(54, 79, 89, 0.12);
  --border-oak: 1px solid rgba(199, 177, 152, 0.5);
}
```

---

## 🌿 Implementación de Acentos Botánicos

1. **Ilustraciones SVG de Ramas de Eucalipto:**
   * Motivos botánicos con curvas orgánicas colocados en pseudo-elementos (`::before`, `::after`) o imágenes SVG optimizadas en las esquinas de las secciones Hero, Services y About.
2. **Tarjetas de Servicios con Borde de Roble:**
   * `background: var(--color-bg-card);`
   * `border: var(--border-oak);`
   * `border-radius: var(--radius-md);`
   * `box-shadow: var(--shadow-card);`
   * Efecto hover con elevación suave y resplandor botánico.
