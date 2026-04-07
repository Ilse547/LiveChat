<template>
  <div class="ChatDiv">


    <nav class="Sidebar">
        <p> Logged in as:</p>
        <button @click='GoToProfile' class="InputButton" style='cursor: pointer'> {{ username }} </button>
        <hr class="NavigationBarDivider" >
        <h1>Groups:</h1>
    </nav>


    <main class="ChatMain">
      <h1>General Chat</h1>

      <div class="MessageDiv">
        <p v-for="message in messages" :key="message.id">
          <strong>{{ message.username }}</strong>: {{ message.text }}
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
        gun : null
      }
    },
      async mounted() {
        document.title = 'General Chat'
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

            this.gun.get('chat').map().on((message) => {
              if(message && message.text) {
                const exists = this.messages.find(m => m.id === message.id);
                if(!exists){ this.messages.push(message); }
              }
            });

            const data = await response.json();
            this.username = data.user.username;
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
      }
    }
  }
</script>