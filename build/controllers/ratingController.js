"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRating = createRating;
exports.addRating = addRating;
exports.getRatings = getRatings;
exports.getRatingById = getRatingById;
exports.updateRating = updateRating;
exports.deleteRating = deleteRating;
const ratingServices = __importStar(require("../services/ratingServices"));
const postServices = __importStar(require("../services/postServices"));
// ratingController.ts
function createRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postID, user, value } = req.body;
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
            const createdRating = yield ratingServices.getEntries.create(newRating);
            return res.status(201).json({
                message: "Valoración creada",
                rating: createdRating
            });
        }
        catch (error) {
            console.error("Error al crear valoración:", error);
            return res.status(500).json({ error: 'Error al crear valoración' });
        }
    });
}
// Función para agregar un "like" o "dislike"
function addRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { postID, user, value } = req.body;
            // Verificar si el post existe
            const post = yield postServices.getEntries.findById(postID);
            if (!post) {
                return res.status(404).json({ error: 'Post no encontrado' });
            }
            // Crear un nuevo rating utilizando ratingServices (si lo necesitas para llevar un historial de valoraciones)
            const newRating = { postID, user, value, timestamp: new Date() };
            yield ratingServices.getEntries.create(newRating); // Aquí usamos el servicio para crear el rating
            // Actualizar el contador de likes o dislikes en el post
            if (value === 1) {
                post.likes += 1; // Incrementar likes
            }
            else if (value === -1) {
                post.dislikes += 1; // Incrementar dislikes
            }
            // Guardar el post con los nuevos valores de likes y dislikes
            yield post.save();
            return res.status(201).json({ message: 'Valoración registrada con éxito', post });
        }
        catch (error) {
            console.error("Error al agregar valoración:", error);
            return res.status(500).json({ error: 'Error al agregar valoración' });
        }
    });
}
// Obtener todas las valoraciones, opcionalmente por `contentId` o `userId`
function getRatings(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Get posts");
            const ratings = yield ratingServices.getEntries.getAll();
            console.log("rating", ratings);
            return res.json(ratings);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to get posts' });
        }
    });
}
// Obtener una valoración por ID
function getRatingById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const rating = yield ratingServices.getEntries.findById(id);
            if (!rating) {
                return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
            }
            return res.json(rating);
        }
        catch (error) {
            console.error("Error al obtener valoración por ID:", error);
            return res.status(500).json({ error: 'Error al obtener valoración' });
        }
    });
}
// Actualizar una valoración por ID
function updateRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const { value } = req.body;
            const updatedRating = yield ratingServices.getEntries.updateById(id, { value });
            if (!updatedRating) {
                return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
            }
            return res.json({
                message: "Valoración actualizada",
                rating: updatedRating
            });
        }
        catch (error) {
            console.error("Error al actualizar valoración:", error);
            return res.status(500).json({ error: 'Error al actualizar valoración' });
        }
    });
}
// Eliminar una valoración por ID
function deleteRating(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const id = req.params.id;
            const deletedRating = yield ratingServices.getEntries.deleteById(id);
            if (!deletedRating) {
                return res.status(404).json({ error: `Valoración con id ${id} no encontrada` });
            }
            return res.json({ message: 'Valoración eliminada', rating: deletedRating });
        }
        catch (error) {
            console.error("Error al eliminar valoración:", error);
            return res.status(500).json({ error: 'Error al eliminar valoración' });
        }
    });
}
