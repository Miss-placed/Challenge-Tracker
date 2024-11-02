<template>
  <div class="calling-card">
    <img :src="image" alt="Challenge Image" class="calling-card__image" />
    <div v-if="!isCompleted" class="calling-card__overlay"></div>
    <div class="calling-card__content">
      <div class="calling-card__title-wrapper">
        <svg
          v-if="!isCompleted"
          class="calling-card__lock-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 1C9.23858 1 7 3.23858 7 6V10H6C4.89543 10 4 10.8954 4 12V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V12C20 10.8954 19.1046 10 18 10H17V6C17 3.23858 14.7614 1 12 1ZM9 10V6C9 4.34315 10.3431 3 12 3C13.6569 3 15 4.34315 15 6V10H9ZM12 16C11.4477 16 11 15.5523 11 15V14C11 13.4477 11.4477 13 12 13C12.5523 13 13 13.4477 13 14V15C13 15.5523 12.5523 16 12 16Z"
            fill="currentColor"
          />
        </svg>
        <h2 :class="{ completed: isCompleted }" class="calling-card__title">
          {{ name }}
        </h2>
      </div>
      <p v-if="!isCompleted" class="calling-card__description">
        {{ description }}
      </p>
      <div v-if="!isCompleted" class="calling-card__progress-wrapper">
        <p class="calling-card__status">{{ statusText }}</p>
        <div class="calling-card__progress">
          <div
            class="calling-card__progress-bar"
            :style="{ width: progress + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { defineProps } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
})

const isCompleted = computed(() => props.status === 'completed')
const statusText = computed(() => {
  return isCompleted.value ? 'Completed' : `${props.progress}% Complete`
})
</script>

<style scoped>
.calling-card {
  display: flex;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  background-color: #1c1c1c;
  color: #ffffff;
  width: 800px;
  aspect-ratio: 4/1;
  position: relative;
}

.calling-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  inset: 0;
  z-index: 0;
}

.calling-card__overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.calling-card__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  flex: 1;
  z-index: 5;
}

.calling-card__title-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: max-content;
  padding: 1ch 1.5ch;
  &:has(.completed) {
    margin-left: -16px;
    background-color: #1c1c1c;
  }
}

.calling-card__lock-icon {
  color: #ff9800;
}

.calling-card__title {
  font-size: 18px;
  margin: 0;
}

.calling-card__description {
  font-size: 14px;
  margin: 0 0 16px;
  color: #aaa;
}

.calling-card__progress-wrapper {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 3ch;
}

.calling-card__progress {
  background-color: #444;
  border-radius: 4px;
  overflow: hidden;
  height: 8px;
  width: 100%;
}

.calling-card__progress-bar {
  background-color: #ff9800;
  height: 100%;
  transition: width 0.3s ease;
}

.calling-card__status {
  flex-shrink: 0;
  font-weight: bold;
}
</style>
