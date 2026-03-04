<template>
  <div>

    <nav class="Sidebar">
        <h1>Nav bar</h1>
    </nav>
    <main>
        <h1>Group Chat</h1>
        <div class="ChatDiv">
          <p>Messages</p>
        </div>
        <input aria-label="Message Input Box" class="MessageInput" type="text" placeholder="Write your message here">
        <button aria-label="Send Message Button" class="SendMessageButton">Send</button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Group',
    mounted() {
    document.title = 'Group Chat Page'
  },
}
</script>