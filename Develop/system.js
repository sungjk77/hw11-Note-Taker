const fs = require('fs');
const ck = require('chalk');
const { v4: uuidv4 } = require('uuid');  //https://www.npmjs.com/package/uuid
const express = require('express');
const app = express();
const path = require('path');

const DBfile = path.join(__dirname, `db/db.json`);
let notes = [];

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get(`/notes`, (req, res) => res.sendFile(path.join(__dirname, `public/notes.html`)));
app.get(`/api/notes`, (req, res) => res.sendFile(DBfile));
app.get(`*`, (req, res) => res.sendFile(path.join(__dirname, `public/index.html`)));

app.post(`/api/notes`, (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    notes.push(newNote);
    saveDB(notes);
    res.json(newNote.id);
})

app.delete(`/api/notes/:id`, (req, res) => {
    let data = JSON.stringify(req.params.id);
    console.log(`please delete: `+ req.params.id);
    for (let i = 0; i < notes.length; i++) {
          console.log(notes[i].id);
          if (notes[i].id == req.params.id) {
            console.log('Deleting element '+i+': '+notes[i].title);
            console.log(ck.red(`Deleted`));
            notes.splice(i, 1); 
          }
    }
    saveDB(notes);
    res.end();
})

function saveDB (notes) {
   let data = JSON.stringify(notes, null, 2);
   fs.writeFile(DBfile, data, (err) => err ? console.error(err) : console.log(ck.blue('Updated!')));
}

const loadDB = (req, res) => {
    fs.readFile(DBfile, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(
          '<html><head><title>Oops</title></head><body><h1>Oops, there was an error</h1></html>'
        );
      } else {
        notes = JSON.parse(data);
        console.log(notes);
      }
    });
};

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));

loadDB();