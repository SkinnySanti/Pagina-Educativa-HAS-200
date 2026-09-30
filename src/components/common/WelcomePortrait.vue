<script setup>
// Ilustración propia (no es una foto): dos avatares abstractos, con los
// colores de marca, saludando. No representa a nadie real — es a propósito
// no-realista para no caer en estereotipos de raza o apariencia.
</script>

<template>
  <svg class="portrait" viewBox="0 0 120 96" role="img" aria-label="" width="96" height="78">
    <defs>
      <linearGradient id="p1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#1b4f9c" />
        <stop offset="1" stop-color="#3d7bd6" />
      </linearGradient>
      <linearGradient id="p2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0e9f8a" />
        <stop offset="1" stop-color="#4fc9b6" />
      </linearGradient>
    </defs>

    <!-- avatar trasero -->
    <g transform="translate(48,6)">
      <path d="M4 74c0-15 8-24 22-24s22 9 22 24" fill="url(#p2)" opacity="0.9" />
      <circle cx="26" cy="26" r="22" fill="url(#p2)" opacity="0.9" />
    </g>

    <!-- avatar delantero -->
    <g transform="translate(4,14)">
      <path d="M2 76c0-17 9-27 25-27s25 10 25 27" fill="url(#p1)" />
      <circle cx="27" cy="27" r="25" fill="url(#p1)" />
      <!-- carita: sonrisa simple -->
      <path d="M17 30c2 4 5 6 10 6s8-2 10-6" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" />
      <circle cx="18" cy="21" r="2.6" fill="#fff" />
      <circle cx="36" cy="21" r="2.6" fill="#fff" />
    </g>

    <!-- mano saludando -->
    <g transform="translate(78,4) rotate(18)">
      <ellipse cx="8" cy="8" rx="7" ry="9" fill="#fff" opacity="0.95" />
    </g>
  </svg>
</template>

<style scoped>
.portrait { flex: none; display: block; }
</style>
