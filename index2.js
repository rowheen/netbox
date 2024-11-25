import express, { application } from "express";
import bodyParser from "body-parser";

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

// GET All

app.get("/circuits", (req,res) => {
    res.json(circuits);
});

// ADD circuit

app.post("/circuits", (req,res) => {
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

    res.json(selectCID);
})

app.listen(port, ()=>{
    console.log(`server running on port ${port}`);
});