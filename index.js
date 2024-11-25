import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 8080;

let circuits = [
    {id: 1, cid: '12345', provider: 'PT&T - Airlive', type: 'DIA', status: 'Decommissioned', tenant: 'Test', termination: 'Alabang', tags: ['Baudcom ONT', 'DHCP2', 'ONT' ], commitRate: '400', timestamp: '11/22/2024, 1:47:36 PM'}, 
    {id: 2, cid: '54321', provider: 'PT&T - Converge', type: 'Internet', status: 'Decommissioned', tenant: 'Test2', termination: 'Adriatico', tags: ['Baudcom ONT', 'DHCP2' ], commitRate: '200', timestamp: '11/22/2024, 2:08:44 PM'}
];

let predefinedTags = ["Baudcom ONT", "DHCP2", "OLT1", "ONT", "PORT2"];

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.render("index.ejs", {circuits: circuits});
});

app.get("/add", (req,res) => {
    res.render("add.ejs");
});

app.post("/add", (req,res) => {
    const id = circuits.length + 1;
    const cid = req.body.cid;
    const provider = req.body.provider;
    const type = req.body.type;
    const status = req.body.status;
    const tenant = req.body.tenant;
    const termination = req.body.termination;
    let tags = req.body.tags;
    const commitRate = req.body.commitRate;

    let convertTagsToArray = tags
    function makeArray(convertTagsToArray) {
        return Array.isArray(convertTagsToArray) ? convertTagsToArray : [convertTagsToArray];
    }
    tags = makeArray(convertTagsToArray);

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    const newCircuit = {id: id, cid: cid, provider: provider, type: type, status: status, tenant: tenant, termination: termination, tags: tags, commitRate: commitRate, timestamp:timestamp}
    circuits.push(newCircuit);
    res.redirect("/");
    console.log(circuits);
});


app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id); // Ensure the id is an integer
    const selectCID = circuits.find((circuit) => circuit.id === id);

    // Log the structure of selectCID
    console.log("SelectCID:", selectCID);
    console.log("SelectCID tags:", selectCID.tags);

    if (!selectCID) {
        return res.status(404).send("Circuit not found.");
    }

    // Filter available tags that are not already assigned to the circuit
    let availableTags = predefinedTags.filter((tag) => !selectCID.tags.includes(tag));

    // Log availableTags
    console.log("Available Tags:", availableTags);

    // Try rendering the page after logging
    res.render("edit.ejs", { circuit: selectCID, availableTags: availableTags });
});

app.patch("/edit/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const selectCID = circuits.find((circuit) => circuit.id === id);
    
    selectCID.cid = req.body.cid;
    selectCID.provider = req.body.provider;
    selectCID.type = req.body.type;
    selectCID.status = req.body.status;
    selectCID.tenant = req.body.tenant;
    selectCID.termination = req.body.termination;
    selectCID.tags = req.body.tags;
    selectCID.commitRate = req.body.commitRate;
    selectCID.timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });

    let tags = selectCID.tags;
    function makeArray(tags) {
        return Array.isArray(tags) ? tags : [tags];
    }
    selectCID.tags = makeArray(tags);

    circuits.find((circuit) => circuit.id === id) = selectCID;

    res.redirect("/");

});


app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});