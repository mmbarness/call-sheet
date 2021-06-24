import * as d3 from 'd3'


export const bubbleMaker = () => {

    let localData = JSON.parse(localStorage.getItem('currentBubbleChartData'))
    let dataset = {name: 'favorites', children: (localData.children[0].children[0].children).concat(localData.children[0].children[1].children)}
    let oldChart = document.getElementById("bubble-chart")

    if (oldChart !== null) {oldChart.remove()}

    const addDiv = () => {
        const container = document.getElementById("d3-container")
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "bubble-chart")
        newDiv.setAttribute("class", "d3div")
        container.appendChild(newDiv);
    }

    addDiv();

    const diameter = 1200;

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

    const nodes = d3.hierarchy(dataset)
        .sum(function(d) {return d.value; });

    const node = svg.selectAll(".node")
        .data(bubble(nodes).descendants())
        .enter()
        .filter(function(d){
            return  !d.children
        })
        .append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("title")
        .text(function(d) {
            return d.name + ": " + d.value;
        });

    node.append("circle")
        .attr("r", function(d) {
            return d.r;
        })
        .style("fill", function(d,i) {
            return color(d.data.group);
        });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .text(function(d) { 
            return d.data.name.substring(0, d.r / 3);
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    node.append("text")
        .attr("dy", "1.3em")
        .style("text-anchor", "middle")
        .text(function(d) {
            return d.data.value;
        })
        .attr("font-family",  "Gill Sans", "Gill Sans MT")
        .attr("font-size", function(d){
            return d.r/5;
        })
        .attr("fill", "white");

    d3.select(self.frameElement)
        .style("height", diameter + "px");
        
}
