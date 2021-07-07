import * as d3 from 'd3'
import { clearTitle, loadingIcon, makeBubbleContainer, titleizeBubbleChart, useIcon, waitOrNot } from '../components/bubbleStuff'
import { roleHandler } from '../utils/d3/bubble_utils'
import { clearChildren, storageChecker } from '../utils/d3/d3_utils'
import { hideTooltip, showTooltip } from './tooltip'

export const bubbleMaker = async (searchQuery) => {

    storageChecker(searchQuery, 'currentBubbleChartData') ? await new Promise(resolve => setTimeout(resolve, 1000)) : null 

    let localData = JSON.parse(localStorage.getItem('currentBubbleChartData'))

    localData = (localData.children).filter(directorObj => directorObj.name === searchQuery)

    let dataset = {name: 'favorites', children: (localData[0].children[0].children).concat(localData[0].children[1].children)}
    let oldChart = document.getElementById("bubble")
    if (oldChart !== null) {oldChart.remove()}

    const bubbleContainer = (document.getElementById('bubble-chart')===null) //true to indicate I dont want it to return the new element
        ? makeBubbleContainer(true) 
        : (document.getElementById('bubble-chart') ) 

    clearTitle(); //delete previous chart title (director name) if one exists
    titleizeBubbleChart(searchQuery); 

    const diameter = (document.getElementById("bubble-chart")).clientHeight; //sets height of chart to window size

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

    const ShowToolTip = e => showTooltip(e, tooltip)

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
        .on("click", ShowToolTip) 

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
