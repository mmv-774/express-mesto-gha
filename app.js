require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors } = require('celebrate');
const { notFoundErrorHandler, httpErrorHandler } = require('./middlewares/middlewares');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { signupSchema, signinSchema } = require('./middlewares/validatior');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.post('/signin', celebrate(signupSchema), login);
app.post('/signup', celebrate(signinSchema), createUser);
app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);
app.use('*', notFoundErrorHandler);
app.use(errors());
app.use(httpErrorHandler);

app.listen(PORT);
