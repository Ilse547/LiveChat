<template>
  <div class="home-container">
    <h1>Welcome to Live Chat</h1>
    <div class="chat-preview">
      <p>Join conversations with people around the world!</p>
      <button @click="joinChat" class="join-btn">Join Chat</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    joinChat() {
      window.location.href = '/chat';
    }
  }
}
</script>
