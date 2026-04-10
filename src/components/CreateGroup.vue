<template>
  <div>
    <main>

        
      <div class="CreateGroup">   
        <p> Group name :</p>
        <input id="GroupNameInput" class="TextInput" type="text" placeholder="Input the groupname">
        <p> Participants :</p>
        <input id="ParticipantInput" class="TextInput" type="text" placeholder="Input the Username">
        <input id="ParticipantInput" class="TextInput" type="text" placeholder="Input the Username">
        <input id="ParticipantInput" class="TextInput" type="text" placeholder="Input the Username">
        <input id="ParticipantInput" class="TextInput" type="text" placeholder="Input the Username">

        <button class="InputButton" @click="CreateGroup">Create Group</button>
      </div>

    </main>
  </div>
</template>
    
  <script>
  export default {
    name: 'CreateGroup',
    mounted() {
      document.title = 'Create Group'
    }
  }
  </script>