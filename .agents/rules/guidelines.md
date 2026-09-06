# Official Guidelines & Mandatory Rules: Recovery & Wellness (Calgary, AB)

Este documento define las directrices y las **REGLAS TÉCNICAS OBLIGATORIAS E INMUTABLES** del proyecto.

---

## 🔒 1. Reglas de Comportamiento de UI y Maquetación (OBLIGATORIAS)

### A. Carrusel de Servicios Responsivo (Services Slider) - MANDATORIO:
* **Proporciones Exactas sin Cortes:**
  * **En Pantallas Grandes / Desktop (1024px+ y 4K / 32"):** Mostrar **exactamente 3 tarjetas completas** (`w-[calc(33.333%-16px)]` con `gap-6`). **Prohibido cortar o truncar la tercera tarjeta.**
  * **En Tablets (640px a 1023px):** Mostrar **exactamente 2 tarjetas completas** (`w-[calc(50%-12px)]`).
  * **En Teléfonos Móviles (<640px):** Mostrar **1 tarjeta completa al 100% de ancho** (`w-full`) para swipe táctil sin bordes cortados.
* **Desplazamiento Horizontal (Right to Left):**
  * Deslizamiento suave por página completa mediante botones de flechas (Izquierda / Derecha) y gesto táctil (*touch swipe*).
  * Paginación dinámica con puntos indicadores (*dots*) sincronizados con el número de páginas según la pantalla.

### B. Cabecera Fija Permanente (Fixed Header) - MANDATORIO:
* La cabecera completa (`TopBar` con Calgary, Direct Billing y teléfono + `Navbar` con logo y menú) debe permanecer **100% fija en la parte superior (`fixed top-0 left-0 right-0 z-50`)**.
* Es **obligatorio** que el usuario pueda acceder al teléfono, menú y botón de reserva en cualquier momento mientras hace scroll, especialmente en celulares.

### C. Patrón Visual Nordic Thermal Mist + Eucalipto - MANDATORIO:
* **Colores Oficiales:**
  * Primario: `#364F59` (Azul Niebla Nórdico)
  * Secundario: `#4F6D7A` (Azul Pizarra Suave)
  * Fondo General: `#F4F6F8` (Gris Perla Niebla Térmica)
  * Fondo de Tarjetas: `#FFFFFF` (Blanco Puro)
  * Acentos Botánicos: `#5A7B6E` (Verde Eucalipto)
  * Acentos de Madera: `#C7B198` (Roble Claro / Champán)
  * Tipografía: `#1A242B` (Carbón Pizarra Nórdico)
  * Footer: `#1E2A32` (Pizarra Nocturna)
* **Acentos Botánicos Vectoriales:** Ramas y hojas de eucalipto realistas con gradientes y sombras 3D (SVG vectoriales nítidos en 4K).

---

## 🛠️ 2. Estándar Tecnológico
* **Gestor de Paquetes Exclusivo:** **`pnpm`** (Prohibido npm / yarn).
* **Stack:** React 19 + TypeScript + Vite + Tailwind CSS.
* **Imágenes:** 100% libres de derechos (Unsplash 4K / 2400px de resolución).

---

## 🇨🇦 3. Cumplimiento Legal en Calgary, Alberta
* Licencias de la Ciudad de Calgary (2,200 horas).
* Direct Billing con aseguradoras de Alberta (*Alberta Blue Cross, Sun Life, Manulife, Canada Life, Green Shield, Desjardins*).
* Ley de Privacidad PIPA de Alberta en el *Intake Form*.
* Consentimiento informado y política de cancelación de 24 horas.

---

## 💎 4. Estándar de Código Tailwind CSS v4 & WebStorm (OBLIGATORIO)
* **Escala de Espaciado Nativa:** Usar clases directas cuando el valor sea múltiplo de 4px (ej. h-105 para 420px en lugar de h-[420px]).
* **Sintaxis v4 para !important:** Colocar la exclamación al final (justify-start!, 	ext-white!, hidden!).
* **Alturas Uniformes en Tarjetas:** Aplicar items-stretch, h-full, min-h-[3.25rem] para títulos y mt-auto para alinear botones a la base inferior.

* **Accesibilidad en Formularios:** Todo `<label>` debe tener `htmlFor` vinculado al `id` del campo (`input`, `select`, `textarea`), y todo campo debe tener `id` y `name`.
