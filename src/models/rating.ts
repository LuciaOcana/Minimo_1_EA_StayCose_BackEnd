import { model, Schema } from "mongoose";

export interface ratingInterface{
    postID: string,     // Relaciona el rating con el post al que valora
    user: string,     // Relaciona el rating con el usuario que hizo la valoración
    value: number,         // 1 para "me gusta" y -1 para "no me gusta"
    timestamp: Date        // Fecha y hora de la valoración
 }

 export const ratingSchema = new Schema<ratingInterface>({
    postID: { type: String, required: true },     
    user: { type: String, required: true },     
    value: { type: Number, required: true },         
    timestamp: { type: Date, required: true }
    })

export const ratingofDB = model<ratingInterface>('rating',ratingSchema)