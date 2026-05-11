<template>
  <div class="ChatDiv">


    <nav class="Sidebar" aria-label="Sidebar">
        <p> Logged in as:</p>
        <button @click='goToProfile' class="InputButton" style='cursor: pointer' aria-label="Profiles button"> {{ username }} </button>
        <hr class="NavigationBarDivider">
        <button class="InputButton" @click="goToCreateGroup" aria-label="Create Group Button"> Create Group</button>
        <h1>Groups:</h1>

        <div v-if="groups.length === 0">
          <p> No groups </p>
        </div>

        <div v-for="group in groups" :key="group._id">
          <button class="InputButton" @click="goToGroup(group.GroupName)">
            {{ group.GroupName }}
          </button>
        </div>
    </nav>


    <main class="ChatMain">
      <h1>General Chat</h1>

      <ul class="MessageDiv">
        <p v-for="message in messages" :key="message.id">
          <strong>{{ message.username }}</strong>: {{ message.text }}
          <button v-if="message.username === username" @click="deleteMessage(message.id)" class="DeleteMessageButton" aria-label="Delete Message Button"> Delete</button>
        </p>
      </ul>

      <div class="InputArea">
        <input v-model="NewMessage" @keyup.enter="sendMessage" type="text" class="TextInput" placeholder="Write your message here" aria-label="Message Text Input">
        <button @click="sendMessage" class="InputButton" aria-label="Send message Button">Send</button>
      </div>
    </main>
  </div>
</template>

<script>
const { useChat } = require('../composable/useChat.js');

export default {
  name: 'Chat',
  setup() {
    return useChat('chat');
  },
  async mounted() {
    document.title = 'General Chat';
    const data = await this.VerifyAuth();
    if (!data) return;
    this.username = data.user.username;
    this.initGun(__APP_URL__);
    await this.fetchGroups();
  }
}
</script>