let matches = []
Object.values(json.results).forEach(person => {
    const name = person.name; 
    let pattern = new RegExp(`.*\\b${query}\\b.*`);
    console.log(name.match(pattern) !== null);
    if (name.match(pattern) !== null) {matches.push(person)}
})
