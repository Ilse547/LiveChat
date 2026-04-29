    <template>
      <div class="Description">
        <h1>Hello {{ username }}</h1>
        <p>Email: {{ email }}</p>
        <p> Admin status: {{ admin}} </p>
        <button class="InputButton" @click="ResetPassword" style="background-color: #ff6b6b;"> Reset password </button>
        <button class="InputButton" @click="Logout" style="background-color: #ff6b6b;"> Logout </button>
      </div>
    </template>

    <script>
    export default {
      name: 'Profile',
      data() {
        return {
          username: '',
          email: '',
          admin: false,
        }
      },
      mounted() {
        const urlParts = window.location.pathname.split('/');
        this.username = urlParts[urlParts.length - 1];
        document.title = `${this.username}'s Profile`;
      },
      methods: {
        Logout() {
          localStorage.removeItem('token');
          window.location.href="/home"
        }
      }
    }
    </script>
