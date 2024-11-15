import express,{RequestHandler} from 'express'
import cors from 'cors'
import userRouter from './routes/userRoutes'
//import eventRouter from './routes/eventRoutes'
import postRouter from './routes/postRoutes'
import ratingRouter from './routes/ratingRoutes'

import { run } from './database/databaseConection'

const app = express()
app.use(express.json())
run();

app.use(cors());
app.use(express.json() as RequestHandler);

const PORT = 3000;

app.get('/ping', (_req , res) => {
    console.log('ping recivido correctamente')
    res.send('pinged')
})

app.use('/api/user', userRouter)
app.use('/api/posts', postRouter)
app.use('/api/ratings', ratingRouter)
//app.use('/api/events', eventRouter)

app.listen(PORT, () => {
    console.log('el servidor esta escuchando en el puerto '+ PORT)
})