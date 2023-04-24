const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const port = 3004;

const database = new sqlite3.Database("./db/database.db")

const app = express()

//app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cors({origin: '*'}))

app.listen(port, () =>
{
  console.log(`Database running on port ${port}`)
})

database.serialize(() =>
{
  database.run(
    `CREATE TABLE IF NOT EXISTS foodList (
      id INTEGER PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      price VARCHAR(255) NOT NULL,
      imgSrc VARCHAR(255) NOT NULL
      );`
  )

  database.get(`SELECT * FROM foodList`, (err, foodList) =>
  {
    //Table layout test
    if(!foodList)
    {
      database.run(
        `INSERT INTO foodList (name, price, imgSrc)
        VALUES(
          "Kartupelis",
          "3",
          "kartupelisAttels");
        )`
      )
    }
  
})


app.get("/", (req, res) =>
{
  database.get(`SELECT * FROM foodList`, (err, item) =>
  {
    res.json({foodList: item})
  })
})

app.get("/foodList", (req, res) =>
{
  database.all(`SELECT * FROM foodList`, (err, items) =>
  {
    res.json(items)
  })
})

app.post('/foodList', (req, res) => {
  database.run(`
    INSERT INTO foodList (name, price, imgSrc)
    VALUES(
      "${req.body.name}", 
      "${req.body.price}", 
      "${req.body.imgSrc}");
  `)
    res.json('New item added')
  })


})

