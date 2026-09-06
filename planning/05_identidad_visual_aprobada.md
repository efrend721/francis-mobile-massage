# 05. Especificación Oficial y Reglas Obligatorias: Recovery & Wellness

Documento oficial de certificación de diseño y comportamiento funcional aprobado para la web de Calgary.

---

## 🔒 Reglas de Comportamiento Establecidas como Obligatorias

1. **Cabecera Superior Fija Permanente:**
   * La barra superior con el teléfono, aviso de *Direct Billing* y el menú de navegación se mantienen **100% fijos arriba (`fixed top-0 left-0 right-0 z-50`)** en celulares y computadoras.
2. **Carrusel de Servicios con Distribución Matemática sin Cortes:**
   * **Desktop (1024px+ / 4K):** Exactamente 3 tarjetas completas (`calc(33.333% - 16px)`). Cero cortes en la tercera tarjeta.
   * **Tablet (640px - 1023px):** Exactamente 2 tarjetas completas (`calc(50% - 12px)`).
   * **Móvil (<640px):** Exactamente 1 tarjeta completa (`w-full`) para swipe táctil.
   * Deslizamiento de derecha a izquierda con flechas y paginación por puntos.
3. **Patrón Visual Nordic Thermal Mist + Eucalipto:**
   * Azul Niebla Nórdico (`#364F59`), Gris Perla Niebla (`#F4F6F8`), Blanco Puro (`#FFFFFF`), Roble Claro (`#C7B198`) y ramas de eucalipto realistas con relieve 3D.
4. **Formulario de Reserva Rápido:**
   * Selector interactivo de tratamiento y duración, independiente del formulario médico digital (*Intake Form*).
