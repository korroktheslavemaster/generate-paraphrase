require('dotenv').config()
const express = require("express");
var bodyParser = require('body-parser')
const { Client } = require('pg')
const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const path = require("path");
app.use(express.static("public"));
app.set("port", process.env.PORT || 3001);


/// pg stuff
const client = new Client({
    connectionString: process.env.DATABASE_URL
});
client.connect();
pgInit = async () => {
    await client.query('CREATE TABLE if not exists originals (id SERIAL PRIMARY KEY, text VARCHAR(500) NOT NULL);')
    await client.query('CREATE TABLE if not exists paraphrases (id SERIAL PRIMARY KEY, text VARCHAR(500) NOT NULL, original_id integer references originals(id));')
}
pgInit()
///

app.get('/api/randomOriginal', (req, res) => {
    client.query("SELECT * from originals order by random() limit 1;", (err, res2) => {
        if (err) {
            res.send({error: err});
        } else {
            if (res2.rowCount == 1) {
                res.send(res2.rows[0]);
            } else {
                res.send({error: "no rows"});
            }
        }
    })
})

app.post('/api/paraphrase', (req, res) => {
    const {original_id, text} = req.body;
    client.query(`INSERT INTO paraphrases (text, original_id) values ('${text}', ${original_id});`)
        .then(res2 => res.send(res2.rows))
        .catch(err => res.send({error: err}))
})

// after api and auth routes so that doesn't mess with them?
if (process.env.NODE_ENV == "production") {
    console.log("prod env");
    app.use(express.static(path.join(__dirname, "client/build")));
  
    app.get("/*", function(req, res) {
      res.sendFile(path.join(__dirname, "client/build", "index.html"));
    });
}

app.listen(app.get("port"), () => {
    console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});
