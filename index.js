import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080;

let tasks = [];

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("index.ejs", {tasks:tasks});
});

app.get("/add", (req,res) => {
    res.render("edit.ejs");
});

app.post("/add", (req,res) => {
    const id = tasks.length + 1;
    const title = req.body.title;
    const description = req.body.description;
    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    const newTask = {id: id, title: title, description:description, timestamp:timestamp}
    tasks.push(newTask);
    res.redirect("/");
    console.log(tasks);
});


app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});