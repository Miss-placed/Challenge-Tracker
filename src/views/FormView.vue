<template>
  <div>
    <h2>Add Calling Card</h2>
    <form @submit.prevent="handleSubmit">
      <h3>Game Mode</h3>
      <select v-model="selectedGameMode" @change="handleGameModeChange">
        <option disabled value="">Select or create a Game Mode</option>
        <option
          v-for="mode in existingGameModes"
          :key="mode.name"
          :value="mode.name"
        >
          {{ mode.title }}
        </option>
        <option value="new">Add New Game Mode</option>
      </select>
      <div v-if="isNewGameMode">
        <input
          v-model="form.gameMode.name"
          placeholder="Game Mode Name"
          required
        />
        <input
          v-model="form.gameMode.title"
          placeholder="Game Mode Title"
          required
        />
        <input
          v-model="form.gameMode.description"
          placeholder="Game Mode Description"
          required
        />
        <input
          v-model="form.gameMode.imageUrl"
          placeholder="Game Mode Image URL"
          required
        />
      </div>

      <h3>Main Category</h3>
      <select v-model="selectedMainCategory" @change="handleMainCategoryChange">
        <option disabled value="">Select or create a Main Category</option>
        <option
          v-for="category in existingMainCategories"
          :key="category.name"
          :value="category.name"
        >
          {{ category.title }}
        </option>
        <option value="new">Add New Main Category</option>
      </select>
      <div v-if="isNewMainCategory">
        <input
          v-model="form.mainCategory.name"
          placeholder="Main Category Name"
          required
        />
        <input
          v-model="form.mainCategory.title"
          placeholder="Main Category Title"
          required
        />
        <input
          v-model="form.mainCategory.description"
          placeholder="Main Category Description"
          required
        />
        <input
          v-model="form.mainCategory.imageUrl"
          placeholder="Main Category Image URL"
          required
        />
      </div>

      <h3>Sub Category</h3>
      <select v-model="selectedSubCategory">
        <option disabled value="">Select or create a Sub Category</option>
        <option
          v-for="subCategory in existingSubCategories"
          :key="subCategory.name"
          :value="subCategory.name"
        >
          {{ subCategory.title }}
        </option>
        <option value="new">Add New Sub Category</option>
      </select>
      <div v-if="isNewSubCategory">
        <input
          v-model="form.subCategory.name"
          placeholder="Sub Category Name"
          required
        />
        <input
          v-model="form.subCategory.title"
          placeholder="Sub Category Title"
          required
        />
        <input
          v-model="form.subCategory.description"
          placeholder="Sub Category Description"
          required
        />
        <input
          v-model="form.subCategory.imageUrl"
          placeholder="Sub Category Image URL"
          required
        />
      </div>

      <h3>Challenge (optional)</h3>
      <input v-model="form.challenge.title" placeholder="Challenge Title" />
      <input
        v-model="form.challenge.description"
        placeholder="Challenge Description"
      />
      <input
        v-model="form.challenge.imageUrl"
        placeholder="Challenge Image URL"
      />
      <input v-model="form.challenge.steps" placeholder="Challenge Steps" />

      <button type="submit">Add Calling Card</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { db } from '/firebase/firebase_settings.js'
import { getDocs, collection, setDoc, doc } from 'firebase/firestore' // Importing necessary Firestore functions

// Reactive form data
const form = ref({
  gameMode: {
    name: '',
    title: '',
    description: '',
    imageUrl: '',
  },
  mainCategory: {
    name: '',
    title: '',
    description: '',
    imageUrl: '',
  },
  subCategory: {
    name: '',
    title: '',
    description: '',
    imageUrl: '',
  },
  challenge: {
    title: '',
    description: '',
    imageUrl: '',
    steps: '',
  },
})

// State for selected items
const selectedGameMode = ref('')
const selectedMainCategory = ref('')
const selectedSubCategory = ref('')

// States to control if new items are being created
const isNewGameMode = ref(false)
const isNewMainCategory = ref(false)
const isNewSubCategory = ref(false)

// Existing options (to be fetched from Firestore)
const existingGameModes = ref([])
const existingMainCategories = ref([])
const existingSubCategories = ref([])

// Fetch existing game modes, main categories, and subcategories
const fetchExistingData = async () => {
  try {
    const gameModesSnapshot = await getDocs(collection(db, 'challenges'))
    existingGameModes.value = gameModesSnapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching game modes:', error)
  }
}

// Fetch main categories based on selected game mode
const fetchCategories = async gameMode => {
  try {
    const mainCategorySnapshot = await getDocs(
      collection(db, 'challenges', gameMode, 'main_category'),
    )
    existingMainCategories.value = mainCategorySnapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))

    // Reset subcategories as the game mode changes
    existingSubCategories.value = []
    selectedSubCategory.value = ''
  } catch (error) {
    console.error('Error fetching main categories:', error)
  }
}

