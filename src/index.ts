import "regenerator-runtime/runtime";
import './styles/index.scss'
import './styles/d3.css'
import {addDiv} from "./scripts/utils/basicElementGen";
import { deleteLocalStorage, manageLocalStorage } from "./scripts/utils/browser_utils";
import { creditsParser } from "./scripts/tmdb/data_builder";
import { genTopBar } from "./scripts/components/top_bar";
import { infoModal } from "./scripts/components/info_modal";
import { treeMap } from "./scripts/d3/treemap";
import { bubbleMaker } from "./scripts/d3/bubble";

const directorPreload = (directors :string[]) => {
    directors.forEach((director :string) => {
        creditsParser(director, 'Director').then(resp => { 
            manageLocalStorage({
                cast: resp.castFamiliars,
                crew: resp.crewFamiliars,
                counter: resp.counter, 
                searchQuery: resp.searchQuery,
            })
            treeMap(director);
        })
    })

}

const pageLoader = async () => {
    infoModal();

    addDiv({
        append: (div :HTMLElement) => document.body.appendChild(div),
        type: "id",
        text: "d3-container"
    })

    directorPreload(['claire denis','michael mann', 'spike lee' ])

    await new Promise(resolve => setTimeout(resolve, 2000))

    bubbleMaker('claire denis')
}

window.onload = () => {
    deleteLocalStorage();

    genTopBar();

    pageLoader();
}

