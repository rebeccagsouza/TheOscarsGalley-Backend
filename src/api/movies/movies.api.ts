
import { fetchMovieDetailsFromIMDB } from '../../services/imdbServices'; 

import path from 'path';
import fs from 'fs';
import Movie from '../../models/movie.model';

// Função auxiliar para processar e salvar/atualizar filmes vencedores de um ano específico
export async function processOscarWinnersForYear(
  year: string,
  updateExisting = false,
  jsonData?: any
) {
  console.log(`Iniciando processamento para o ano ${year}...`);

  // Verifica se jsonData foi passado como argumento
  let categories;
  if (jsonData) {
    console.log(`Usando JSON fornecido pelo frontend para o ano ${year}`);
    categories = jsonData[year];
  } else {
    console.log(`Carregando arquivo JSON estático para o ano ${year}`);
    const jsonFilePath = path.resolve(__dirname, `../../data/years/oscars_${year}.json`);

    if (require.cache[require.resolve(jsonFilePath)]) {
      delete require.cache[require.resolve(jsonFilePath)];
      console.log(`Cache limpo para o arquivo JSON: ${jsonFilePath}`);
    }

    if (!fs.existsSync(jsonFilePath)) {
      console.error(`Arquivo JSON para o ano ${year} não encontrado.`);
      throw new Error(`Arquivo JSON para o ano ${year} não encontrado.`);
    }

    const fileContent = fs.readFileSync(jsonFilePath, 'utf-8');
    const jsonDataFromFile = JSON.parse(fileContent);
    categories = jsonDataFromFile[year];
  }

  if (!Array.isArray(categories)) {
    console.error(`Formato inesperado no JSON: esperado um array em jsonData[${year}].`);
    throw new Error(`Formato inválido no JSON para o ano ${year}.`);
  }

  let addedCount = 0;
  let updatedCount = 0;

  const moviesMap: {
    [imdbId: string]: {
      title: string;
      title_pt: string;
      imdbId: string;
      year: number;
      nominee_category: Set<string>;
      nominee_category_pt: Set<string>;
      winner_category: Set<string>;
      winner_category_pt: Set<string>;
    };
  } = {};

  for (const category of categories) {
    const { category: categoryEn, category_pt: categoryPt, winner, oscars_year } = category;

    if (oscars_year !== parseInt(year)) {
      console.log(`Ignorando categoria de ano diferente: ${oscars_year}`);
      continue;
    }

    console.log(`Processando categoria: ${categoryEn} (${categoryPt})`);
    for (const movie of category.movies) {
      console.log(`Verificando filme: ${movie.title} (imdbId: ${movie.imdbId})`);

      const imdbId = movie.imdbId;
      const existingMovie = await Movie.findOne({ imdbId, year: parseInt(year) });

      if (existingMovie && !updateExisting) {
        console.log(`Filme já existe para o ano ${year}: ${movie.title} (${imdbId}), ignorando.`);
        continue;
      }

      if (!moviesMap[imdbId]) {
        moviesMap[imdbId] = {
          title: movie.title,
          title_pt: movie.title_pt,
          imdbId: movie.imdbId,
          year: oscars_year,
          nominee_category: new Set(),
          nominee_category_pt: new Set(),
          winner_category: new Set(),
          winner_category_pt: new Set(),
        };
      }

      moviesMap[imdbId].nominee_category.add(categoryEn);
      moviesMap[imdbId].nominee_category_pt.add(categoryPt);

      if (movie.title === winner) {
        moviesMap[imdbId].winner_category.add(categoryEn);
        moviesMap[imdbId].winner_category_pt.add(categoryPt);
      }
    }
  }

  for (const imdbId in moviesMap) {
    const movieData = moviesMap[imdbId];
    const newMovie = new Movie({
      title: movieData.title,
      title_pt: movieData.title_pt,
      imdbId: movieData.imdbId,
      year: movieData.year,
      awards: {
        nominee_category: Array.from(movieData.nominee_category),
        nominee_category_pt: Array.from(movieData.nominee_category_pt),
        winner_category: Array.from(movieData.winner_category),
        winner_category_pt: Array.from(movieData.winner_category_pt),
      },
    });
    await newMovie.save();
    addedCount++;
  }

  console.log(`Filmes adicionados: ${addedCount}, Filmes atualizados: ${updatedCount}`);
  return { addedCount, updatedCount };
}


// Função auxiliar para atualizar filmes de um ano específico com dados do TMDB
export async function updateOscarMoviesFromImdb(year: string) {
  const movies = await Movie.find({ year: parseInt(year) });
  let updatedCount = 0;

  for (const movie of movies) {
    try {
      // Chama a função para buscar os detalhes do filme no OMDb
      const imdbData = await fetchMovieDetailsFromIMDB(movie.title);

      if (imdbData && imdbData.Response !== 'False') {
        // Atualiza o filme com os dados obtidos do OMDb
        movie.director = imdbData.Director || 'unknown';
        movie.writer = imdbData.Writer || 'unknown';
        movie.actors = imdbData.Actors || 'unknown';
        movie.plot = imdbData.Plot || 'unknown';
        movie.poster = imdbData.Poster || 'unknown';
        movie.ratings = imdbData.Ratings || [];
        movie.metascore = imdbData.Metascore || 'unknown';
        movie.imdbRating = imdbData.imdbRating || 'unknown';

        await movie.save();
        updatedCount++;
      }
    } catch (error) {
      console.error(`Erro ao atualizar o filme ${movie.title}:`, error);
    }
  }

  return { updatedCount };
}
