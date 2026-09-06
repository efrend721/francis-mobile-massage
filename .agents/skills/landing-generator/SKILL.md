---
name: landing-generator
description: Skill maestra para la generación y mantenimiento de la aplicación React de Recovery & Wellness en Calgary, con reglas estrictas de carrusel responsive y cabecera fija.
---

# Skill: Generador de Landing Page - Recovery & Wellness Calgary

## 🔒 Reglas Técnicas Inmutables de Compilación

1. **Cabecera Fija Inmóvil (`TopBar` + `Navbar`):**
   * Estructura: `<header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-card-white">`
   * Compensación en `<main>`: `pt-[88px] sm:pt-[108px] lg:pt-[116px]`.

2. **Carrusel de Servicios Responsivo (Services Slider):**
   * Contenedor: `flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth`
   * Ancho de tarjeta por breakpoint (MANDATORIO):
     * Móvil: `w-full flex-shrink-0 snap-start` (1 tarjeta completa)
     * Tablet: `sm:w-[calc(50%-12px)] flex-shrink-0 snap-start` (2 tarjetas completas)
     * Desktop / 4K: `lg:w-[calc(33.333%-16px)] flex-shrink-0 snap-start` (3 tarjetas completas)
   * Controles: Flechas izquierda/derecha deslizantes por viewport completo y puntos de paginación adaptativos.

3. **Gestor de Paquetes:** Exclusivamente `pnpm`.
4. **Imágenes 4K:** URLs de Unsplash con `auto=format&fit=crop&w=2400&q=85`.
5. **Ramas Botánicas:** SVG vectorial en `BotanicalDecor.tsx` con gradientes de eucalipto.

6. **Estilo de Código Tailwind CSS v4 & WebStorm:**
   * Dimensiones nativas: h-105 en lugar de h-[420px] (múltiplos de 4px).
   * Modificador de importancia al final: justify-start!, 	ext-white!.
   * Tarjetas simétricas con items-stretch, h-full y mt-auto para botones.
