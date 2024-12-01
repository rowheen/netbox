import express, { application } from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";

const app = express();
const port = 8080;
const filePath = path.join(process.cwd(), 'circuits.json');

let circuits = [];

let predefinedTags = ["Baudcom ONT", "DHCP2", "OLT1", "ONT", "PORT2"];

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Check if the file exists, if it does, read its contents
if (fs.existsSync(filePath)) {
    // If the file exists, read it synchronously
    const rawData = fs.readFileSync(filePath, 'utf-8');
    try {
      // Parse the JSON data from the file into the array
      circuits = JSON.parse(rawData);
      console.log("Loaded circuits from file:", circuits);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  } else {
    console.log("No previous data found, starting fresh.");
  }

// GET All

app.get("/circuits", (req,res) => {
    res.json(circuits);
});

// ADD circuit

app.post("/circuits", (req,res) => {
    let previousId = circuits.slice(-1)

    const id = previousId[0].id + 1;
    const cid = req.body.cid;
    const provider = req.body.provider;
    const type = req.body.type;
    const status = req.body.status;
    const tenant = req.body.tenant;
    const termination = req.body.termination;
    let tags = req.body.tags;
    const commitRate = req.body.commitRate;

    console.log(previousId[0].id);

    let convertTagsToArray = tags
    function makeArray(convertTagsToArray) {
        return Array.isArray(convertTagsToArray) ? convertTagsToArray : [convertTagsToArray];
    }
    tags = makeArray(convertTagsToArray);

    const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" });
    
    const newCircuit = {id: id, cid: cid, provider: provider, type: type, status: status, tenant: tenant, termination: termination, tags: tags, commitRate: commitRate, timestamp:timestamp}
    circuits.push(newCircuit);
    fs.writeFileSync(filePath, JSON.stringify(circuits, null, 2));
    res.json(newCircuit);
});

//UPDATE circuit
app.get("/circuits/:id", (req,res) => {
    const id = parseInt(req.params.id);
    const selectCID = circuits.find((circuit) => circuit.id === id);
    let availableTags = predefinedTags.filter((tag) => !selectCID.tags.includes(tag));

    res.json(selectCID);
    res.json(availableTags);
  });

app.patch("/circuits/:id", (req,res) => {
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
    fs.writeFileSync(filePath, JSON.stringify(circuits, null, 2));

    res.json(selectCID);
});

//DELETE circuit

app.delete("/circuits/:id", (req,res) => {
    const id = parseInt(req.params.id);

    const selectIndex = circuits.findIndex((circuit) => circuit.id === id);

    circuits.splice(selectIndex,1);
    fs.writeFileSync(filePath, JSON.stringify(circuits, null, 2));
    res.json({ message: "Post deleted" });
});

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});