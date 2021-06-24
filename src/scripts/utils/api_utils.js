const api_key = "9c9d46fba5cd7cda8a027831ee64f45e"

export const searchPerson = async(name, role = 'Directing') => {
  const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${api_key}&language=en-US&query=${name.replace(' ', '%20')}&page=1&include_adult=false`
  let personResults
  let json
  try {
    personResults = await fetch(searchUrl, {
                            method: 'GET'
                        })
    json = await personResults.json()
    } catch(err){
        console.log(err)
    }
  let person
  (json.results.length > 1) 
    ? (person = json.results.filter(person => RegExp(`\\b${name}\\b`, 'gi').test(person.name)) //filter out names that dont match (case-insensitive)
      .sort((a,b) => b.popularity - a.popularity)) //results might return sorted by popularity by default, but just to make sure
    : (person = json.results[0])
  person.length === 0 ? person = json.results[0] : person 
  return ((Array.isArray(person) && person.length > 0) ? person[0] : person) // if the filters were enough to pare "person" down to single person, returns that person, else returns the most popular. should prolly be refactored longterm
}

export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const getFilmography  = async(input, role="Director") => {
  //can take in either a person's id or name- if name is provided, will need to first search for the person. for now, assumes the first result is the correct result
  let queryReturn
  let searchVar = (typeof input === 'string') ? await (searchPerson(input)).then(resp => {queryReturn = resp; return(resp.id)}) : input
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
  let resultsObj = {}
  let creditsObj = {}
  sleep(100).then(async () => 
  resultsObj = await results.forEach(async(movie)=>{ 
    resultsObj[movie.id] = movie
    let credits = await getMovieCredits(movie.id).then(resp => {
      return ({ //only returning the top half of a movies cast/crew, since they're ordered by significance
        cast: (resp.cast).slice(0, resp.cast.length / 2),
        crew: (resp.crew).slice(0, resp.crew.length * .75)
      })
    })
    creditsObj[movie.id] = credits 
    })
  )
  return {director: queryReturn, movies: resultsObj, credits: creditsObj}
}

export const searchMovie = async (movieTitle) => {
  //format movieTitles like 'The+Interpreter'
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${movieTitle.replace(' ','%20')}&page=1&include_adult=false`
  const movieResults = await fetch(searchUrl, {
    method: 'GET',
  })
  return movieResults.json(); 
}

export const getMovieCredits = async (input) => {
  let searchVar = (input === typeof 'string') ? await (searchMovie(input)).then(resp => {return(resp.results[0].id)}) : input
  const credits_url = `https://api.themoviedb.org/3/movie/${searchVar}/credits?api_key=${api_key}&language=en-US`
  let credits = await fetch(credits_url, {
    method: 'GET',
  })
  return credits.json();
}

