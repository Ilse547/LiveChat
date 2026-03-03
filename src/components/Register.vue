<template>
  <div>
    <main>
        <p> please Register</p>
        <button @click="chat">Register</button>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Chat',
  mounted() {
    document.title = 'Registration'
  },
  methods:{
    chat(){
        window.location.href="/chat"
    }
  }
}
</script>