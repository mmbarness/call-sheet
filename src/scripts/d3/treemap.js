import * as d3 from 'd3'
import { makeBubbleContainer } from './bubbleStuff'
import { colorSetter, storageChecker } from '../utils/d3/d3_utils'
import * as treemapUtils from '../utils/d3/treemap_utils'

export const treeMap = async (searchQuery) => {

    storageChecker(searchQuery, 'currentChartData') ? await new Promise(resolve => setTimeout(resolve, 2000)) : null 

    let localData = JSON.parse(localStorage.getItem('currentChartData'))
    localData = (localData.children).filter(directorObj => directorObj.name === searchQuery)

    let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 100 - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom;

    const addContainer = () => {
      const bubbleChart = (document.getElementById("bubble-chart") === null) ? makeBubbleContainer(true) : document.getElementById("bubble-chart")
      const iconContainer = document.createElement("div")
      iconContainer.setAttribute("id", "treemap-icons-container")
      bubbleChart.insertAdjacentElement('beforebegin',iconContainer);
    }

    const addDiv = () => {
        const iconsContainer = document.getElementById("treemap-icons-container")
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", `${searchQuery.replace(" ", "-")}-treemap`)
        newDiv.setAttribute("class", "d3div")
        iconsContainer.appendChild(newDiv);
    }

    (document.getElementById("treemap-icons-container") === null) ? addContainer() : null 

    addDiv()

// append the svg object to the body of the page
    const svg = d3.select(`#${searchQuery.replace(" ", "-")}-treemap`)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", `${searchQuery}-treemap-icon`)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

// read json data
    treemapUtils.titleizeTreemap(searchQuery)
    // Give the data to this cluster layout:

    const root = d3.hierarchy(localData[0]).sum(function(d){return d.value}) // Here the size of each leave is given in the 'value' field in input data

    const colorArray = colorSetter();
    const color = d3.scaleOrdinal()
        .domain(colorArray)
        .range(["#402D54", "#D18975", "#8FD175"])

    const opacity = d3.scaleLinear()
        .domain([0, 2000])
        .range([.5,1])

    // Then d3.treemap computes the position of each element of the hierarchy
    d3.treemap()
        .size([width, height])
        .padding(2)
        .paddingInner(3)
        (root)

    // use this information to add rectangles:
    svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr('x', function (d) { return d.x0; })
        .attr('y', function (d) { return d.y0; })
        .attr('width', function (d) {return d.x1 - d.x0; })
        .attr('height', function (d) { return d.y1 - d.y0; })
        .attr('class', d => treemapUtils.rectClassParser(d.parent.data.name))
        .style("stroke", "black")
        .style("fill", function (d, i) {
            return color(d.parent.data.name);
        })
        .on("click", e => treemapUtils.chartClicker(e))
        .style("opacity", function(d){return opacity(d.data.value)})

}

