<template>
  <div>
    <main>

        
      <div class="CreateGroup">   
        <p> Group name :</p>
        <input id="GroupNameInput" class="TextInput" type="text" placeholder="Input the groupname">
        <p> Participants :</p>

        <div v-for="(participant, index) in participants" :key="index" style="display: flex; gap: 8px; width:100%;">
          <input v-model="participants[index]" class="TextInput" type="text" placeholder="Write username of Participant">
          <button class="InputButton" @click="CheckParticipant(index)">x</button>
        </div>

        <button class="InputButton" @click="CreateGroup">Create Group</button>
      </div>

    </main>
  </div>
</template>
    
<script>
export default {
  name: 'CreateGroup',
  data() {
    return {
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

          this.verified.push(index);
          this.participants.splice(index, 1);
        } else {
          alert(`Ùser doesnt exist`);
        }
      } catch (err){
        console.error('Error while check user', err);
        alert('There was an error while checking if the user exists');
      }
    }
  }
};
</script>