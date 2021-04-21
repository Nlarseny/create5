<template>
<div class="admin">

  <div id="note">
    <h1>The Note adding part</h1>
      <div class="add">
      <div class="form">
      <h2>Who is this for?</h2>
      <div class="suggestions" v-if="suggestions_people.length > 0">
        <button v-for="sp in suggestions_people" :key="sp.id" @click="selectProject(sp)">{{sp.name}}
        </button>
      </div>
      <h2>Title</h2>
        <input v-model="title" placeholder="Title">
        <p></p>
        <h2>Content</h2>
        <form v-on:submit.prevent="upload">
            <textarea input v-model="content" placeholder="Content"></textarea>
            <br />
            <p>{{project}}</p>
        </form>


        <button @click="upload">Make Note</button>
      </div>
      <div class="upload" v-if="addItem">
        <h2>{{addItem.title}}</h2>
        <h2>{{addItem.content}}</h2>
      </div>

      </div>

      <div class="heading">
      </div>
      <h2>Edit/Delete</h2>
      <div class="edit">
        <div class="form">
          <input v-model="findTitle" placeholder="Searcher">
          <div class="suggestions" v-if="suggestions.length > 0">
            <div class="suggestion" v-for="s in suggestions" :key="s.id" @click="selectItem(s)">{{s.title}}
            </div>
          </div>
        </div>
        <div class="upload" v-if="findItem">
          <input v-model="findItem.title">
          <input v-model="findItem.content">
          <p></p>
        </div>
        <div class="actions" v-if="findItem">
          <button @click="deleteItem(findItem)">Delete</button>
          <button @click="editItem(findItem)">Edit</button>
        </div>
      </div>
    </div>

    <br>
    <br>
    <br>

    <div id="person">
      <h1>The person adding part</h1>
        <div class="add">
        <div class="form">
          <h2>Name</h2>
          <input v-model="name" placeholder="Name">
          <p></p>
          <h2>Info</h2>
          <form v-on:submit.prevent="upload">
              <textarea input v-model="info" placeholder="Info"></textarea>
              <br />
          </form>

          <button @click="make_person">Make Person</button>
        </div>
        </div>

        <div class="heading">
        </div>
        <h2>Edit/Delete</h2>
        <div class="edit">
          <div class="form">
            <input v-model="findName" placeholder="Searcher">
            <div class="suggestions" v-if="suggestions_people.length > 0">
              <div class="suggestion" v-for="sp in suggestions_people" :key="sp.id" @click="selectPerson(sp)">{{sp.name}}
              </div>
            </div>
          </div>
          <div class="upload" v-if="findPerson">
            <input v-model="findPerson.name">
            <input v-model="findPerson.info">
            <p></p>
          </div>
          <div class="actions" v-if="findPerson">
            <button @click="deletePerson(findPerson)">Delete</button>
            <button @click="editPerson(findPerson)">Edit</button>
          </div>
        </div>
      </div>


</div>

</template>


