import "regenerator-runtime/runtime";
const api_key = "9c9d46fba5cd7cda8a027831ee64f45e"

const movie_title = 'The Interpreter';

const movie_url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${movie_title}&page=1&include_adult=false`
let movie_id

async function getMovie(url = movie_url) {
  const response = await fetch(url, {
    method: 'GET',
  })
  return response.json(); 
}

async function getMovieCredits(url = 0) {
  let movie = await getMovie()
  let credits_url = `https://api.themoviedb.org/3/movie/${movie.results[0].id}/credits?api_key=${api_key}&language=en-US`
  const response = await fetch(credits_url, {
    method: 'GET',
  })
  return response.json(); 
}


console.log(getMovieCredits())
