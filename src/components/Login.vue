  <template>
      <title>Login Page</title>
    <div>
      <main>
          
          <div class="LoginInputArea">
            <p> please login</p>

            <input id="UsernameInput" class="TextInput" type="text" placeholder="Input your username">
            <input id="PasswordInput" class="TextInput" type="password" placeholder="Input your password">
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
            console.log('Login succeful, writing to db also ');
            window.location.href = '/home';
          }

        }catch(err){
          console.log('Error during login', err);
        }
      }
    }
  }
  </script>