<template>
    <title>Login Page</title>
  <div>
    <main>
        <p> please login</p>
        <button @click="login">Login</button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Chat',
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