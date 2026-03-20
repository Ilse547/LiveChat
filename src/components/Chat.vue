<template>
  <div class="ChatDiv">


    <nav class="Sidebar">
        <p> Logged in as:</p>
        <h3> {{ username }} </h3>
        <hr class="NavigationBarDivider" >
        <h1>Groups:</h1>
    </nav>


    <main class="ChatMain">
      <h1>General Chat</h1>
      <div class="MessageDiv">
        <p>Messages</p>
        <p>Message2</p>
        <p>Message3</p>
      </div>
      <div class="InputArea">
        <input type="text" class="TextInput" placeholder="Write your message here">
        <button class="InputButton">Send</button>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'Chat',
    data(){
      return { username : '' }
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
            const data = await response.json();
            this.username = data.user.username;
          }
        } catch(err) {
          console.error('token verification failed', err);
          window.location.href = '/login';
        }
    },
  }
</script>