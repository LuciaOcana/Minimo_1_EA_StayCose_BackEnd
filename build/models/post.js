"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postofDB = exports.postSchema = void 0;
const mongoose_1 = require("mongoose");
exports.postSchema = new mongoose_1.Schema({
    author: { type: String, required: true },
    postType: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    postDate: { type: Date, required: false },
    likes: { type: Number, default: 0 }, // Valor inicial es 0
    dislikes: { type: Number, default: 0 }, // Valor inicial es 0
});
exports.postofDB = (0, mongoose_1.model)('post', exports.postSchema);
