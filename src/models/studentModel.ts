import { Document, Schema, model } from 'mongoose';
import { UserStats } from '../types/type.js';
import validator from 'validator';


// nombre, apellidos, edad, y correo electrónico. 
export interface StudentDocumentInterface extends Document {
  name: string;
  surname: string;
  age: number;
  email: string;
}


const StudentSchema = new Schema<StudentDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  surname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value: string) => {
      if (!validator.default.isEmail(value)) {
        throw new Error('El email no es válido');
      }
    }
  },
  
});


export const Student = model<StudentDocumentInterface>('Student', StudentSchema);
