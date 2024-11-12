"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = require("../controllers/ratingController");
const router = express_1.default.Router();
// Ruta para obtener todas las valoraciones con paginación y filtros opcionales (contentId y userId)
router.get("/", ratingController_1.getRatings);
// Ruta para crear una nueva valoración
router.post("/", ratingController_1.createRating);
// Ruta para agregar un like/dislike
router.post("/addRating", ratingController_1.addRating);
// Ruta para obtener una valoración por su ID
router.get("/getRating/:id", ratingController_1.getRatingById);
// Ruta para actualizar una valoración por su ID
router.put("/update/:id", ratingController_1.updateRating);
// Ruta para eliminar una valoración por su ID
router.delete("/:id", ratingController_1.deleteRating);
exports.default = router;
