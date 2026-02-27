<template>
  <div class="HomeConatiner">
    <h1>Live chat</h1>
  <div class="ChatPrieview">
    <p>Join conversations</p>
    <button @click="JoinChat" class="JoinButton">Join Chats</button>
  </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  methods: {
    JoinChat() {
      window.location.href = '/chat'
    }
  }
}
</script>