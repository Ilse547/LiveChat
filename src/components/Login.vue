    <template>
      <title>Login Page</title>
    <div>
      <main>
          
          <div class="LoginInputArea">
            <p> please login</p>

            <input id="UsernameInput" class="TextInput" type="text" placeholder="Input your username">
            <input id="EmailInput" class="TextInput" type="text" placeholder="Input your email">
            <input id="PasswordInput" class="TextInput" type="password" placeholder="Input your password">
            <button class="InputButton" @click="login">Login</button>

            <button class="InputButton" @click="RegisterPage" >RegisterPage</button>
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
        Email: '',
        Password: ''
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
          const Email = document.getElementById('EmailInput').value;
          const response = await  fetch('/login',{
            method: 'POST',

            headers:{'Content-Type':'application/json'},

            body: JSON.stringify({
              Username,
              Email,
              Password
            })
          });

          if(response.ok) { 
            const data = await response.json();
            console.log('Login succeful, writing to db also ');
            localStorage.setItem('token', data.token);

            window.location.href = '/chat';
          } else {
            const err = await response.json();
            alert(err.message || 'Login faiels')
          }

        }catch(err){
          console.log('Error during login', err);
          alert(err.message || 'Login Failed')
        }
      }
    }
  }
  </script>