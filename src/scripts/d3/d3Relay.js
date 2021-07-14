import { bubbleMaker } from "./bubble"
import { treeMap } from "./treemap"

export const d3Relay = (searchQuery) => {
    bubbleMaker(searchQuery);
    treeMap(searchQuery);
}