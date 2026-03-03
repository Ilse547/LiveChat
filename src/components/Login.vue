<template>
    <title>Login Page</title>
  <div>
    <main>
        <p> please login</p>
        <input type="text" placeholder="Input your username">
        <input type="password" placeholder="Input your password">
        <button @click="login">Login</button>

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
    login(){
        window.location.href="/chat"
    }
  }
}
</script>