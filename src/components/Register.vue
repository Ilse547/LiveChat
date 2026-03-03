<template>
  <div>
    <main>
      <div class="Registration" >

        <p> please Register</p>
        <input type="text" placeholder="Input your username">
        <input type="password" placeholder="Input your password">
        <button @click="chat">Register</button>
        <button @click="LoginPage">Login Page</button>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Register',
  mounted() {
    document.title = 'Registration'
  },
  methods:{
    chat(){
        window.location.href="/chat"
    },
    LoginPage(){
      window.location.href="/login"
    }
  }
}
</script>