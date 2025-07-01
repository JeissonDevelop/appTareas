import mongoose from 'mongoose';

const TareaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  completada: { type: Boolean, default: false },
  Usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
}, { timestamps: true });

const Tarea = mongoose.models.Tarea || mongoose.model('Tarea', TareaSchema);

export default Tarea;