// Fetch data on component mount
fetchExistingData()

// Watchers to determine if new items should be created
watch(selectedGameMode, newValue => {
  isNewGameMode.value = newValue === 'new'
  if (newValue && newValue !== 'new') {
    fetchCategories(newValue)
    selectedMainCategory.value = ''
    selectedSubCategory.value = ''
  }
})

watch(selectedMainCategory, newValue => {
  isNewMainCategory.value = newValue === 'new'
  if (newValue && newValue !== 'new') {
    fetchSubCategories(selectedGameMode.value, newValue)
  } else {
    existingSubCategories.value = [] // Reset if a new main category is selected
    selectedSubCategory.value = ''
  }
})

watch(selectedSubCategory, newValue => {
  isNewSubCategory.value = newValue === 'new'
})

// Fetch subcategories based on selected game mode and main category
const fetchSubCategories = async (gameMode, mainCategory) => {
  try {
    const subCategorySnapshot = await getDocs(
      collection(
        db,
        'challenges',
        gameMode,
        'main_category',
        mainCategory,
        'sub_category',
      ),
    )
    existingSubCategories.value = subCategorySnapshot.docs.map(doc => ({
      name: doc.id,
      ...doc.data(),
    }))
  } catch (error) {
    console.error('Error fetching subcategories:', error)
  }
}

// Handle form submission
const handleSubmit = async () => {
  try {
    // Only process if a new game mode, main category, or subcategory is being created
    if (isNewGameMode.value) {
      await setDoc(doc(db, 'challenges', form.value.gameMode.name), {
        title: form.value.gameMode.title,
        description: form.value.gameMode.description,
        imageUrl: form.value.gameMode.imageUrl,
      })
      alert('Game mode added successfully!')

      // Update existing game modes list
      await fetchExistingData() // Fetch the updated list

      // Reset form fields if needed
      form.value.gameMode = {
        name: '',
        title: '',
        description: '',
        imageUrl: '',
      }
      selectedGameMode.value = '' // Reset selected game mode
    }

    if (isNewMainCategory.value) {
      const gameModeName = selectedGameMode.value // Use selected game mode
      await setDoc(
        doc(
          db,
          'challenges',
          gameModeName,
          'main_category',
          form.value.mainCategory.name,
        ),
        {
          title: form.value.mainCategory.title,
          description: form.value.mainCategory.description,
          imageUrl: form.value.mainCategory.imageUrl,
        },
      )
      alert('Main category added successfully!')

      // Update existing main categories list
      await fetchCategories(gameModeName) // Fetch the updated categories

      // Reset form fields if needed
      form.value.mainCategory = {
        name: '',
        title: '',
        description: '',
        imageUrl: '',
      }
      selectedMainCategory.value = '' // Reset selected main category
    }

    if (isNewSubCategory.value) {
      const gameModeName = selectedGameMode.value // Use selected game mode
      const mainCategoryName = selectedMainCategory.value // Use selected main category
      await setDoc(
        doc(
          db,
          'challenges',
          gameModeName,
          'main_category',
          mainCategoryName,
          'sub_category',
          form.value.subCategory.name,
        ),
        {
          title: form.value.subCategory.title,
          description: form.value.subCategory.description,
          imageUrl: form.value.subCategory.imageUrl,
        },
      )
      alert('Subcategory added successfully!')

      // Update existing subcategories list
      await fetchSubCategories(gameModeName, mainCategoryName) // Fetch updated subcategories
      // Reset form fields if needed
      form.value.subCategory = {
        name: '',
        title: '',
        description: '',
        imageUrl: '',
      }
      selectedSubCategory.value = '' // Reset selected subcategory
    }

    // Optionally, you can create a challenge if needed, but it's not required based on your specifications
    if (form.value.challenge.title !== '') {
      const gameModeName = selectedGameMode.value // Use selected game mode
      const mainCategoryName = selectedMainCategory.value // Use selected main category
      const subCategoryName = selectedSubCategory.value // Use selected subcategory
      await setDoc(
        doc(
          db,
          gameModeName,
          'main_category',
          mainCategoryName,
          'sub_category',
          subCategoryName,
          'challenges',
          form.value.challenge.title,
        ),
        {
          title: form.value.challenge.title,
          description: form.value.challenge.description,
          imageUrl: form.value.challenge.imageUrl,
          steps: form.value.challenge.steps,
        },
      )
      alert('Challenge added successfully!')
    }
  } catch (error) {
    console.error('Error adding calling card:', error)
    alert('Error adding calling card. Please try again.')
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
input,
select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
