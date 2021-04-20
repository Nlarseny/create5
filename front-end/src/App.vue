<template>
<div id="app">
  <div class="header">

    <div id="brand">
      <router-link to="/">
          <img src="/smallnote.png" height="150">
      </router-link>
    </div>

    <div id="brand">
      <h1 style = "text-align:center">The Note Taking Place</h1>
    </div>

    <div id="side">
    <router-link to="/">
      <div class="menu-item browse">
        <img src="/login.jpg" height="120">
        <p>Login</p>
      </div>
    </router-link>
      <router-link to="/admin">
        <div class="menu-item browse">
          <img src="/notepad_plain_paper.png" height="120">
          <p>Editor</p>
        </div>
      </router-link>

      <router-link to="/">
        <div @click="logout">
          <img src="/logout.gif" height="120">
        </div>
      </router-link>


    </div>

  </div>
  <div class="content">
    <router-view />
  </div>
  <div class="footer">
    <router-link to="/admin">Admin</router-link>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'MyPhotos',
  data() {
    return {}
  },
  computed: {
    user() {
      return this.$root.$data.user;
    },
  },
  methods: {
    async logout() {
      try {
        await axios.delete("/api/users");
        this.$root.$data.user = null;
        //this.$root.$data = null; // added
      } catch (error) {
        this.$root.$data.user = null;
        //this.$root.$data = null; //added
      }
    },
  }
}
</script>

<style>
html {
  box-sizing: border-box;
}
body {
  font-family: 'Montserrat', sans-serif;
  font-size: 16px;
  background: #fff;
  padding: 0px;
  margin: 50px 100px;
}

/* Header */
.header {
  display: grid;
  padding: 10px 100px 0px 100px;
  background-color: #bad4f7;
  color: #1C454F;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  grid-template-areas: "none brand side";
  margin-bottom: 50px;
}
.title {
  margin-top: 5px;
}
.title h1 {
  font-size: 30px;
}
.content {
  padding: 20px 100px;
  min-height: 500px;
}
/* Footer */
.footer {
  height: 50px;
  padding: 20px 100px 0px 100px;
  background: #e3e3e3;
  font-size: 12px;
}
.footer a {
  color: #000;
}
h1 {
  font-size: 20px;
}
h2 {
  font-size: 14px;
}

#menu {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  grid-template-areas: "none brand side";
  margin-bottom: 50px;
}
#menu a {
  color: #B84901;
}

#side {
  grid-area: side;
  display: flex;
  justify-content: flex-end;
}
#side img {
  width: 100px;
}
.menu-item {
  display: flex;
  flex-direction: column;
}
.menu-item p {
  margin: 0px;
}
.browse {
  margin-right: 50px;
}
</style>
