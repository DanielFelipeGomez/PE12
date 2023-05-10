import express from "express";
import { Schema } from "mongoose";
import { Subject } from "../models/subjectModel.js";


export const subjectRouter = express.Router();

/////////////////////////////////// POST  ///////////////////////////////////////

subjectRouter.post("/subjects", async (req, res) => {
  try {
    const subject = new Subject(req.body);
    await subject.save();
    await subject.populate("students");
    return res.status(201).send(subject);
  } catch (error) {
    return res.status(500).send(error);
  }    
});

/////////////////////////////////// GET  ///////////////////////////////////////

subjectRouter.get("/subjects", async (req, res) => {
  const filter = req.query.id ? { _id: req.query.id.toString() } : {};

  try {
    const subjects = await Subject.find(filter).populate("students");

    if (subjects.length !== 0) {
      return res.send(subjects);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

subjectRouter.get("/subjects/:id", async (req, res) => {
  try {
    const filter = req.params.id ? { _id: req.params.id.toString() } : {};

    const subjects = await Subject.find(filter).populate("students");

    if (subjects.length !== 0) {
      return res.send(subjects);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// PATCH  ///////////////////////////////////////


subjectRouter.patch("/subjects/:id", async (req, res) => {
  try {
    const allowedUpdates = ["name", "description", "students"];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      return res.status(400).send({ error: "Los parámetros seleccionados no se puede modificar" });
    }

    const subject = await Subject.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true });
    // TODO : revisar el populate

    if (subject) {
      return res.send(subject);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});

/////////////////////////////////// DELETE  ///////////////////////////////////////

subjectRouter.delete('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findOne({ _id: req.params.id });

    if (!subject) {
      return res.status(404).send({ error: "Asignatura no encontrada" });
    }

    if (subject) {
      return res.send(subject);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(500).send(error);
  }
});
