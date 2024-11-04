<template>
  <main>
    <h1>Checkmate - Challenge tracker</h1>
    <div @click="router.push({ name: 'gameView', params: { game: 'bo6' } })">
      Black ops 6
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
