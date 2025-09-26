import express from 'express';
import PulpiComentarios from '../models/PulpiComentarios';  // Ajusta la ruta según tu estructura de proyecto

const router = express.Router();

// Crear un nuevo comentario
router.post('/comentarios', async (req, res) => {
    try {
        const { comentario } = req.body;
        console.log(comentario);
        const nuevoComentario = new PulpiComentarios({ comentario });
        await nuevoComentario.save();
        res.status(201).json(nuevoComentario);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear el comentario', error });
    }
});

// Obtener todos los comentarios
router.get('/comentarios', async (req, res) => {
    try {
        const comentarios = await PulpiComentarios.find();
        res.status(200).json(comentarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los comentarios', error });
    }
});

// Obtener un comentario por su ID
router.get('/comentarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comentario = await PulpiComentarios.findById(id);
        if (!comentario) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        res.status(200).json(comentario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el comentario', error });
    }
});

// Editar un comentario
router.put('/comentarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { comentario } = req.body;
        const comentarioActualizado = await PulpiComentarios.findByIdAndUpdate(id, { comentario }, { new: true });
        if (!comentarioActualizado) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        res.status(200).json(comentarioActualizado);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar el comentario', error });
    }
});

// Borrar un comentario
router.delete('/comentarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const comentarioEliminado = await PulpiComentarios.findByIdAndDelete(id);
        if (!comentarioEliminado) {
            return res.status(404).json({ message: 'Comentario no encontrado' });
        }
        res.status(200).json({ message: 'Comentario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el comentario', error });
    }
});

export default router;
