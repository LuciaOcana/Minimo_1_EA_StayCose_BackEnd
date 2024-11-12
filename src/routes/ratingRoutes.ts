import express from 'express';

import { createRating, addRating, getRatings, getRatingById, updateRating, deleteRating } from '../controllers/ratingController';

const router = express.Router();

// Ruta para obtener todas las valoraciones con paginación y filtros opcionales (contentId y userId)
router.get("/", getRatings);

// Ruta para crear una nueva valoración
router.post("/", createRating);

// Ruta para agregar un like/dislike
router.post("/addRating", addRating);

// Ruta para obtener una valoración por su ID
router.get("/getRating/:id", getRatingById);

// Ruta para actualizar una valoración por su ID
router.put("/update/:id", updateRating);

// Ruta para eliminar una valoración por su ID
router.delete("/:id", deleteRating);

export default router;
