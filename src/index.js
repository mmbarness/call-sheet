import "regenerator-runtime/runtime";
import * as tmdb from '../src/scripts/utils'

const allCredits = async(searchQuery, role="Director") => {
  let input = searchQuery.name || searchQuery.nameId
  let filmography = tmdb.getFilmography(input, role)

  return films;
}

// console.log(allCredits({nameId: 1032}, 'Director'))
// console.log(tmdb.getFilmography('Martin Scorsese', null,'Director'))