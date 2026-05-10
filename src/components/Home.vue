<template>
  <div class="Description">
    <h1> Welcome to the Live chat application </h1>

    <p>Join conversations by:</p>

    <button id="LoginPageRedirect" @click="LoginPage" class="InputButton" aria-label="Redirect to Login page">Loging in</button>
    <button id="RegisterPageRedirect" @click="RegisterPage" class="InputButton" aria-label="Redirect to registration page">Registering</button>

    <h1>About The application</h1>
      <p>
        This is an Open Source Live Chat webapp using:
        <a href="https://gun.eco">GunJS</a>,
        <a href="https://expressjs.com">ExpressJS</a>
        and <a href="https://vuejs.org/">VueJS</a>
      </p>

      <p>
        The source code for this project can be found on 
        <a href="https://github.com/Ilse547/LiveChat">github</a>
      </p>
      <h2>Some Credentials:</h2>
      <p>
        Username: <code>test</code> <br>
        Password: <code>testtest</code> <br>
      </p>
  </div>
</template>
<script>
export default {
  name: 'Home',
  methods: {
    LoginPage() {
      window.location.href = '/login'
    },
    RegisterPage() {
      window.location.href = '/register'
    }
  }
}
</script>