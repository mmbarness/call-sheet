//cast-related data processing

export const genCastArr = (movies, input) => {
    let cast = []
    movies.forEach(movie => {
       movie.cast.forEach(person => {
            if (!(RegExp(`\\b${input}\\b`, 'gi').test(person.name))){ //tests for directors name, so that they're not included
                cast.push({id: person.id, name: person.name, role: person.known_for_department, prof_path: person.profile_path})
            }
        })
    })
    return cast; 
}

export const genCastObj = (castArr) => {
    let castObj = {}
    castArr.forEach(person => {
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
    return castObj;
}