import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 8080;

let circuits = [];

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("index.ejs", {circuits: circuits});
});

app.get("/add", (req,res) => {
    res.render("edit.ejs");
});

app.post("/add", (req,res) => {
    const id = circuits.length + 1;
    const cid = req.body.cid;
    const provider = req.body.provider;
    const type = req.body.type;
    const status = req.body.status;
    const tenant = req.body.tenant;
    const termination = req.body.termination;
    const tags = req.body.tags;
    const commitRate = req.body.commitRate;


    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    const newCircuit = {id: id, cid: cid, provider: provider, type: type, status: status, tenant: tenant, termination: termination, tags: tags, commitRate: commitRate, timestamp:timestamp}
    circuits.push(newCircuit);
    res.redirect("/");
    console.log(circuits);
});

app.patch("/edit/:id", (req,res) => {

})


app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});