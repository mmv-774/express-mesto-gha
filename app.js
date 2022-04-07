const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { setUserId } = require('./middlewares/middlewares');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(setUserId);
app.use(bodyParser.json());
app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.listen(PORT, () => {
  console.log(`App start on ${PORT} port`);
});
