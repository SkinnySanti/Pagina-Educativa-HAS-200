<script setup>
// Ilustración propia (no es una foto): un cuaderno con lápiz y una pila de
// libros, con los colores de marca. Representa la idea de "examen / estudio".
</script>

<template>
  <svg class="portrait" viewBox="0 0 120 96" role="img" aria-label="" width="96" height="78">
    <defs>
      <linearGradient id="e1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1b4f9c" />
        <stop offset="1" stop-color="#3d7bd6" />
      </linearGradient>
      <linearGradient id="e2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0e9f8a" />
        <stop offset="1" stop-color="#4fc9b6" />
      </linearGradient>
    </defs>

    <!-- pila de libros (atrás, a la derecha) -->
    <g transform="translate(62,34)">
      <!-- libro inferior -->
      <rect x="0" y="40" width="50" height="14" rx="3" fill="url(#e2)" opacity="0.9" />
      <rect x="4" y="44" width="42" height="2.4" rx="1.2" fill="#fff" opacity="0.85" />
      <!-- libro medio -->
      <rect x="5" y="25" width="42" height="14" rx="3" fill="url(#e1)" opacity="0.9" />
      <rect x="9" y="29" width="34" height="2.4" rx="1.2" fill="#fff" opacity="0.85" />
      <!-- libro superior -->
      <rect x="2" y="10" width="46" height="14" rx="3" fill="url(#e2)" opacity="0.9" />
      <rect x="6" y="14" width="38" height="2.4" rx="1.2" fill="#fff" opacity="0.85" />
    </g>

    <!-- cuaderno (adelante, a la izquierda) -->
    <g transform="translate(6,12)">
      <!-- hoja / tapa -->
      <rect x="0" y="0" width="56" height="72" rx="6" fill="url(#e1)" />
      <!-- espiral -->
      <circle cx="9" cy="12" r="2.6" fill="#fff" />
      <circle cx="9" cy="26" r="2.6" fill="#fff" />
      <circle cx="9" cy="40" r="2.6" fill="#fff" />
      <circle cx="9" cy="54" r="2.6" fill="#fff" />
      <!-- líneas de texto -->
      <path d="M20 14h28M20 26h28M20 38h28M20 50h18"
            fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.9" />
      <!-- visto bueno -->
      <path d="M40 54l4 4 8-9" fill="none" stroke="#4fc9b6" stroke-width="3"
            stroke-linecap="round" stroke-linejoin="round" />
    </g>

    <!-- lápiz (inclinado, sobre el cuaderno) -->
    <g transform="translate(66,10) rotate(35)">
      <!-- cuerpo -->
      <rect x="0" y="0" width="9" height="42" rx="1.5" fill="#fff" opacity="0.95" />
      <rect x="0" y="0" width="9" height="42" rx="1.5" fill="none" stroke="#0e9f8a" stroke-width="1.6" />
      <!-- borrador -->
      <rect x="0" y="-6" width="9" height="7" rx="2" fill="#4fc9b6" />
      <!-- punta -->
      <path d="M0 42h9l-4.5 11z" fill="#3d7bd6" />
      <path d="M2.6 47.6h3.8l-1.9 5.4z" fill="#1b4f9c" />
    </g>
  </svg>
</template>

<style scoped>
.portrait { flex: none; display: block; }
</style>