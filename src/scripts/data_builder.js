import "regenerator-runtime/runtime";
import * as tmdb from './utils'
import * as _ from 'underscore'



export const allCredits = async (searchQuery, role = "Director") => { //cast and crew of every movie a director's made
    let input = searchQuery.name || searchQuery.nameId
    let filmography = await tmdb.getFilmography(input, role)
    let filmObj = {}
    await new Promise(resolve => setTimeout(resolve, 1000))
    for (const id in filmography.movies) {
        let film = filmography.movies[id]
        filmObj[film.id] = {
            title: film.title,
            id: film.id,
            overview: film.overview,
            genre_ids: film.genre_ids,
            credit_id: film.credit_id,
            cast: filmography.credits[film.id].cast,
            crew: filmography.credits[film.id].crew
        }
    }
    return filmObj
}

export const creditsParser = async (input, role = "Director") => {
    let cast = []
    let castObj = {}
    let crew = []
    let crewObj = {}
    let counter = {}
    let allFilmCredits = await allCredits({ name: input }, role).then(resp => (resp))
    let arr = (Object.values(allFilmCredits))

    arr.forEach(movie => {
       movie.cast.forEach(person => cast.push(person.name))
       movie.crew.forEach(person => crew.push(person.name))
    })

    cast.forEach(person => {
        if (castObj[person] === undefined) {
            castObj[person] = 1
        } else {
            castObj[person] += 1
        }
    })
    crew.forEach(person => {
        if (crewObj[person] === undefined) {
            crewObj[person] = 1
        } else {
            crewObj[person] += 1
        }
    })
    counter.castUnique = Object.values(castObj).length
    counter.castAll = cast.length;
    counter.familiarCast = `${parseFloat((Math.abs((counter.castUnique - counter.castAll)) / counter.castAll) * 100).toFixed(2)}%`
    counter.crewUnique = Object.values(crewObj).length;
    counter.crewAll = crew.length;
    counter.familiarCrew = `${parseFloat((Math.abs((counter.crewUnique - counter.crewAll)) / counter.crewAll) * 100).toFixed(2)}%`

    return { movies: allFilmCredits, allCast: cast, allCastUniques: castObj, allCrew: crew, allCrewUniques: crewObj, counter: counter }
}


