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
      desc VARCHAR(255) NOT NULL,
      imgSrc VARCHAR(255) NOT NULL
      );`
  )

  database.get(`SELECT * FROM foodList`, (err, foodList) =>
  {
    //Table layout test
    if(!foodList)
    {
      database.run(
        `INSERT INTO foodList (name, price, desc, imgSrc)
        VALUES(
          "Kartupelis",
          "3.52",
          "Mums ir pieejami mīksti, vārīti karupeļi iegūti no tālām zemēm.",
          "https://cdn.santa.lv/media/2020/03/4/large/2530503a0cb7.jpg");
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
    INSERT INTO foodList (name, price, desc, imgSrc)
    VALUES(
      "${req.body.name}", 
      "${req.body.price}",
      "${req.body.desc}",  
      "${req.body.imgSrc}");
  `)
    res.json('New item added')
  })


})

