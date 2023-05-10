import express from 'express';
import { Student } from '../models/studentModel.js';
import { Subject } from '../models/subjectModel.js';

export const studentRouter = express.Router();


/////////////////////////////////// POST  ///////////////////////////////////////

studentRouter.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    
    await student.save();
    
    return res.status(201).send(student);
  } catch (error) {
    return res.status(500).send({msg: "No se añadió correctamente el estudiante", error: error});
  }
});


/////////////////////////////////// GET  ///////////////////////////////////////

studentRouter.get('/students', async (req, res) => {
  try {
    const filter = req.query.email ? {email: req.query.email.toString()} : {};

    const student = await Student.find(filter);

    if (student.length !== 0) {
      return res.send(student);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


studentRouter.get('/students/:email', async (req, res) => {
  const filter = req.params.email ? {email: req.params.email.toString()} : {};

  try {
    const student = await Student.find(filter);

    if (student.length !== 0) {
      return res.send(student);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////

studentRouter.patch("/students/:email", async (req, res) => {
  try {
    const allowedUpdates = ["name", "surname", "age", "email"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar"});
    }

    // Usuario después de ser modificado
    const student = await Student.findOneAndUpdate({ email: req.params.email }, req.body, { new: true, runValidators: true, });


    // TODO : revisar el populate
    if (student) {
      return res.send(student);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});



studentRouter.patch("/students", async (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({ error: 'Debe dar un email' });
  }

  try {
    const allowedUpdates = ["name", "surname", "age", "email"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar"});
    }
    const student = await Student.findOneAndUpdate({ email: req.query.email }, req.body, { new: true, runValidators: true, });
    // TODO : revisar el populate
    if (student) {
      return res.send(student);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});


/////////////////////////////////// DELETE  ///////////////////////////////////////

studentRouter.delete('/students', async (req, res) => {
  if (!req.query.email) {
    return res.status(400).send({ error: 'Debe introducir un email' });
  }

  try {
    const student = await Student.findOne({email: req.query.email.toString()});

    if (!student) {
      return res.status(404).send();
    }

    // TODO : darse cuenta del borrado en cascada
    await Subject.updateMany( { students: student._id }, { $pull: { students: student._id }});

    await Student.findByIdAndDelete(student._id);

    return res.send(student);
  } catch (error) {
    return res.status(500).send(error);
  }
});


studentRouter.delete('/students/:email', async (req, res) => {
  if (!req.params.email) {
    return res.status(400).send({ error: 'Debe introducir un email' });
  }

  try {
    const student = await Student.findOne({email: req.params.email.toString()});

    if (!student) {
      return res.status(404).send();
    }

    // TODO : darse cuenta del borrado en cascada
    await Subject.updateMany( { students: student._id }, { $pull: { students: student._id }});
    
    await Student.findByIdAndDelete(student._id);
    
    return res.send(student);
  } catch (error) {
    return res.status(500).send(error);
  }
});
