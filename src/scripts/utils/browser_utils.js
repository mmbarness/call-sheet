import { appendStorage, setStorage } from "./d3_utils"

export const setLocalStorage = (data, searchQuery) => {
    const ftfy = setStorage(data, searchQuery)
    localStorage.setItem("currentChartData", JSON.stringify(ftfy))
    
}

export const appendLocalStorage = (data, searchQuery) => {
    const curStorage = JSON.parse(localStorage.currentChartData)
    const newStorage = appendStorage(curStorage, data, searchQuery)
    localStorage.setItem("currentChartData", JSON.stringify(newStorage))
}

export const deleteLocalStorage = () => {
    localStorage.clear()
}

export const manageLocalStorage = (data, searchQuery) => {
    (localStorage.getItem("currentChartData") === null) 
        ? setLocalStorage(data, searchQuery)
        : appendLocalStorage(data, searchQuery) 
}