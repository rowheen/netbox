import express from "express";
import bodyParser from "body-parser";
import axios from "axios";



const app = express();
const port = 3000;
const API_URL = "http://localhost:8080";

let predefinedTags = ["Baudcom ONT", "DHCP2", "OLT1", "ONT", "PORT2"];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// GET All

app.get("/", async(req,res) => {
    const response = await axios.get(`${API_URL}/circuits`);
    console.log(response);
    res.render("index.ejs", {circuits: response.data});
});

// ADD circuit 

app.get("/add", (req,res) => {
    res.render("add.ejs");
});

app.post("/add/circuits", async(req,res) => {
    const response = await axios.post(`${API_URL}/circuits`, req.body);
    console.log(response.data);
    res.redirect("/");
});

// UPDATE circuit
app.get("/edit/:id", async(req,res) => {
    const response = await axios.get(`${API_URL}/circuits/${req.params.id}`);
    console.log(response.data);
    let availableTags = predefinedTags.filter((tag) => !response.data.tags.includes(tag));
    res.render("edit.ejs", {circuit:response.data, availableTags:availableTags});
});

app.post("/edit/:id", async(req,res) => {
    const response = await axios.patch(`${API_URL}/circuits/${req.params.id}`, req.body);
    console.log(response.data);
    res.redirect("/");
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});