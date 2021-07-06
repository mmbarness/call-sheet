import * as d3 from 'd3'
import { clearTitle, loadingIcon, makeBubbleContainer, titleizeBubbleChart, useIcon, waitOrNot } from '../components/bubbleStuff'
import { roleHandler } from '../utils/d3/bubble_utils'
import { clearChildren, storageChecker } from '../utils/d3/d3_utils'


export const bubbleMaker = async (searchQuery) => {

    storageChecker(searchQuery, 'currentBubbleChartData') ? await new Promise(resolve => setTimeout(resolve, 1000)) : null 

    let localData = JSON.parse(localStorage.getItem('currentBubbleChartData'))

    localData = (localData.children).filter(directorObj => directorObj.name === searchQuery)

    let dataset = {name: 'favorites', children: (localData[0].children[0].children).concat(localData[0].children[1].children)}
    let oldChart = document.getElementById("bubble")
    if (oldChart !== null) {oldChart.remove()}

    const bubbleContainer = (document.getElementById('bubble-chart')===null) ? makeBubbleContainer(true) : (document.getElementById('bubble-chart') ) //true to indicate I dont want it to return the new element
    clearTitle();
    titleizeBubbleChart(searchQuery); 

    const diameter = (document.getElementById("bubble-chart")).clientHeight;;

    const color = d3.scaleOrdinal()
        .domain(['cast', 'crew'])
        .range(["#402D54", "#D18975", "#8FD175"])

    const bubble = d3.pack(dataset)
        .size([diameter, diameter])
        .padding(1.5);

    const svg = d3.select("#bubble-chart")
        .append("svg")
        .attr("width", diameter)
        .attr("height", diameter)
        .attr("id", "bubble")
        .attr("class", "d3div")

    const nodes = d3.hierarchy(dataset)
        .sum(function(d) {return d.value; });

    const tooltip = d3.select("#bubble-chart")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")
        .style("z-index", 1000)
        .style("position", "absolute")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    const showTooltip = (d) => {
        let data = d.currentTarget.__data__.data
        let linkUrl= `https://www.themoviedb.org/person/${data.id}-${data.name.replace(" ", "-")}`   
        // link.textContent = `${data.name}, ${data.job}`

        let info = () => {
            if (data.job){
                return (`${data.name}, ${data.job}`)
            } else {
                return (`${data.name}`)
            }
        }

        clearChildren(tooltip)

        tooltip
            .transition()
                .duration(200)
        tooltip
            .style("opacity", 1)
            // .text(info())
            .style("left", d.pageX + "px")
            .style("top", d.pageY + "px")

        const link = tooltip
            .append("a")
            .attr("href", linkUrl)
            .html(info())
            .attr("id", "tooltip-link")
            .attr("target", "_blank")
            .attr("rel", "noopener noreferrer")
        

        const closeIt = tooltip
            .append("span")
            .html("&times;")
            .on("click", hideTooltip)
    }

    const hideTooltip = (d) => {
        clearChildren(tooltip);
        tooltip
            .transition()
                // .duration(00)
                .style("opacity", 0)
    }

    const node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node bubbles")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        })   

    node.append("title")
        .text(function(d) {
            return d.data.name
        })
        .attr("class", "no-pointer-events")   

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .on("click", d => {
            window.open(d.path[1].childNodes[0].href.baseVal,'_blank')
        })
        .style("fill", function(d,i) {
            return color(d.data.group);
        })
        .on("click", showTooltip) 

    node.append("text") //crew/castmember number of appearances/collaborations
        .attr("dy", (d) =>{ 
            if (d.data.role !== "Acting") {
                return "-1em"
            } else {
                return "-.5em"
            }
        })
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.value;
        })
        .attr("font-size", (d) =>{ 
            if (d.data.role !== "Acting") {
                return d.r/4
            } else {
                return d.r/3
            }
        })
        .attr("fill", "white")
        .attr("class", "no-pointer-events");   

    node.append("text")  //crew/castmember name 
        .attr("dy", (d) =>{ 
            if (d.data.role !== "Acting") {
                return ".2em"
            } else {
                return ".5em"
            }
        })
        .style("text-anchor", "middle")
        .text(function(d) { 
            return `${d.data.name.substring(0, d.r / 3)}`;
        })
        .attr("font-size", function(d){
            // debugger;
            if (d.data.role !== "Acting") {
                return d.r/5;
            } else {
                return d.r/4
            }
        })
        .attr("fill", "white")
        .attr("class", "no-pointer-events");
    
    node.append("text") //crew/castmember role
        .attr("dy", "1.5em")
        .style("text-anchor", "middle")
        .text(function(d) {
            // return roleHandler(d)
            if (d.data.known_for !== "Acting") 
            return d.data.job;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white")
        .attr("class", "no-pointer-events");



    d3.select(self.frameElement)
        .style("height", diameter + "px");
        
}
