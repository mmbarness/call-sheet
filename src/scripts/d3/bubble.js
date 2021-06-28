import * as d3 from 'd3'
import { clearTitle, loadingIcon, makeBubbleContainer, titleizeBubbleChart, useIcon, waitOrNot } from '../components/bubbleStuff'
import { roleHandler } from '../utils/d3/bubble_utils'
import { storageChecker } from '../utils/d3/d3_utils'


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
    
    // const icon = (document.getElementsByClassName('loader').length > 0) ? document.getElementsByClassName('loader') : loadingIcon(bubbleContainer, true)  //same idea- passing it bubbleContainer so that it can append loading Icon to it
    // waitOrNot(searchQuery) ? useIcon(icon) : null

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

    const node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        // .append("a")
            // .attr("href", d => `https://www.themoviedb.org/person/${d.data.id}-${d.data.name.replace(" ", "-")}`)  
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("a")
        .attr("href", d => `https://www.themoviedb.org/person/${d.data.id}-${d.data.name.replace(" ", "-")}`)        

    node.append("title")
        .text(function(d) {
            return d.data.name
        });

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


    node.append("text")  //crew/castmember name 
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) { 
            return d.data.name.substring(0, d.r / 3);
        })
        .attr("font-size", function(d){
            return d.r/6;
        })
        .attr("fill", "white");

    node.append("text") //crew/castmember number of appearances/collaborations
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.value;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");
    
    node.append("text") //crew/castmember role
        .attr("dy", "2.25em")
        .style("text-anchor", "middle")
        .text(function(d) {
            // return roleHandler(d)
            if (d.data.known_for !== "Acting") 
            return d.data.job;
        })
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");


    d3.select(self.frameElement)
        .style("height", diameter + "px");
        
}
