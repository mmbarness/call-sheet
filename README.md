# Call Sheet

Data visualizer meant to illustrate any film director’s closest collaborators.

## Overview

Intended to give the user a more complete picture of film director's patterns in collaboration. Through the bubble chart, the website renders in visual language the working habits of a chosen director, revealing whether they tend to work with the same cast and crew or not. 

## Stack: Node/D3/VanillaJS

Home Court utilizes React and Redux to create the user interface and populate it with the appropriate data. Home Court utilizes CSS to style all of its React components. 

### Features of note
* Leverages the tmdb movie database api to enable users to search for and compare bubble charts representing a given director’s closest collaborators. <br/> 

```
export const searchPerson = async(name, role = 'Directing') => {
  const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${name.replace(' ', '%20')}&page=1&include_adult=false`
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
    ? (person = json.results.filter(person => RegExp(`\\b${name}\\b`, 'gi').test(person.name) && person.popularity > 1) //filter out names that dont match (case-insensitive)
      .sort((a,b) => b.popularity - a.popularity)) //results might return sorted by popularity by default, but just to make sure
    : (person = json.results[0])
  person.length === 0 ? person = json.results[0] : person 
  return ((Array.isArray(person) && person.length > 0) ? person[0] : person) // if the filters were enough to pare "person" down to single person, returns that person, else returns the most popular. should prolly be refactored longterm
}
```
* Entirely custom search feature with regex testing of queries for robust error prevention.
* Builds a JSON dataset from the tmdb api call that is then relied upon by D3 to generate the bubble chart that is the cornerstone of the website.
* Custom HTML element generation functions, like the one shown below. (I would argue) clever structuring to enable clear and effective customization of, in this case, the div being generated, so that repetitive lines needs not be written to set the newly created element where it needs to be placed, to set its distinguishing id's or classnames, etc. 

```
 const addDiv = ({append, type, text, innerText = false}) => { 
        const newDiv = document.createElement('div');
        newDiv.setAttribute(`${type}`, `${text}`)
        append(newDiv);
        if (innerText) {newDiv.innerText = innerText}
        return newDiv 
    }
```

![Image of Call Sheet](https://call-sheet.s3.amazonaws.com/Call-Sheet-SS.png)
