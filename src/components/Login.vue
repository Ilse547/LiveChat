    <template>
      <title>Login Page</title>
    <div>
      <main>
          
        <div v-if="!CodeSent" class="LoginInputArea">
          <p> please login</p>

          <input id="UsernameInput" class="TextInput" type="text" placeholder="Input your username">
          <input id="PasswordInput" class="TextInput" type="password" placeholder="Input your password">
          <button class="InputButton" @click="login">Login</button>

          <button class="InputButton" @click="RegisterPage" >RegisterPage</button>
        </div>

        <div v-if="CodeSent" class='RegisterInputArea'>
          <h2>Verification</h2>
          <p>Enter the code sent to your email</p>
          <input id="CodeInput" type="text" class="TextInput" placeholder="Enter the code">
          <button class="InputButton" @click='VerifyCode'> confirm </button>
        </div>


      </main>
    </div>
  </template>
    
  <script>
  export default {
    name: 'Login',
    data () {
      return {
        Username: '',
        Password: '',
        CodeSent: false
      }
    },
    mounted() {
      document.title = 'Login Page'
    },
    methods:{
      RegisterPage(){
        window.location.href="/register"
      },
      async login(){
        try {
          const Username = document.getElementById('UsernameInput').value;
          const Password = document.getElementById('PasswordInput').value;
          const response = await  fetch('/login',{
            method: 'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
              Username,
              Password
            })
          });

          if(response.ok) { 
            this.Username = Username;
            this.CodeSent = true;

          } else {
            const err = await response.json();
            alert(err.message || 'Login faiels')
          }

        }catch(err){
          console.log('Error during login', err);
          alert(err.message || 'Login Failed')
        }
      },

      async VerifyCode() {
        try {
          const Code = document.getElementById('CodeInput').value;

          const response = await fetch('/login/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ Username: this.Username, Code })
          });

          if(response.ok) {
            const data = await response.json();
            console.log('Login succeful, writing to db also ');
            localStorage.setItem('token', data.token);
            window.location.href = '/chat';
          } else {
            const err = await response.json();
            alert(err.message || 'Not the code');
          }
        } catch(err){
          console.error('error veryfinf the code', err);
          alert('Somethign went wrong :(');
        }
      }
    }
  }
  </script>