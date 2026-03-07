<template>
  <div>
    <main>
      <div class="Registration" >

        <p> please Register</p>
        <div class="RegisterInputArea">   
          <input class="TextInput" type="text" placeholder="Input your username">
          <input class="TextInput" type="password" placeholder="Input your password">

          <button class="InputButton"style="background-color: rgb(177, 255, 177);" @click="chat">Register</button>
          <button class="InputButton" id="LoginPageRedirect" style="background-color: rgb(255, 143, 143);"@click="LoginPage">Login Page</button>
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