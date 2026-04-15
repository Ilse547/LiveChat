<template>
  <div class="ChatDiv">


    <nav class="Sidebar">
        <p> Logged in as:</p>
        <button @click='GoToProfile' class="InputButton" style='cursor: pointer'> {{ username }} </button>
        <hr class="NavigationBarDivider">
        <button class="InputButton" @click="CreateGroup" > Create Group</button>
        <h1>Groups:</h1>

        <div v-if="groups.length === 0">
          <p> No groups </p>
        </div>

        <div v-for="group in groups" :key="group._id">
          <button class="InputButton" @click="GoToGroup(group.GroupName)">
            {{ group.GroupName }}
          </button>
        </div>
    </nav>


    <main class="ChatMain">
      <h1>{{ groupName }}</h1>

      <div class="MessageDiv">
        <p v-for="message in messages" :key="message.id">
          <strong>{{ message.username }}</strong>: {{ message.text }}
          <button v-if="message.username === username" @click="DeleteMessage(message.id)" class="DeleteMessageButton"> Del your message</button>
        </p>
      </div>

      <div class="InputArea">
        <input v-model="NewMessage" @keyup.enter="SendMessage" type="text" class="TextInput" placeholder="Write your message here">
        <button @click="SendMessage" class="InputButton">Send</button>
      </div>
    </main>
  </div>
</template>

<script>
  import Gun from 'gun';
  export default {
    name: 'Chat',
    data(){
      return {
        username : '',
        NewMessage : '',
        messages : [],
        gun : null,
        groups: []
      }
    },
      async mounted() {
        const parts = window.location.pathname.split('/');
        this.groupName =parts[parts.length - 1];
        document.title = this.groupName;

        const token = localStorage.getItem('token');
        if(!token) {
          window.location.href = '/login'
        }
        
        try {
          const response = await fetch('/verify', {
            method : 'GET',
            headers : {
              'Authorization' : `Bearer ${token}`
            }
          });
          if(!response.ok) {
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else {
            this.gun = Gun({
              peers : [
                'https://livechat-qx1k.onrender.com/gun',
              ]
            })

            this.gun.get(`group-${this.groupName}`).map().on((message) => {
              if(message && message.text) {
                const exists = this.messages.find(m => m.id === message.id);
                if(!exists){ 
                this.messages.push(message);
                this.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                }
              }
            });

            const data = await response.json();
            this.username = data.user.username;
            await this.FetchGroups();
          }
        } catch(err) {
          console.error('token verification failed', err);
          window.location.href = '/login';
        }
    },
    methods: {
      GoToProfile() {
      window.location.href = `/user/${this.username}`;
      },
      SendMessage() {
        if(!this.NewMessage.trim()) return;
        const message = {
          id : Date.now().toString(),
          username : this.username,
          text : this.NewMessage,
          timestamp : new Date().toISOString()
        };
        this.gun.get('chat').get(message.id).put(message);
        this.NewMessage = '';
      },
      DeleteMessage(id) {
      this.gun.get('chat').get(id).put(null);
      this.messages = this.messages.filter(m => m.id !== id);
      },
      CreateGroup (){
        window.location.href = '/creategroup';
      },
      async FetchGroups() {
        const token = localStorage.getItem('token');
        try{
          const response = await fetch('/groups', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          if(response.ok) {
            this.groups = data.groups;
          }
        } catch(err) {
          console.error('Provlem getting groups', err);
        }
      }, GoToGroup(groupName) {
        window.location.href = `/group/${groupName}`;
      },
    }
  }
</script>