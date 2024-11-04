<template>
  <div class="game-modes-container">
    <h2>Game Modes</h2>
    <div class="game-modes-grid">
      <div
        class="game-mode-card"
        v-for="mode in gameModes"
        :key="mode.name"
        @click="
          router.push({
            name: 'gamemodeView',
            params: { game: route.params.game, gamemode: mode.name },
          })
        "
      >
        <img
          :src="mode.imageUrl"
          alt="Game Mode Image"
          class="game-mode-image"
        />
        <div class="game-mode-info">
          <h3>{{ mode.title }}</h3>
          <p>{{ mode.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '/firebase/firebase_settings.js'
import { getDocs, collection } from 'firebase/firestore'
import { useRouter, useRoute } from 'vue-router'
const route = useRoute()
const router = useRouter()
const gameModes = ref([])

// Fetch game modes from Firestore
const fetchGameModes = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'challenges'))
    gameModes.value = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching game modes:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchGameModes()
})
</script>

<style scoped>
.game-modes-container {
  padding: 20px;
}

.game-modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.game-mode-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 1; /* Set the aspect ratio */
}

.game-mode-image {
  width: 100%;
  height: 50%; /* Adjust height for aspect ratio */
  object-fit: cover;
}

.game-mode-info {
  padding: 10px;
  flex: 1;
}
</style>
