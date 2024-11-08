import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies/movies.routes';
import frontRoutes from './routes/movies/front.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const cors = require("cors")
app.use(cors({
  origin: "http://localhost:3000"
}))


mongoose.connect(process.env.MONGO_URI || '', {
  connectTimeoutMS: 30000, // 30 segundos
  socketTimeoutMS: 30000,  // 30 segundos
})
.then(() => {
  console.log('Conectado ao MongoDB com sucesso');
})
.catch((error) => {
  console.error('Erro ao conectar ao MongoDB:', error);
});

// Registrar as rotas dos filmes com o prefixo /api
app.use('/api', movieRoutes);
app.use(frontRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
