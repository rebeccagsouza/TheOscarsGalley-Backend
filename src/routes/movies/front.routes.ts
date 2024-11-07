import express, { Request, Response } from 'express';
import Movie from '../../models/movie.model';

const router = express.Router();

// Rota para listar filmes com filtros, offset e limit
router.get('/tog', async (req: Request, res: Response) => {
    try {
      const { offset = 0, limit = 10, sorter } = req.query;
      const filter = {}; // Ajuste conforme os filtros necessários
  
      // Critério de ordenação padrão
      let sortCriteria: [string, 1 | -1][] = [
        ['year', -1],
        ['imdbRating', -1],
        ['title', -1],
      ];
  
      // Se o `sorter` for especificado, redefine o critério de ordenação
      if (typeof sorter === 'string') {
        const [sortField, sortOrder] = sorter.split(',');
        const order = sortOrder === 'asc' ? 1 : -1;
        sortCriteria = [[sortField, order]];
      }
  
      // Busca no banco de dados com paginação, filtro e ordenação
      const movies = await Movie.find(filter)
        .sort(sortCriteria)
        .skip(Number(offset))
        .limit(Number(limit));
  
      res.status(200).json(movies);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      res.status(500).json({ error: 'Erro ao buscar filmes' });
    }
  });

  
  export default router;
  