  <template>
    <div class="Description">
      <h1>Hello {{ username }}</h1>
      <p> Admin status: </p>
      <button class="InputButton" @click="Logout" style="background-color: red;"> Logout </button>
    </div>
  </template>

  <script>
  export default {
    name: 'Profile',
    data() {
      return {
        username: ''
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
