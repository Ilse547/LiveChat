<template>
  <div>
    <main>
      <div class="Registration" >

        <p> please Register</p>
        <div class="RegisterInputArea">   
          <input class="TextInput" type="text" placeholder="Input your username">
          <input class="TextInput" type="password" placeholder="Input your password">
          <button class="InputButton" @click="chat">Register</button>
          <button class="InputButton" @click="LoginPage">Login Page</button>
        </div>
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