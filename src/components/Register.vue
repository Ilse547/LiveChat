<template>
  <div>
    <main>
      <div class="Registration" >

        
        <div class="RegisterInputArea">   
          <p> please Register</p>

          <input id="UsernameInput" class="TextInput" type="text" placeholder="Input your username">
          <input id="PasswordInput" class="TextInput" type="password" placeholder="Input your password">

          <button class="InputButton"style="background-color: rgb(177, 255, 177);" @click="Register">Register</button>
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
    },
    async Register(){
      try {
        const Username = document.getElementById('UsernameInput').value;
        const Password = document.getElementById('PasswordInput').value;


        const response = await fetch('/register',{
          method : 'POST',
          headers:{'Content-Type' : 'application/json'},
          body : JSON.stringify({
            Username,
            Password
          })
        });
        if(response.ok) {
          console.log('REGISTRATION SUCCESSFUL, WROTE TO DB');
          window.location.href = '/chat'
        }
      }catch (err){
        console.error('error during registration', err);
      }
    }

  }
}
</script>