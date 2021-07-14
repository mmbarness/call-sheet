import { API_KEY } from "./api_utils";
import { addDiv } from "./basicElementGen";
import { fetchIcon } from "./d3/d3_utils";

export const addClearSearchButton = (searchContainer) => {
    const clearSearchButton = document.createElement('button');
    clearSearchButton.setAttribute("id", "clearSearchButton");
    clearSearchButton.textContent = "reset search"
    clearSearchButton.style.display = "none"
    searchContainer.appendChild(clearSearchButton)
}
export const addSearch = (props) => {
    const makeSearch = document.createElement('input');
    makeSearch.setAttribute("type", "search")
    makeSearch.setAttribute("id", "searchBar")
    makeSearch.setAttribute("placeholder", "look up a director - enter to search")
    const addDivParams = {
        append: (div) => props.container.appendChild(div),
        type: "class", 
        text: "search-container"}
    let searchContainer = addDiv(addDivParams)
    searchContainer.appendChild(makeSearch);
    addClearSearchButton(searchContainer);
    return makeSearch
}

export const handleNoSearch = async (searchBar, errorObj) => {
    const icon = fetchIcon(false) //tells fetchIcon method to not delete the bubble chart, just set it's display attr to none
    icon.style.display = "block"
    await new Promise(resolve => setTimeout(resolve, 1000))
    const error = document.createElement('div')
    error.id = "search-error-div";
    searchBar.insertAdjacentElement('beforebegin', error);
    searchBar.value = ""
    searchBar.placeholder = ""
    icon.style.display = "none"
    error.textContent = "Check your spelling! (Are they definitely a director?)"
    await new Promise(resolve => setTimeout(resolve, 1750))
    error.text = ""
    error.remove();
    searchBar.placeholder = "look up a director - enter to search"
    document.getElementById("bubble").style.display = "block";
}

export const checkForOpenChart = () => {

}

export const queryChecker = async (query) => {
    if (query.match(/\s/) === null) {return {error: "not a full name!"}}
    const searchUrl = `https://api.themoviedb.org/3/search/person?api_key=${API_KEY}&language=en-US&query=${query.replace(' ', '%20')}&page=1&include_adult=false`
    let personResults
    let json
    query.charAt(0).toUpperCase()
    try {
        personResults = await fetch(searchUrl, {
                                method: 'GET'
                            })
        json = await personResults.json()
        } catch(err){
            console.log(err)
        }
    let filtered = []
    Object.values(json.results).forEach(person => {
        const name = person.name; 
        let pattern = new RegExp(`.*\\b${query}\\b.*`);
        if ((name.match(pattern) !== null) && (person.popularity >= 1)) {filtered.push(person)}
    })
    if (filtered.length > 0){
        return {error: 'none'}
    } else {
        return {error: 'no one of note found'}
    }
}

export const capitalizeCorrectly = (string) => {
    if (string.match(/\s/)){
        let stringArr = string.split(" ");
        let capped = stringArr.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        return capped.join(" ")
    } else {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}