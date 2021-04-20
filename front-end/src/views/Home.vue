<template>
<div class="form">
  <div v-if="user">
  <h2>Who is this for?</h2>
  <div class="suggestions" v-if="suggestions_people.length > 0">
    <button v-for="sp in suggestions_people" :key="sp.id" @click="selectProject(sp)">{{sp.name}}
    </button>
  </div>

  <div class="products">
      <div class="product" v-for="item in suggestions" :key="item.id">
        <div class="info">
          <p>Title:</p>
          <br>
          <p>{{item.title}}</p>
          <hr>
          <p>Content:</p>
          <br>
          <p>{{item.content}}</p>
          <hr>
          <p>Date:</p>
          <br>
          <p>{{item.month}}/{{item.day}}/{{item.year}}</p>
          <hr>
          <p>Time:</p>
          <br>
          <p>{{item.hour}}:{{item.min}}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <Login/>
  </div>

</div>
</template>


<script>
import axios from 'axios';
import Login from '/components/Login.vue';
export default {
  name: 'Home',
  components: {
    Login
  },
  data() {
    return {
     items: [],
     people: [],
     project: null,
     title: "",
     content: "",
     cur_month:"",
     cur_year:"",
     cur_day:"",
     cur_min:"",
     cur_hour:"",
     addItem: null,
     addPerson: null,
     name: "",
     info: "",
     findTitle: "",
     findItem: null,
     findPerson: null,
     findName: "",
     project_id: "12345",
    }
  },

  computed: {
    user() {
      return this.$root.$data.user;
    },
    suggestions() {
      this.getItems();
      let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      this.getItems();
      return items.sort((a, b) => a.title > b.title);
    },
    suggestions_people() {
      let people = this.people.filter(person => person.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      this.getPeople();
      return people.sort((a, b) => a.name > b.name);
    }

  },

  async created() {
    try {
    this.items = []; //added
    this.people = []; //added
      let response = await axios.get('/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
    this.getItems();
    this.getPeople();
  },

  methods: {
    selectProject(project) {
      this.project = project;
      this.project_id = project._id;
      //console.log(this.project);
    },
    async getItems() {
    try {

      let response = await axios.get('/api/projects/' + this.project._id + '/items');
      //console.log(response.data);
      this.items = response.data;
      //console.log(this.items);
      return true;
    } catch (error) {
      console.log(error);
    }
    },
    async getPeople() {
    try {
      let response = await axios.get("/api/projects");
      this.people = response.data;
      return true;
    } catch (error) {
      console.log(error);
    }
    },
  }
}
</script>

<style scoped>
.image h2 {
  font-style: italic;
}

/* Masonry */
*,
*:before,
*:after {
  box-sizing: inherit;
}

.image-gallery {
  column-gap: 1.5em;
}

.image {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
}

.image img {
  width: 100%;
}

/* Masonry on large screens */
@media only screen and (min-width: 1024px) {
  .image-gallery {
    column-count: 4;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1023px) and (min-width: 768px) {
  .image-gallery {
    column-count: 3;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 767px) and (min-width: 540px) {
  .image-gallery {
    column-count: 2;
  }
}


.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
.products {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.product {
  margin: 10px;
  margin-top: 50px;
  width: 200px;
}
.product img {
  border: 2px solid #333;
  height: 250px;
  width: 200px;
  object-fit: cover;
}
.product .image {
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
}
.info {
  background: #ccfff5;
  color: #000;
  padding: 10px 30px;
}
.info h1 {
  font-size: 16px;
}
.info h2 {
  font-size: 14px;
}
.info p {
  margin: 0px;
  font-size: 15px;
}
.price {
  display: flex;
}
button {
  height: 50px;
  background: #000;
  color: white;
  border: none;
}
.auto {
  margin-left: auto;
}

.button {
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
}
</style>
