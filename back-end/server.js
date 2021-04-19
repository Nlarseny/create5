const express = require('express');
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/notes', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    'secretValue'
  ],
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Create a scheme for projects
const projectSchema = new mongoose.Schema({
  name: String,
  info: String
});

// Create a model for projects
const Project = mongoose.model('Project', projectSchema);


// Create a scheme for items in the museum: a title and a path to an image.
const itemSchema = new mongoose.Schema({
	project: {
	type: mongoose.Schema.ObjectId,
        ref: 'Project'
	},
  title: String,
  content: String,
  month: String,
  year: String,
  day: String,
  min: String,
  hour: String,
});


const Item = mongoose.model('Item', itemSchema);


// Create a project
app.post('/api/projects', async (req, res) => {
  const project = new Project({
    name: req.body.name,
    info: req.body.info
  });
	console.log(req.body.name);
  try {
    await project.save();
    res.send(project);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all projects
app.get('/api/projects', async (req, res) => {
  try {
    let projects = await Project.find();
    res.send(projects);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//add updating and deleting later
// Delete route
app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.deleteOne({
      _id: req.params.id
    });
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// edit route
app.put('/api/projects/:id', async (req, res) => {
  try {
    let project = await Project.findOne({
      _id: req.params.id
    });

    //console.log(item);
    res.sendStatus(200);
    console.log(req.body.name);

    project.name = req.body.name;
    project.info = req.body.info;

    project.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});



/////////////////////////////////////////////////////////////////////////

// create a new item containing the note info
app.post('/api/projects/:projectID/items', async (req, res) => {

  try {
	  console.log(req.params);
	let project = await Project.findOne({_id: req.params.projectID});
        if (!project) {
            res.send(404);
            return;
        }
	let item = new Item({
        project: project,

        title: req.body.title,
        content: req.body.content,
        month: req.body.month,
        year: req.body.year,
        day: req.body.day,
        min: req.body.min,
        hour: req.body.hour,
  	});

    await item.save();
    res.send(item);
  } catch (error) {
    //console.log(error);
    res.sendStatus(500);
  }
});

// Get a list of all of the items in the museum.
app.get('/api/projects/:projectID/items', async (req, res) => {
  try {
	let project = await Project.findOne({_id: req.params.projectID});
	if (!project) {
            res.send(404);
            return;
        }

    let items = await Item.find({project:project});
    res.send(items);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Delete route
app.delete('/api/projects/:projectID/items/:itemID', async (req, res) => {
  try {
	let item = await Item.findOne({_id:req.params.itemID, project: req.params.projectID});
        if (!item) {
            res.send(404);
            return;
        }
    await item.delete();
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// edit route
app.put('/api/projects/:projectID/items/:itemID', async (req, res) => {
  try {
	let item = await Item.findOne({_id:req.params.itemID, project: req.params.projectID});
        if (!item) {
            res.send(404);
            return;
        }

    console.log(item);
    res.sendStatus(200);
	  item.title = req.body.title;
	  item.content = req.body.content;
	   item.month = req.body.month;
	  item.year = req.body.year;
	  item.day = req.body.day;
	  item.min = req.body.min;
	  item.hour = req.body.hour;

    await item.save();
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// import the users module and setup its API path
const users = require("./users.js");
app.use("/api/users", users.routes);

app.listen(3003, () => console.log('Server listening on port 3003!'));
