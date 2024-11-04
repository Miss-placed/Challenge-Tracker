<template>
  <div class="main-categories-container">
    <h2>Main Categories</h2>
    <div class="main-categories-grid">
      <div
        class="main-category-card"
        v-for="category in mainCategories"
        :key="category.name"
        @click="
          router.push({
            name: 'categoryView',
            params: {
              game: route.params.game,
              category: category.name,
              gamemode: route.params.gamemode,
            },
          })
        "
      >
        <img
          :src="category.imageUrl"
          alt="Main Category Image"
          class="main-category-image"
        />
        <div class="main-category-info">
          <h3>{{ category.title }}</h3>
          <p>{{ category.description }}</p>
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
const mainCategories = ref([])

// Fetch main categories from Firestore
const fetchMainCategories = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, 'challenges', route.params.gamemode, 'main_category'),
    )
    console.log(snapshot.docs)
    mainCategories.value = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching main categories:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchMainCategories()
})
</script>

<style scoped>
.main-categories-container {
  padding: 20px;
}

.main-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.main-category-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 1; /* Set the aspect ratio */
}

.main-category-image {
  width: 100%;
  height: 50%; /* Adjust height for aspect ratio */
  object-fit: cover;
}

.main-category-info {
  padding: 10px;
  flex: 1;
}
</style>
