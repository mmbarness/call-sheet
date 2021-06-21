const api_key = "9c9d46fba5cd7cda8a027831ee64f45e"

export const searchPerson = async(name) => {
  const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&language=en-US&query=${name.replace(' ', '%20')}&page=1&include_adult=false`
  const personResults = await fetch(searchUrl, {
    method: 'GET'
  })
  let json = await personResults.json()
  return json 
  //returns the entire response, no filtering 
}

export const getFilmography  = async(input, role="Director") => {
  //can take in either a person's id or name- if name is provided, will need to first search for the person. for now, assumes the first result is the correct result
  let searchVar = (typeof input === 'string') ? await (searchPerson(input)).then(resp => {return(resp.results[0].id)}) : input
  const searchUrl = `https://api.themoviedb.org/3/person/${searchVar}/movie_credits?api_key=${api_key}&language=en-US`
  const searchResults = await fetch(searchUrl, {
    method: 'GET'
  })
  let searchJson = await searchResults.json()
  let results = await searchJson.crew.filter
    (movie => (movie.job === role) //filter for role passed in from original function call. Director by default
    && (movie.release_date !== "") //"real" movies will have release dates
    && (movie.video !== true)) //"video" field is true when its not a studio film
    .sort((a,b) => {return(new Date(b.release_date) - new Date(a.release_date))}) //sort new->old
  return results 
}

export const searchMovie = async (movieTitle) => {
  //format movieTitles like 'The+Interpreter'
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${movieTitle}&page=1&include_adult=false`
  const movieResults = await fetch(searchUrl, {
    method: 'GET',
  })
  return movieResults.json(); 
}

export const getMovieCredits = async (movieTitle) => {
  const movie = await getMovie(movieTitle)
  const credits_url = `https://api.themoviedb.org/3/movie/${movie.results[0].id}/credits?api_key=${api_key}&language=en-US`
  const credits = await fetch(credits_url, {
    method: 'GET',
  })
  return credits.json(); 
}

