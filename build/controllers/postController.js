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
exports.getPosts = getPosts;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
exports.getPost = getPost;
exports.getAuthorPosts = getAuthorPosts;
//import { userInterface } from "../models/user";
const postServices = __importStar(require("../services/postServices"));
const ratingServices = __importStar(require("../services/ratingServices"));
//import * as userServices from "../services/userServices"; // Asegúrate de importar los servicios de usuario
//import { post } from "@typegoose/typegoose";
//import { userInterface } from "../models/user";
function getPosts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Get posts");
            const posts = yield postServices.getEntries.getAll();
            console.log("post", posts);
            return res.json(posts);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to get posts' });
        }
    });
}
// Crear un nuevo post y asignar una valoración si es proporcionada
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { author, postType, content, image, postDate, ratingValue, ratingUser } = req.body;
            // Comprobamos si el usuario existe
            const userExists = yield postServices.getEntries.checkIfUserExists(author);
            if (!userExists) {
                return res.status(400).json({ error: "User does not exist" });
            }
            // Creamos un nuevo objeto de post
            const newPost = {
                author,
                postType,
                content,
                image: image || '',
                postDate: postDate ? new Date(postDate) : new Date(),
                likes: 0, // Inicializamos el contador de likes
                dislikes: 0, // Inicializamos el contador de dislikes
            };
            // Usamos el servicio para crear el post
            const post = yield postServices.getEntries.create(newPost);
            // Si se incluye una valoración (rating), la creamos y asignamos al post
            if (ratingValue && ratingUser) {
                // Verificamos si ya existe una valoración de este usuario en el post
                const existingRating = yield ratingServices.getEntries.findById(post._id.toString());
                if (existingRating) {
                    return res.status(400).json({ error: 'Ya has valorado este post' });
                }
                // Crear el objeto rating
                const newRating = {
                    postID: post._id.toString(), // Convertimos el ObjectId a string
                    user: ratingUser,
                    value: ratingValue,
                    timestamp: new Date()
                };
                // Usamos el servicio para crear la valoración
                yield ratingServices.getEntries.create(newRating);
                // Actualizamos el contador de likes o dislikes en el post
                if (ratingValue === 1) {
                    post.likes += 1; // Incrementar likes
                }
                else if (ratingValue === -1) {
                    post.dislikes += 1; // Incrementar dislikes
                }
                // Guardamos el post con los nuevos valores de likes y dislikes
                yield post.save();
            }
            return res.status(201).json({
                message: "Post creado y valoración asignada (si se proporcionó)",
                post
            });
        }
        catch (error) {
            console.error("Error creando el post:", error);
            return res.status(500).json({ error: 'Error al crear el post' });
        }
    });
}
function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Get post');
            const id = req.params.id;
            const { author, postType, content, image, postDate } = req.body;
            const updatedPost = { author, postType, content, image, postDate };
            const post = yield postServices.getEntries.update(id, updatedPost);
            if (!post) {
                return res.status(404).json({ error: 'Post with id ${id} not found' });
            }
            return res.json({
                message: "Post updated",
                post
            });
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to update post' });
        }
    });
}
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Delete post');
            const id = req.params.id;
            const post = yield postServices.getEntries.delete(id);
            if (!post) {
                return res.status(404).json({ error: 'Post with id ${id} not found' });
            }
            return res.json(post);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to get post' });
        }
    });
}
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log('Get post');
            const id = req.params.id;
            const post = yield postServices.getEntries.findById(id);
            if (!post) {
                return res.status(404).json({ error: `User with id ${id} not found` });
            }
            return res.json(post);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to get post' });
        }
    });
}
function getAuthorPosts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const idAuthor = req.params.id;
            console.log('Get post from Author with id: ', idAuthor);
            const posts = yield postServices.getEntries.findByAuthor(idAuthor);
            console.log(posts);
            if (!posts) {
                return res.status(404).json({ error: `User with id ${idAuthor} not found` });
            }
            return res.json(posts);
        }
        catch (error) {
            return res.status(500).json({ error: 'Failed to get post' });
        }
    });
}
