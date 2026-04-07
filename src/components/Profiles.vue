  <template>
    <div class="ProfileDiv">
      <h1>Hello</h1>
      <p>{{ username }}'s Profile</p>
      <button @click="Logout" style="color: red;"> Logout </button>
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
