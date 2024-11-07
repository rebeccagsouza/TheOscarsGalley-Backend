import express, { Request, Response } from 'express';
import { processOscarWinnersForYear, updateOscarMoviesFromImdb } from '../../api/movies/movies.api'
import { fetchMovieDetailsFromIMDB } from '../../services/imdbServices'
import Movie from '../../models/movie.model';

const router = express.Router();


// Rota para salvar filmes vencedores por ano
router.post('/movies/oscar-winners/save/year/:year', async (req: Request, res: Response) => {
  const { year } = req.params;
  const jsonData = req.body; 

  try {
    const { addedCount, updatedCount } = await processOscarWinnersForYear(year, false, jsonData);
    res.status(200).json({ message: `Filmes vencedores para o ano ${year} processados com sucesso!`, addedCount, updatedCount });
  } catch (error: any) {
    console.error('Erro ao salvar filmes vencedores:', error);
    res.status(500).json({ error: `Erro ao salvar filmes vencedores: ${error.message}` });
  }
});

// Rota para update filmes vencedores por ano
router.put('/movies/oscar-winners/update/year/:year', async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    const { addedCount } = await processOscarWinnersForYear(year);
    res.status(200).json({ message: `Filmes vencedores do ano ${year} salvos com sucesso!`, addedCount });
  } catch (error: any) {
    console.error('Erro ao salvar filmes vencedores:', error);
    res.status(500).json({ error: `Erro ao salvar filmes vencedores: ${error.message}` });
  }
});

// Rota para deletar filmes vencedores por ano
router.delete('/movies/oscar-winners/delete/year/:year', async (req: any, res: any) => {
  const year = parseInt(req.params.year);
  if (isNaN(year)) return res.status(400).json({ error: 'Ano inválido' });

  try {
    const result = await Movie.deleteMany({ year });
    res.status(200).json({ message: `Filmes do ano ${year} excluídos com sucesso`, deletedCount: result.deletedCount });
  } catch (error: any) {
    console.error('Erro ao excluir filmes por ano:', error);
    res.status(500).json({ error: `Erro ao excluir filmes por ano: ${error.message}` });
  }
});

// Rota para atualizar filmes com informações do imdbb
router.put('/movies/oscar-winners/update-imdb/year/:year', async (req: Request, res: Response) => {
  const { year } = req.params;

  try {
    console.log(`Iniciando atualização dos filmes do ano ${year}...`);
    const result = await updateOscarMoviesFromImdb(year);
    res.json({ message: `Atualização concluída para o ano ${year}`, ...result });
  } catch (error) {
    console.error(`Erro ao atualizar filmes do ano ${year}:`, error);
    res.status(500).json({ message: `Erro ao atualizar filmes do ano ${year}`, error });
  }
});


// Rota para buscar informações de um filme pelo título
router.get('/movies/imdb/:imdbID', async (req: any, res: any) => {
  const { imdbID } = req.params;

  try {
    // Chama a função para buscar os detalhes do filme no OMDb
    const movieData = await fetchMovieDetailsFromIMDB(imdbID);

    if (!movieData || movieData.Response === 'False') {
      return res.status(404).json({ message: 'Filme não encontrado no OMDb.' });
    }

    // Retorna os dados do filme
    res.json(movieData);
  } catch (error) {
    console.error(`Erro ao buscar dados do filme com IMDb ID ${imdbID}:`, error);
    res.status(500).json({ message: 'Erro ao buscar dados do filme.' });
  }
});

export default router;
