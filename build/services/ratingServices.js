"use strict";
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
exports.getEntries = void 0;
const rating_1 = require("../models/rating");
exports.getEntries = {
    // Obtener todas las valoraciones con paginación y filtrado opcional por `contentId` o `userId`
    getAll: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const ratings = yield rating_1.ratingofDB.find()
            .skip(skip)
            .limit(limit);
        return ratings;
    }),
    // Buscar una valoración por ID
    findById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield rating_1.ratingofDB.findById(id);
    }),
    // Crear una nueva valoración
    create: (entry) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(entry);
        return yield rating_1.ratingofDB.create(entry);
    }),
    // Actualizar una valoración por ID
    updateById: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(body);
        return yield rating_1.ratingofDB.findByIdAndUpdate(id, body, { new: true });
    }),
    // Eliminar una valoración por ID
    deleteById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield rating_1.ratingofDB.findByIdAndDelete(id);
    }),
    // Contar el total de valoraciones, con filtro opcional
    countTotalRatings: (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (filter = {}) {
        return yield rating_1.ratingofDB.countDocuments(filter);
    }),
    // Obtener valoraciones agrupadas por contenido y ordenadas por número de valoraciones
    getRatingsGroupedByContent: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield rating_1.ratingofDB.aggregate([
            { $group: { _id: "$contentId", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
    })
};
