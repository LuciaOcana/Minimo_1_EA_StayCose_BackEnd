import { Request, Response } from "express";
import * as ratingServices from "../services/ratingServices";
import * as postServices from "../services/postServices";

import { ratingInterface } from "../models/rating";

// ratingController.ts
export async function createRating(req: Request, res: Response): Promise<Response> {
    try {
        const { postID ,user, value } = req.body as ratingInterface;

          // Verificamos si el postID es válido (se podría hacer una comprobación para asegurar que el post exista en la base de datos)
          if (!postID || !user || value === undefined) {
            return res.status(400).json({ error: 'postID, user y value son necesarios.' });
        }
        // Crear el objeto rating, asignando la fecha actual si no se pasa la fecha
        const newRating = {
            postID,
            user,
            value,
            timestamp: new Date(), // Asignamos la fecha actual si no se pasa
        };

        // Llamamos al servicio para crear la valoración
        const createdRating = await ratingServices.getEntries.create(newRating);

        return res.status(201).json({
            message: "Valoración creada",
            rating: createdRating
        });
    } catch (error) {
        console.error("Error al crear valoración:", error);
        return res.status(500).json({ error: 'Error al crear valoración' });
    }
}


// Función para agregar un "like" o "dislike"
export async function addRating(req: Request, res: Response): Promise<Response> {
    try {
        const { postID, user, value } = req.body;

        // Verificar si el post existe
        const post = await postServices.getEntries.findById(postID);
        if (!post) {
            return res.status(404).json({ error: 'Post no encontrado' });
        }

         // Crear un nuevo rating utilizando ratingServices (si lo necesitas para llevar un historial de valoraciones)
         const newRating = { postID, user, value, timestamp: new Date() };
         await ratingServices.getEntries.create(newRating); // Aquí usamos el servicio para crear el rating

        // Actualizar el contador de likes o dislikes en el post
        if (value === 1) {
            post.likes += 1; // Incrementar likes
        } else if (value === -1) {
            post.dislikes += 1; // Incrementar dislikes
        }

        // Guardar el post con los nuevos valores de likes y dislikes
        await post.save();

        return res.status(201).json({ message: 'Valoración registrada con éxito', post });
    } catch (error) {
        console.error("Error al agregar valoración:", error);
        return res.status(500).json({ error: 'Error al agregar valoración' });
    }
}

// Obtener todas las valoraciones, opcionalmente por `contentId` o `userId`
export async function getRatings(_req: Request, res: Response): Promise<Response> {
    try {
        console.log("Get posts");
        const ratings = await ratingServices.getEntries.getAll();
        console.log("rating",ratings);
        return res.json(ratings);
       } catch (error) {
        return res.status(500).json({ error:'Failed to get posts'});
       }
}

// Obtener una valoración por ID
export async function getRatingById(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;
        const rating = await ratingServices.getEntries.findById(id);

        if (!rating) {
            return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
        }
        return res.json(rating);
    } catch (error) {
        console.error("Error al obtener valoración por ID:", error);
        return res.status(500).json({ error: 'Error al obtener valoración' });
    }
}

// Actualizar una valoración por ID
export async function updateRating(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;
        const { value } = req.body as ratingInterface;
        const updatedRating = await ratingServices.getEntries.updateById(id, { value });

        if (!updatedRating) {
            return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
        }
        return res.json({
            message: "Valoración actualizada",
            rating: updatedRating
        });
    } catch (error) {
        console.error("Error al actualizar valoración:", error);
        return res.status(500).json({ error: 'Error al actualizar valoración' });
    }
}

// Eliminar una valoración por ID
export async function deleteRating(req: Request, res: Response): Promise<Response> {
    try {
        const id = req.params.id;
        const deletedRating = await ratingServices.getEntries.deleteById(id);

        if (!deletedRating) {
            return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
        }
        return res.json({ message: 'Valoración eliminada', rating: deletedRating });
    } catch (error) {
        console.error("Error al eliminar valoración:", error);
        return res.status(500).json({ error: 'Error al eliminar valoración' });
    }
}
