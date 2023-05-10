import express from 'express';
import './db/mongoose.js';
import { studentRouter } from './routers/studentRouter.js'
import { subjectRouter } from './routers/subjectRouter.js'
import { defaultRouter } from './routers/defaultRouter.js';

export const app = express();
app.use(express.json());
app.use(studentRouter);
app.use(subjectRouter);
app.use(defaultRouter);


// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is up on port ${port}`);
// });