<script>
import axios from 'axios';
export default {
  name: 'Admin',
  data() {
    return {
      title: "",
      content: "",
      cur_month:"",
      cur_year:"",
      cur_day:"",
      cur_min:"",
      cur_hour:"",
      addItem: null,
      addPerson: null,
      items: [],
      people: [],
      name: "",
      info: "",
      findTitle: "",
      findItem: null,
      findPerson: null,
      findName: "",
      project: null,
      project_id: "12345",
    }
  },
  computed: {
    suggestions() {
      //this.getItems();
      let items = this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      this.getItems();
      return items.sort((a, b) => a.title > b.title);
    },
    suggestions_people() {
      let people = this.people.filter(person => person.name.toLowerCase().startsWith(this.findTitle.toLowerCase()));
      return people.sort((a, b) => a.name > b.name);
    }

  },
  created() {
    this.getItems();
    this.getPeople();
  },
  methods: {
  selectProject(project) {
    this.project = project;
    this.project_id = project._id;
    //console.log(this.project);
  },

  async editPerson(person) {
  try {
    await axios.put("/api/projects/" + person._id, {
      name: this.findPerson.name,
      info: this.findPerson.info,
    });
    this.findPerson = null;
    this.getPeople();
    return true;
  } catch (error) {
    //console.log(error);
  }
  },

  async deletePerson(person) {
    try {
      await axios.delete("/api/projects/" + person._id);
      this.findPerson = null;
      this.getPeople();
      return true;
    } catch (error) {
      //console.log(error);
    }
  },

  async make_person() {
    try {
      let r2 = await axios.post('/api/projects', {
        name: this.name,
        info: this.info,

      });
      this.addPerson = r2.data;
    } catch (error) {
      //console.log(error);
    }
  },
  async getPeople() {
  try {
  this.people = []; //added
    let response = await axios.get("/api/projects");
    this.people = response.data;
    return true;
  } catch (error) {
    //console.log(error);
  }
  },


  async getItems() {
  try {
  this.items = []; //added
    let response = await axios.get('/api/projects/' + this.project._id + '/items');
    //console.log(response.data);
    this.items = response.data;
    return true;
  } catch (error) {
    //console.log(error);
  }
  },

  fileChanged(event) {
    this.file = event.target.files[0]
  },

  async upload() {
    var currentdate = new Date();
    var cur_month = currentdate.getMonth();
    var cur_year = currentdate.getFullYear();
    var cur_day = currentdate.getDay();
    var cur_min = currentdate.getMinutes();
    var cur_hour = currentdate.getHours();
    //console.log(this.project._id);
    try {

      await axios.post('/api/projects/' + this.project._id + '/items', {
        title: this.title,
        content: this.content,
        month: cur_month + 1,
        day: cur_day,
        year: cur_year,
        min: cur_min,
        hour: cur_hour,

      });

    } catch (error) {
      //console.log(error);
    }
  },
  selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
  selectPerson(person) {
      this.findName = "";
      this.findPerson = person;
    },


  async deleteItem(item) {
    try {
      await axios.delete('/api/projects/' + this.project._id + '/items/' + item._id);
      this.findItem = null;
      this.getItems();
      //console.log(item);
      return true;
    } catch (error) {
      //console.log(error);
    }
  },

  async editItem(item) {
  //console.log(item);
  var currentdate = new Date();
    var cur_month = currentdate.getMonth();
    var cur_year = currentdate.getFullYear();
    var cur_day = currentdate.getDay();
    var cur_min = currentdate.getMinutes();
    var cur_hour = currentdate.getHours();
  try {
    await axios.put('/api/projects/' + this.project._id + '/items/' + item._id, {
      title: this.findItem.title,
      content: this.findItem.content,
      month: cur_month + 1,
      day: cur_day,
      year: cur_year,
      min: cur_min,
      hour: cur_hour,
    });
    this.findItem = null;
    this.getItems();
    return true;
  } catch (error) {
    //console.log(error);
  }
},
},

}
</script>

<style scoped>
.image h2 {
  font-style: italic;
  font-size: 1em;
}


.heading {
  display: flex;
  margin-bottom: 20px;
  margin-top: 20px;

}

.heading h2 {
  margin-top: 8px;
  margin-left: 10px;

}

.add,
.edit {
  display: flex;
}

.circle {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  padding: 8px;
  background: #333;
  color: #fff;
  text-align: center
}

/* Form */
input,
textarea,
select,
button {
  font-family: 'Montserrat', sans-serif;
  font-size: 1em;
}

.form {
  margin-right: 50px;
}

/* Uploaded images */
.upload h2 {
  margin: 0px;
}

.upload img {
  max-width: 300px;
}

/* Suggestions */
.suggestions {
  width: 200px;
  border: 1px solid #ccc;
}

.suggestion {
  min-height: 20px;
}

.suggestion:hover {
  background-color: #5BDEFF;
  color: #fff;
}

#admin {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  grid-template-areas: "none brand side";
  margin-bottom: 50px;
}

#person {
  grid-area: side;
  display: grid;
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
