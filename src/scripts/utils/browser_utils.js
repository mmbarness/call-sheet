export const appendLocalStorage = (data) => {
    localStorage.setItem("currentChartData", JSON.stringify({counter: data.counter, searchQuery: data.searchQuery}))
}

export const deleteLocalStorage = () => {
    localStorage.removeItem("currentChartData")
}