<template>
  <div>
    <main>

        
      <div class="CreateGroup">   
        <p> Group name :</p>
        <input v-model="GroupName" id="GroupNameInput" class="TextInput" type="text" placeholder="Input the groupname" aria-label="Group Name Input">
        <p> Participants :</p>

        <div v-for="(participant, index) in participants" :key="index" style="display: flex; gap: 8px; width:100%;">
          <input v-model="participants[index]" class="TextInput" type="text" placeholder="Write username of Participant" aria-label="Input participant">
          <button class="InputButton" @click="CheckParticipant(index)"aria-label="Check Participant">x</button>
        </div>

        <button class="InputButton" @click="CreateGroup" aria-label="Create Group Button">Create Group</button>
      </div>

    </main>
  </div>
</template>
    
<script>
export default {
  name: 'CreateGroup',
  data() {
    return {
      GroupName: '',
      participants: ['', '', '', ''],
      verified: []
    };
  },
  mounted() {
    document.title = 'Create Group';
  },
  methods: {
    async CheckParticipant(index) {
      const username = this.participants[index].trim();
      if(!username) return;
      try {
        const response = await fetch(`/user/exists/${username}`);
        const data = await response.json();
        if(data.exists) {

          this.verified.push(username);
          this.participants.splice(index, 1);
        } else {
          alert(`the user does not exist`);
        }
      } catch (err){
        console.error('Error while check user', err);
        alert('There was an error while checking if the user exists');
      }
    },
    async CreateGroup() {
      if(!this.GroupName.trim()){
        alert('Please write a groupname');
        return;
      }
      if(this.verified.length === 0){
        alert('Please add at least one participants');
        return;
      }

      
      const token = localStorage.getItem('token');
      if(!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const response = await fetch('/creategroup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            GroupName: this.GroupName.trim(),
            Participants: this.verified
          })
        });
        const data = await response.json();
        if(response.ok) {
          alert('Group was created');
          window.location.href = '/chat';
        }else { alert(data.message); }
      } catch (err) {
        console.error('Error creating group', err);
        alert('There was an error creating grooup');
      }
    },
  }
};
</script>