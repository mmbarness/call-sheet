import { addDiv } from "./basicElementGen";

export const addClearSearchButton = (searchContainer) => {
    const clearSearchButton = document.createElement('button');
    clearSearchButton.setAttribute("id", "clearSearchButton");
    clearSearchButton.textContent = "reset search"
    clearSearchButton.style.display = "none"
    searchContainer.appendChild(clearSearchButton)
}
export const addSearch = () => {
    const makeSearch = document.createElement('input');
    makeSearch.setAttribute("type", "search")
    makeSearch.setAttribute("id", "searchBar")
    makeSearch.setAttribute("placeholder", "look up a director - enter to search")
    const addDivParams = {
        append: (div) => document.body.appendChild(div),
        type: "class", 
        text: "search-container"}
    let searchContainer = addDiv(addDivParams)
    searchContainer.appendChild(makeSearch);
    addClearSearchButton(searchContainer);
}

