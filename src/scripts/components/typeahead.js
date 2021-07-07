import { creditsParser } from "../tmdb/data_builder";
import { deleteLocalStorage, manageLocalStorage } from "../utils/browser_utils";
import { addDiv } from "../utils/basicElementGen";
import '../../styles/search.scss'
import { deleteSVGs, fetchIcon } from "../utils/d3/d3_utils";
import { d3Relay } from "../d3/d3Relay";
import { clearTitle, waitOrNot } from "./bubbleStuff";
import { addSearch } from "../utils/searchUtils";

export const addTypeahead = () => {
    const makeTypeahead = document.createElement('input');
    makeTypeahead.setAttribute("type", "typeahead")
    makeTypeahead.setAttribute("id", "typeaheadBar")
    makeTypeahead.setAttribute("placeholder", "look up a director - enter to search")
    const addDivParams = {
        append: (div) => document.body.appendChild(div),
        type: "id", 
        text: "typeahead-container"}
    let typeaheadContainer = addDiv(addDivParams)
    typeaheadContainer.appendChild(makeTypeahead);
    addClearSearchButton(typeaheadContainer);
}
