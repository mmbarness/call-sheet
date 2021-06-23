import "regenerator-runtime/runtime";
import * as tmdb from '../utils/api_utils'
import * as _ from 'underscore'
import { filter } from "underscore";

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

const filterToFamiliars = (obj) => {
    let arr = Object.entries(obj);
    const filtered = arr.filter(([key,value]) => value > 1)
    let returnObj = {}
    filtered.forEach((a => {
        returnObj[a[0]] = a[1]
    }))
    return returnObj
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
       movie.crew.forEach(person => {
           if (!(RegExp(`\\b${input}\\b`, 'gi').test(person.name))){
               crew.push(person.name)
           }
        })
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
    const castFamiliars = filterToFamiliars(castObj)
    const castFamiliarsLength = (Object.entries(castFamiliars)).length 
    const crewFamiliars = filterToFamiliars(crewObj)
    const crewFamiliarsLength = (Object.entries(crewFamiliars)).length 

    counter.allCastmembersEver = Object.values(castObj).length
    counter.familiarCastmembers = castFamiliarsLength 
    counter.familiarCastPercentage = `${parseFloat((Math.abs(castFamiliarsLength) / counter.allCastmembersEver) * 100).toFixed(2)}%`
    counter.familiarCrewMembers = crewFamiliarsLength
    counter.allCrewmembersEver = Object.values(crewObj).length;
    counter.familiarCrewPercentage = `${parseFloat(Math.abs(crewFamiliarsLength / counter.allCrewmembersEver) * 100).toFixed(2)}%`

    return { 
        movies: allFilmCredits, 
        allCast: cast, 
        allCastUniques: castObj, 
        castFamiliars: castFamiliars,
        allCrew: crew, 
        allCrewUniques: crewObj,
        crewFamiliars: crewFamiliars,
        counter: counter,
        searchQuery: input}
}


