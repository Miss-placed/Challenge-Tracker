<script setup>
import ChallengeCard from '@/components/Part/ChallengeCard.vue'
</script>

<template>
  <main>
    <h1>Hello World</h1>
    <ChallengeCard
      name="On Point"
      image="https://img.game8.co/4027279/c124b33d38480688e59a8e828096dcfc.png/original"
      description="Kill an enemy who shot you first while or shortly after diving."
    />
    <ChallengeCard
      name="Squint Test"
      image="https://img.game8.co/4027281/ff5cb60c6a4bec0c46155e09a6e4788a.png/original"
      description="Earn a Moonshot Medal (Killed an enemy that is 250m or more away)."
      status="completed"
      progress="100"
    />
  </main>
</template>
