require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const homestaysRouter = require('./routes/homestays');
const authRouter = require('./routes/auth');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

app.use('/api/homestays', homestaysRouter);
app.use('/api/admin', authRouter);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));
