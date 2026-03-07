<template>
    <title>Login Page</title>
  <div>
    <main>
        
        <div class="LoginInputArea">
          <p> please login</p>

          <input class="TextInput" type="text" placeholder="Input your username">
          <input class="TextInput" type="password" placeholder="Input your password">
          <button class="InputButton" @click="login"style="background-color: rgb(177, 255, 177);">Login</button>

          <button class="InputButton" @click="RegisterPage" style="background-color: rgb(255, 143, 143);">RegisterPage</button>
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