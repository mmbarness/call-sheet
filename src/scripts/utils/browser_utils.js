import { setBubbleChartStorage, appendBubbleChartStorage} from "./d3/bubble_utils"
import { appendChartStorage, setChartStorage} from "./d3/treemap_utils"

export const setLocalChartStorage = (data) => {
    const ftfy = setChartStorage(data)
    localStorage.setItem("currentChartData", JSON.stringify(ftfy))
}

export const appendLocalChartStorage = (data) => {
    const curStorage = JSON.parse(localStorage.currentChartData)
    const newStorage = appendChartStorage(curStorage, data)
    localStorage.setItem("currentChartData", JSON.stringify(newStorage))
}

export const setLocalBubbleChartStorage = (data) => {
    const ftfy = setBubbleChartStorage(data)
    localStorage.setItem("currentBubbleChartData", JSON.stringify(ftfy))
}

export const appendLocalBubbleChartStorage = (data) => {
    const curStorage = JSON.parse(localStorage.currentBubbleChartData)
    const newStorage = appendBubbleChartStorage(curStorage, data)
    localStorage.setItem("currentBubbleChartData", JSON.stringify(newStorage))
}

export const deleteLocalStorage = () => {
    localStorage.clear()
}

export const manageLocalStorage = (data) => {
    if (localStorage.getItem("currentChartData") === null) { setLocalChartStorage(data)} else {appendLocalChartStorage(data)}
    if (localStorage.getItem("currentBubbleChartData") === null) {setLocalBubbleChartStorage(data)} else {appendLocalBubbleChartStorage(data)}
}
