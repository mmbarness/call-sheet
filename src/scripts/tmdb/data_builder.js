import "regenerator-runtime/runtime";
import * as tmdb from '../utils/api_utils'
import * as _ from 'underscore'
import { filter } from "underscore";

export const allCredits = async (searchQuery, role = "Director") => { //cast and crew of every movie a director's made
    let input = searchQuery.name || searchQuery.nameId
    let filmography = await tmdb.getFilmography(input, role)
    let filmsObj = {director: "", movies: {}}
    await new Promise(resolve => setTimeout(resolve, 1000))
    for (const id in filmography.movies) {
        let film = filmography.movies[id]
        filmsObj.movies[film.id] = {
            title: film.title,
            id: film.id,
            overview: film.overview,
            genre_ids: film.genre_ids,
            credit_id: film.credit_id,
            cast: filmography.credits[film.id].cast,
            crew: filmography.credits[film.id].crew
        }
    }
    filmsObj.director = filmography.director
    return filmsObj
}

const filterToFamiliars = (obj) => {
    let arr = Object.entries(obj);
    const filtered = arr.filter(([key,value]) => value.count > 1)
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
    let arr = (Object.values(allFilmCredits.movies))

    arr.forEach(movie => {
       movie.cast.forEach(person => {
            if (!(RegExp(`\\b${input}\\b`, 'gi').test(person.name))){
                cast.push({id: person.id, name: person.name, role: person.known_for_department, prof_path: person.profile_path})
            }
        })
       movie.crew.forEach(person => {
           if (!(RegExp(`\\b${input}\\b`, 'gi').test(person.name))){
               crew.push({id: person.id, name: person.name, role: person.known_for_department, prof_path: person.profile_path})
           }
        })
    })

    cast.forEach(person => {
        let name = person.name 
        if (castObj[name] === undefined) {
            castObj[name] ={
                "id": person.id,
                "count": 1,
                "role": person.role,
                "prof_path": person.prof_path,
            }
        } else {
            castObj[name]["count"] += 1
        }
    }) 

    crew.forEach(person => {
        let name = person.name 
        if (crewObj[name] === undefined) {
            crewObj[name] = {
                "id": person.id,
                "count": 1,
                "role": person.role,
                "prof_path": person.prof_path
            }
        } else {
            crewObj[name]["count"] += 1
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
        movies: allFilmCredits.movies, 
        allCast: cast, 
        allCastUniques: castObj, 
        castFamiliars: castFamiliars,
        allCrew: crew, 
        allCrewUniques: crewObj,
        crewFamiliars: crewFamiliars,
        counter: counter,
        searchQuery: {input: input, searchResults: allFilmCredits.director}
    }
}


