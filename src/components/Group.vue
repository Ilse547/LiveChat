<template>
  <div class="ChatDiv">


    <nav class="Sidebar"aria-label="Navigation bar">
        <p> Logged in as:</p>
        <button @click='goToProfile' class="InputButton" style='cursor: pointer' aria-label="Profiles Button"> {{ username }} </button>
        <hr class="NavigationBarDivider">
        <button class="InputButton" @click="goToCreateGroup" aria-label="Create Group button"> Create Group</button>
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
      <h1>{{ groupName }}</h1>

      <ul class="MessageDiv">
        <p v-for="message in messages" :key="message.id">
          <strong>{{ message.username }}</strong>: {{ message.text }}
          <button v-if="message.username === username" @click="deleteMessage(message.id)" class="DeleteMessageButton" aria-label="Delete Message"> Del your message</button>
        </p>
      </ul>

      <div class="InputArea">
        <input v-model="NewMessage" @keyup.enter="sendMessage" type="text" class="TextInput" placeholder="Write your message here" aria-label="Message Text Input">
        <button @click="sendMessage" class="InputButton" aria-label="Send Message Button">Send</button>
      </div>
    </main>
  </div>
</template>

<script>
const { useChat } = require('../composable/useChat.js');

export default {
  name: 'GroupChat',
  data() {
    return { groupName: '' };
  },
  setup() {
    return useChat(null);
  },
  async mounted() {
    const parts = window.location.pathname.split('/');
    this.groupName = parts[parts.length - 1];
    document.title = this.groupName;

    const data = await this.VerifyAuth();
    if (!data) return;
    this.username = data.user.username;
    await this.fetchGroups();

    const isMember = await this.fetchGroupInfo();
    if (!isMember) return;

    this.initGun(__APP_URL__, `group-${this.groupName}`);
  },
  methods: {
    async fetchGroupInfo() {
      const token = localStorage.getItem('token');
      const response = await fetch(`/groupinfo/${this.groupName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        window.location.href = '/chat';
        return false;
      }
      return true;
    }
  }
}
</script>
