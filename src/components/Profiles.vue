    <template>
      <div class="Description">
        <h1>Hello {{ username }}</h1>
        <p>Email: {{ email }}</p>
        <p> Admin status: {{ admin}} </p>

        <div v-if="!resetRequested && !resetDone">
          <button class="InputButton" @click="RequestReset"> reset password</button>
        </div>

        <div v-if="resetRequested" class="LoginInputArea">
          <input v-model="ResetCode" class="TextInput" type="text" placeholder="Enter code from email">
          <input v-model="NewPassword" class="TextInput" type="password" placeholder="Enter new password">
          <button class="InputButton" @click="ConfirmReset">Confirm reset</button>
        </div>
        
        <p v-if="resetDone"> Password was reset</p>

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
          resetRequested: false,
          resetDone: false,
          ResetCode: '',
          NewPassword: '',
        }
      },
      async mounted() {
        const urlParts = window.location.pathname.split('/');
        this.username = urlParts[urlParts.length - 1];
        document.title = `${this.username}'s Profile`;
        const token = localStorage.getItem('token');

        if(!token) { window.location.href = '/login'; return;}
        try{
          const response = await fetch('/verify', {
            headers:{
              Authorization: `Bearer ${token}`
            }
          });
          if(!response.ok) { window.location.href = '/login'; return; }
          const data = await response.json();
          this.email = data.user.email || '';
          this.admin = data.user.admin;
        } catch (err) {
          console.error('Error verifying token', err);
        }
      },
      methods: {
        Logout() {
          localStorage.removeItem('token');
          window.location.href="/home"
        },
        async RequestReset(){
          const response = await fetch('/reset-password', {
            method: 'POST',
            headers: { 'Content-Type':'application/json'},
            body: JSON.stringify({ Username: this.username })
          });
          if (response.ok) {
            this.resetRequested = true;
          } else {
            const err = await response.json();
            alert(err.message || 'Error sending the reset code');
          }
        },
        async ConfirmReset(){
          if(!this.ResetCode || !this.NewPassword) { alert(' Please fill out all fields '); return; }
          const token = localStorage.getItem('token');
          const response = await fetch('/reset-password/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Username: this.username, Code: this.ResetCode, NewPassword: this.NewPassword })
          });
          const data = await response.json();
          console.log('Reset response:', response.status, data); // ADD THIS

          if(response.ok) {
            this.resetDone = true;
            this.resetRequested = false;
          } else{
            alert(data.message || 'Error resetting password');
          }
        }
      }
    }
    </script>
