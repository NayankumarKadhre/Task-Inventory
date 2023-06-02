//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//connecting to mongoose DB
mongoose.connect('mongodb+srv://admin-nayan:Nayan123@cluster0.oo0bjqs.mongodb.net/TaskDB');

//Mongoose Schema
const taskSchema ={
    myTask: String, 
    Priority: String,
    Difficulty: String,
    TimeRequired: String
};

//Mongoose Model
const Task = mongoose.model('Task', taskSchema);

app.get("/", function(req, res) {
    Task.find({})
      .then(foundItems => {
        res.render("task", { newTask: foundItems });
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  
// Helper function to map dropdown option values to emojis
function getEmoji(value) {
  switch (value) {
      case "High":
          return "🔴";
      case "Medium":
          return "🟠";
      case "Low":
          return "🟢";
      case "Hard":
          return "🔴";
      case "Easy":
          return "🟢";
      case "Long":
          return "🔴";
      case "Short":
          return "🟢";
      default:
          return "";
  }
}

  app.post("/", function(req, res){
    const myTask = req.body.Task;
    const priority = req.body.priority;
    const difficulty = req.body.difficulty;
    const timeRequired = req.body.time;

    // Add logic to map the selected option values to emojis
    const priorityEmoji = getEmoji(priority);
    const difficultyEmoji = getEmoji(difficulty);
    const timeRequiredEmoji = getEmoji(timeRequired);

    const task = new Task({
        myTask: myTask,
        Priority: priorityEmoji + priority, // Use the emoji value instead of the selected option
        Difficulty: difficultyEmoji + difficulty,
        TimeRequired: timeRequiredEmoji + timeRequired
    });

    task.save()
        .then(() => {
            res.redirect("/");
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});
  
  app.post("/delete", function(req, res){
    const taskId = req.body.taskId;
  
    Task.findByIdAndRemove(taskId)
      .then(() => {
        res.redirect("/");
      })
      .catch(err => {
        console.log(err);
        res.sendStatus(500);
      });
  });
  

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});