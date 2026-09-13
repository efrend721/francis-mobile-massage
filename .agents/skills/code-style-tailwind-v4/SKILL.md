---
name: code-style-tailwind-v4
description: Estándares de estilo de código limpios y optimizados para Tailwind CSS v4, TypeScript y JetBrains WebStorm / IDEs modernos. Úsalo al escribir o refactorizar código frontend.
---

# Estándares de Estilo de Código: Tailwind CSS v4 & WebStorm

Esta skill define las convenciones de código frontend para garantizar cero advertencias en WebStorm y máxima compatibilidad con Tailwind CSS v4.

---

## 🎨 1. Convenciones de Clases en Tailwind CSS v4

### A. Escala de Espaciado y Dimensiones Nativas (Evitar corchetes innecesarios):
* En lugar de valores arbitrarios con corchetes como `h-[420px]`, utilizar la clase nativa de la escala de Tailwind cuando el valor sea múltiplo de 4px:
  * 420px / 4 = 105 -> usar `h-105` en vez de `h-[420px]`.
  * 320px / 4 = 80 -> usar `h-80` o `w-80`.
  * 240px / 4 = 60 -> usar `h-60` o `w-60`.

### B. Modificador !important al Final (Sintaxis Oficial Tailwind v4):
* En Tailwind CSS v4, el signo de exclamación `!` se coloca siempre al final del nombre de la clase de utilidad:
  * ✅ Correcto: `justify-start!`, `text-white!`, `p-4!`, `hidden!`, `flex!`
  * ❌ Evitar (sintaxis heredada v3): `!justify-start`, `!text-white`, `!p-4`.

### C. Opacidades Dinámicas con Tokens del Tema:
* Utilizar la barra `/` para definir opacidades sobre tokens de tema definido en `@theme`:
  * Ejemplo: `text-pearl/80`, `decoration-oak/60`, `bg-card-white/95`, `border-oak/30`.

---

## 📐 2. Estandarización de Alturas en Tarjetas y Contenedores Flex

* **Tarjetas en Fila / Carruseles:**
  * El contenedor padre debe usar siempre la utilidad `items-stretch` para igualar la altura de todas las tarjetas.
  * La tarjeta (por ejemplo `ServiceCard`) debe estructurarse con `h-full flex flex-col justify-between`.
  * Los títulos de longitud variable deben incluir la altura mínima `min-h-[3.25rem]` (reserva para 2 líneas) para alinear horizontalmente subtítulos y descripciones.
  * El bloque de precio y botón CTA debe anclarse mediante `mt-auto` para asegurar una línea de base horizontal uniforme en todas las tarjetas.

---

## 🔗 3. Manejo Limpio de Enlaces y Anclas Internas (URI Fragments)

* Los enlaces a secciones internas (`#id`) deben tener su elemento de destino definido con su `id` correspondiente en el DOM.
* En aplicaciones con encabezados fijos (`fixed header`), aplicar el scroll compensado mediante funciones de desplazamiento suave (`window.scrollTo({ top: offsetPosition, behavior: 'smooth' })`) o clases de margen de scroll (`scroll-mt-28`).

---

## 📝 4. Accesibilidad Obligatoria en Formularios (Form Fields & Labels)

* **Todo elemento `<input>`, `<select>`, `<textarea>`:**
  * Debe incluir `id="..."` único y descriptivo.
  * Debe incluir `name="..."` correspondiente.
  * Atributos `autoComplete` estándar cuando aplique (`name`, `email`, `tel`, `street-address`).
* **Todo elemento `<label>`:**
  * **OBLIGATORIO:** Debe tener `htmlFor="<field-id>"` apuntando exactamente al `id` del campo asociado (incluso para inputs ocultos o grupos de botones/radio).
  * Evita etiquetas `<label>` sin `htmlFor` o sin anidación para prevenir advertencias de accesibilidad (*A <label> isn’t associated with a form field*).
