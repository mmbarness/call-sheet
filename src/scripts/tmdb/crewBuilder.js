//crew-related data processing

export const genCrewArr = (movies, input) => {
    let crew = []
    movies.forEach(movie => {
        movie.crew.forEach(person => {
           if (!(RegExp(`\\b${input}\\b`, 'gi').test(person.name))){ //tests for directors name, so that they're not included
                crew.push({
                    id: person.id, 
                    name: person.name, 
                    job: person.job, 
                    known_for: person.known_for_department, 
                    prof_path: person.profile_path
                })
           }
        })
    })
    return crew;
}

export const genCrewObj = (crewArr) => {
    let crewObj = {}
    crewArr.forEach(person => {
        let name = person.name 
        if (crewObj[name] === undefined) {
            crewObj[name] = {
                "id": person.id,
                "count": 1,
                "job": person.job,
                "known_for": person.known_for,
                "prof_path": person.prof_path
            }
        } else {
            crewObj[name]["count"] += 1
        }
    })
    return crewObj; 
}