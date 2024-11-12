import { ratingofDB } from '../models/rating';

export const getEntries = {

    // Obtener todas las valoraciones con paginación y filtrado opcional por `contentId` o `userId`
    getAll: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;
        const ratings = await ratingofDB.find()
                                        .skip(skip)
                                        .limit(limit);
        return ratings;
    },

    // Buscar una valoración por ID
    findById: async (id: string) => {
        return await ratingofDB.findById(id);
    },

    // Crear una nueva valoración
    create: async (entry: object) => {
        console.log(entry);
        return await ratingofDB.create(entry);
    },

    // Actualizar una valoración por ID
    updateById: async (id: string, body: object) => {
        console.log(body);
        return await ratingofDB.findByIdAndUpdate(id, body, { new: true });
    },

    // Eliminar una valoración por ID
    deleteById: async (id: string) => {
        return await ratingofDB.findByIdAndDelete(id);
    },

    // Contar el total de valoraciones, con filtro opcional
    countTotalRatings: async (filter: object = {}) => {
        return await ratingofDB.countDocuments(filter);
    },

    // Obtener valoraciones agrupadas por contenido y ordenadas por número de valoraciones
    getRatingsGroupedByContent: async () => {
        return await ratingofDB.aggregate([
            { $group: { _id: "$contentId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
    }
};
