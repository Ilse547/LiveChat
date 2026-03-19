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
        <input type="text" class="TextInput" placeholder="Write your message here">
        <button class="InputButton">Send</button>
      </div>
    </main>
  </div>
</template>
<script>
  export default {
    name: 'Chat',
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
            window.location.href = ('/login');
          }
        } catch(err) {
          console.error('token verification failed', err);
          window.location.href = '/login';
        }
    },
  }
</script>