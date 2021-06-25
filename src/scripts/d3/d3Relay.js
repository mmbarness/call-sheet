import { sleep } from "../utils/api_utils"
import { titleizeTreemap } from "../utils/d3_utils"
import { bubbleMaker } from "./bubble"
import { treeMap } from "./treemap"

export const d3Relay = (searchQuery, loadingIcon) => {
    // let oldTreemap = document.getElementById("treemap")
    // if (oldTreemap !== null) {oldTreemap.remove()}

    let oldBubble = document.getElementById("bubble-chart")
    if (oldBubble !== null) {oldBubble.remove()}

    sleep(1000).then(() => {
        loadingIcon.style.display = "none"
        bubbleMaker(searchQuery);
        treeMap(searchQuery);
        // titleizeTreemap(searchQuery)
    })
}