<template>
  <div class="ChatDiv">
    <nav class="Sidebar">
        <h1>Nav bar</h1>
    </nav>
    <main class="ChatMain">
      <h1>General Chat</h1>
      <div class="MessageDiv">
        <p>Messages</p>
        <p>Message2</p>
        <p>Message3</p>
      </div>
      <div class="InputArea">
        <input type="text" placeholder="Write your message here">
        <button class="SendButton">Send</button>
      </div>
    </main>
  </div>
</template>
<script>
  export default {
    name: 'Chat',
      mounted() {
      document.title = 'General Chat'
    },
  }
</script>