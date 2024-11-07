import axios from 'axios';

const OMDB_API_URL = 'http://www.omdbapi.com/';


// Lista de IDs de filmes vencedores do Oscar (exemplo inicial)
export async function fetchMovieDetailsFromIMDB(title: string) {
  try {
    const response = await axios.get(OMDB_API_URL, {
      params: {
        i: process.env.OMDB_API_I,
        apikey: process.env.OMDB_API_KEY,
        t: title,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do OMDb:', error);
    throw error;
  }
}
