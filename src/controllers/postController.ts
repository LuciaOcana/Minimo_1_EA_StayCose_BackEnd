import { Request, Response } from "express";
//import { userInterface } from "../models/user";
import * as postServices from "../services/postServices";
import * as ratingServices from "../services/ratingServices";
import { postInterface } from "../models/post";
import { ratingInterface } from "../models/rating";
//import * as userServices from "../services/userServices"; // Asegúrate de importar los servicios de usuario


//import { post } from "@typegoose/typegoose";

//import { userInterface } from "../models/user";

export async function getPosts(_req: Request, res: Response): Promise<Response> {
   try {
    console.log("Get posts");
    const posts = await postServices.getEntries.getAll();
    console.log("post", posts);
    return res.json(posts);
   } catch (error) {
    return res.status(500).json({ error:'Failed to get posts'});
   }
}

// Crear un nuevo post y asignar una valoración si es proporcionada
export async function createPost(req: Request, res: Response): Promise<Response> {
    try {
       const { author, postType, content, image, postDate, ratingValue, ratingUser } = req.body as postInterface & { ratingValue?: number, ratingUser?: string };
 
       // Comprobamos si el usuario existe
       const userExists = await postServices.getEntries.checkIfUserExists(author);
       if (!userExists) {
           return res.status(400).json({ error: "User does not exist" });
       }
 
       // Creamos un nuevo objeto de post
       const newPost: postInterface = {
           author,
           postType,
           content,
           image: image || '',
           postDate: postDate ? new Date(postDate) : new Date(),
           likes: 0, // Inicializamos el contador de likes
           dislikes: 0, // Inicializamos el contador de dislikes
       };
 
       // Usamos el servicio para crear el post
       const post = await postServices.getEntries.create(newPost);
 
       // Si se incluye una valoración (rating), la creamos y asignamos al post
       if (ratingValue && ratingUser) {
           // Verificamos si ya existe una valoración de este usuario en el post
           const existingRating = await ratingServices.getEntries.findById(post._id.toString());
           if (existingRating) {
               return res.status(400).json({ error: 'Ya has valorado este post' });
           }
 
           // Crear el objeto rating
           const newRating: ratingInterface = {
                postID: post._id.toString(),  // Convertimos el ObjectId a string
                user: ratingUser,
               value: ratingValue,
               timestamp: new Date()
           };
 
           // Usamos el servicio para crear la valoración
           await ratingServices.getEntries.create(newRating);
 
           // Actualizamos el contador de likes o dislikes en el post
           if (ratingValue === 1) {
               post.likes += 1; // Incrementar likes
           } else if (ratingValue === -1) {
               post.dislikes += 1; // Incrementar dislikes
           }
 
           // Guardamos el post con los nuevos valores de likes y dislikes
           await post.save();
       }
 
       return res.status(201).json({
           message: "Post creado y valoración asignada (si se proporcionó)",
           post
       });
   } catch (error) {
       console.error("Error creando el post:", error);
       return res.status(500).json({ error: 'Error al crear el post' });
   }
 }
 
  export async function updatePost(req: Request, res: Response): Promise<Response> {
   try{
       console.log('Get post');
       const id = req.params.id;
       const { author, postType, content, image, postDate } = req.body as postInterface;
       const updatedPost: Partial<postInterface> = { author, postType, content, image, postDate};
       const post = await postServices.getEntries.update(id, updatedPost);

       if(!post) {
           return res.status(404).json({ error: 'Post with id ${id} not found' });
       }
       return res.json({
           message: "Post updated",
           post
       });
   } catch (error) {
       return res.status(500).json({ error: 'Failed to update post' });
   }
}
export async function deletePost(req: Request, res: Response): Promise<Response> {
   try{
       console.log('Delete post');
       const id = req.params.id;
       const post = await postServices.getEntries.delete(id);

       if (!post){
           return res.status(404).json({ error: 'Post with id ${id} not found' });
       }
       return res.json(post);
   } catch (error) {
       return res.status(500).json({ error: 'Failed to get post' });
   }
}
export async function getPost(req: Request, res: Response): Promise<Response> {
   try {
       console.log('Get post');
       const id = req.params.id;
       const post = await postServices.getEntries.findById(id);

       if(!post) {
           return res.status(404).json({ error: `User with id ${id} not found` });
       }
       return res.json(post);
   } catch (error) {
       return res.status(500).json({ error: 'Failed to get post' });
   }
}
export async function getAuthorPosts(req: Request, res: Response): Promise<Response> {
   try{
      const idAuthor = req.params.id;
      console.log('Get post from Author with id: ', idAuthor);
      const posts = await postServices.getEntries.findByAuthor(idAuthor);
      console.log(posts);
      if(!posts){
         return res.status(404).json({ error: `User with id ${idAuthor} not found` });
      }
      return res.json(posts)
   } catch (error) {
      return res.status(500).json({ error: 'Failed to get post' });
   } 
}