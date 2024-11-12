"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingofDB = exports.ratingSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ratingSchema = new mongoose_1.Schema({
    postID: { type: String, required: true },
    user: { type: String, required: true },
    value: { type: Number, required: true },
    timestamp: { type: Date, required: true }
});
exports.ratingofDB = (0, mongoose_1.model)('rating', exports.ratingSchema);
