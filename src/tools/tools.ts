import { Schema } from "mongoose";
import { Student } from "../models/studentModel.js";



export const StudentExist = async (id: Schema.Types.ObjectId) => {
  const users = await Student.findOne({ _id: id });
  if (users === null) {
    throw new Error('No existe ningún estudiante con ese id');
  }
  return true;
}
