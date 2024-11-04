<template>
  <div class="sub-categories-container">
    <h2>Subcategories</h2>
    <div class="sub-categories-grid">
      <div
        class="sub-category-card"
        v-for="subCategory in subCategories"
        :key="subCategory.name"
        @click="
          router.push({
            name: 'subcategoryView',
            params: {
              game: route.params.game,
              category: route.params.category,
              subcategory: subCategory.name,
            },
          })
        "
      >
        <img
          :src="subCategory.imageUrl"
          alt="Subcategory Image"
          class="sub-category-image"
        />
        <div class="sub-category-info">
          <h3>{{ subCategory.title }}</h3>
          <p>{{ subCategory.description }}</p>
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
const subCategories = ref([])

// Fetch subcategories from Firestore
const fetchSubCategories = async () => {
  try {
    const snapshot = await getDocs(
      collection(
        db,
        'challenges',
        route.params.gamemode,
        'main_category',
        route.params.category,
        'sub_category',
      ),
    )
    console.log(snapshot.docs)
    subCategories.value = snapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  }
}

// Fetch data on component mount
onMounted(() => {
  fetchSubCategories()
})
</script>

<style scoped>
.sub-categories-container {
  padding: 20px;
}

.sub-categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.sub-category-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  aspect-ratio: 4 / 1; /* Set the aspect ratio */
}

.sub-category-image {
  width: 100%;
  height: 50%; /* Adjust height for aspect ratio */
  object-fit: cover;
}

.sub-category-info {
  padding: 10px;
  flex: 1;
}
</style>
