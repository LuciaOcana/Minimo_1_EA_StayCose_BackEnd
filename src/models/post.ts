import { model, Schema } from "mongoose";


export interface postInterface{
    author: string,
    postType: string,
    content: string,
    image?: string,
    postDate: Date,
    likes: number, // Nueva propiedad para contar los likes
    dislikes: number // Nueva propiedad para contar los dislikes
}

export type newPostInfo = Omit<postInterface,'id'>

export const postSchema = new Schema<postInterface>({
    author: { type: String, required: true },
    postType: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: false },
    postDate: { type: Date, required: false },
    likes: { type: Number, default: 0 },  // Valor inicial es 0
    dislikes: { type: Number, default: 0 },  // Valor inicial es 0
})

export const postofDB = model<postInterface>('post',postSchema)