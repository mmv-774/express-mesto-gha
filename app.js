require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { notFoundErrorHandler, httpErrorHandler } = require('./middlewares/middlewares');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.post('/signin', login);
app.post('/signup', createUser);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', notFoundErrorHandler);
app.use(httpErrorHandler);

app.listen(PORT, () => {
  console.log(`App start on ${PORT} port`);
});
