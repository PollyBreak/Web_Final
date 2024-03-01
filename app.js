require("dotenv").config();

const express = require('express')
const mongoose = require('mongoose')
const authRouter = require('./routes/authRouter')
const projectRouter = require('./routes/projectRouter')
const apiRouter = require('./routes/apiRouter')
const path = require("path");
const PORT = process.env.PORT || 3000
const mongoConnection = process.env.DATABASE_URL

const app = express()

app.use(express.json())
app.use("/auth", authRouter)
app.use("/project", projectRouter)
app.use("/api", apiRouter)

app.use('/static', express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/home', function (req, res) {
  res.render('index')
})

const start = async () => {
  try {
    await mongoose.connect(mongoConnection)
    app.listen(PORT, () => console.log(`server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()