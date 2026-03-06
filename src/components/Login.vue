<template>
    <title>Login Page</title>
  <div>
    <main>
        <p> please login</p>
        <div class ="InputArea">
          <input class="TextInput" type="text" placeholder="Input your username">
          <input class="TextInput" type="password" placeholder="Input your password">
          <button class="InputButton" @click="login">Login</button>

          <button class="InputButton" @click="RegisterPage">RegisterPage</button>
        </div>


    </main>
  </div>
</template>

<script>
export default {
  name: 'Login',
  mounted() {
    document.title = 'Login Page'
  },
  methods:{
    RegisterPage(){
      window.location.href="/register"
    },
    login(){
        window.location.href="/chat"
    }
  }
}
</script>