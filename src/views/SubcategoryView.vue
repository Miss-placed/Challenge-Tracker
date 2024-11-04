<template>
  <div class="challenge-cards-container">
    <h2>Challenge Cards</h2>
    <div class="challenge-cards-grid">
      <ChallengeCard
        v-for="challenge in challenges"
        :key="challenge.name"
        @click="openSidePanel(challenge)"
        :name="challenge.name"
        :description="challenge.description"
        :image="challenge.imageUrl"
      />
    </div>

    <!-- Side panel for challenge details -->
    <div v-if="selectedChallenge" class="side-panel">
      <button @click="closeSidePanel" class="close-panel-button">X</button>
      <h2>{{ selectedChallenge.title }}</h2>
      <img
        :src="selectedChallenge.imageUrl"
        alt="Challenge Detail Image"
        class="challenge-detail-image"
      />
      <p>{{ selectedChallenge.description }}</p>
      <p><strong>Steps:</strong> {{ selectedChallenge.steps }}</p>
    </div>
  </div>
</template>

<script setup>
import ChallengeCard from '@/components/Part/ChallengeCard.vue'
import { ref, onMounted } from 'vue'
import { db } from '/firebase/firebase_settings.js'
import { getDocs, collection } from 'firebase/firestore'
import { useRoute } from 'vue-router'

const route = useRoute()
const challenges = ref([])
const selectedChallenge = ref(null)

// Fetch challenge cards from Firestore
const fetchChallenges = async () => {
  try {
    const snapshot = await getDocs(
      collection(
        db,
        'challenges',
        route.params.gamemode,
        'main_category',
        route.params.category,
        'sub_category',
        route.params.subcategory,
        'challenges',
      ),
    )
    challenges.value = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching challenges:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchChallenges()
})

// Function to open the side panel
const openSidePanel = challenge => {
  selectedChallenge.value = challenge
}

// Function to close the side panel
const closeSidePanel = () => {
  selectedChallenge.value = null
}
</script>
<style scoped>
.challenge-cards-container {
  display: flex; /* Use flexbox for the container */
  flex-direction: column; /* Stack elements vertically */
  height: 100vh; /* Make sure it takes full height for mobile view */
}

.challenge-cards-grid {
  max-width: 1200px;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns for desktop */
  gap: 20px; /* Space between grid items */
  width: 100%; /* Full width of the container */
  flex-grow: 1; /* Allow grid to grow and take available space */
  align-content: start;
  align-items: start;
}

.side-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px; /* Fixed width for desktop */
  height: 100%; /* Full height for desktop */
  background: white;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.3);
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column; /* Stack content vertically */
}

.close-panel-button {
  background: red;
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px;
  margin-bottom: 20px;
}

.challenge-detail-image {
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .challenge-cards-grid {
    grid-template-columns: 1fr; /* Switch to a single column on mobile */
  }

  .side-panel {
    position: fixed; /* Fixed position for mobile */
    bottom: 0; /* Move to the bottom of the screen */
    top: auto;
    left: 0;
    right: 0; /* Align to the right */
    width: 100%; /* Full width for mobile */
    height: 50vh; /* Height adjusts based on content */
    max-height: 70%; /* Limit height to 70% of the viewport */
    overflow-y: auto; /* Scroll if content overflows */
    border-top: 1px solid #ddd; /* Optional: Add a border to differentiate */
  }

  .close-panel-button {
    align-self: flex-end; /* Align close button to the right */
  }
}
</style>
