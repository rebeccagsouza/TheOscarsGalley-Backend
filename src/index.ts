import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import movieRoutes from './routes/movies/movies.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI || '')
  .then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection error:', error));

// Registrar as rotas dos filmes com o prefixo /api
app.use('/api', movieRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
