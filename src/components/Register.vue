<template>
  <div>
    <main>
      <div class="Registration" >

        
        <div v-if="!registered" class="RegisterInputArea">   
          <p> please Register</p>

          <input id="UsernameInput" class="TextInput" type="text" placeholder="Input your username" aria-label="Username Input">
          <input id="EmailInput" class="TextInput" type="text" placeholder="Input your email" aria-label="Email Input">
          <input id="PasswordInput" class="TextInput" type="password" placeholder="Input your password" aria-label="Password Input">


          <button class="InputButton" @click="Register" aria-label="Register Button">Register</button>
          <button class="InputButton" id="LoginPageRedirect" @click="LoginPage" aria-label="Login Redirect Button">Login Page</button>
        </div>

        <div v-if="registered" class='RegisterInputArea'>
          <h2> Confirm your account</h2>
          <p>Enter the password In the email</p>
          <input id="CodeInput" type="text" class="TextInput" placeholder="Enter the code" aria-label="One Time Password Input">
          <button class="InputButton" @click='Confirm' aria-label="One Time Password Confirmation button"> confirm </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return{
      registered: false,
      username: ''
    }
  },
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
        const Email = document.getElementById('EmailInput').value;


        const response = await fetch('/register',{
          method : 'POST',
          headers:{'Content-Type' : 'application/json'},
          body : JSON.stringify({
            Username,
            Email,
            Password
          })
        });
        if(response.ok) {
          console.log('REGISTRATION SUCCESSFUL, WROTE TO DB');
          this.Username = Username;
          this.registered  = true;
        } else {
          const err = await response.json();
          alert(err.message || 'Registration Failed');

        }

      }catch (err){
        console.error('error during registration', err);
      }
    },
    async Confirm() {
      try {
        const Code = document.getElementById('CodeInput').value;
        const response = await fetch('/confirm', {
          method: 'POST',
          headers: { 'Content-Type' : 'application/json' },
          body: JSON.stringify({ Username: this.Username, Code })
        });
        if(response.ok) {
          alert('Account is now verified, you can log in');
          window.location.href = '/login';
        } else {
          const err = await response.json();
          alert(err.message || 'Invalid code');
        }
      } catch(err) {
        console.error('Error confirming the account', err);
        alert('Something went wrong');
      }
    }
  }
}
</script>