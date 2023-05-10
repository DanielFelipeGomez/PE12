import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import { StudentExist } from '../tools/tools.js';

// : nombre, descripción y estudiantes matriculados.
export interface SubjectDocumentInterface extends Document {
  name: string;
  description: string;
  students: Schema.Types.ObjectId[];
}

const SubjectSchema = new Schema<SubjectDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('El nombre de una asignatura debe comenzar con mayúscula');
      } else if (!validator.default.isAlphanumeric(value)) {
        throw new Error('Solo se aceptan caracteres alfanuméricos');
      }
    }
  },
  description: {
    type: String,
    required: true,
  },
  students: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: 'Student',
    validate: [{
      validator: async (value: Schema.Types.ObjectId[]) => {
        for (const id of value) {
          await StudentExist(id);
        }
      } 
    },
    {
      validator: async (value: Schema.Types.ObjectId[]) => {
        const arrayUnique = new Set(value);
        return arrayUnique.size === value.length;
      },
    }]
  }
});

export const Subject = model<SubjectDocumentInterface>('Subject', SubjectSchema);
