import * as d3 from 'd3'
import * as utils from '../utils/d3_utils'


let seed = {
  "children": [
    {
      "name": "Quentin Tarantino",
      "children": [
        {
          "name": "Cast Unfamiliars",
          "group": "A",
          "value": 207,
          "colname": "level3"
        },
        {
          "name": "Cast Familiars",
          "group": "A",
          "value": 35,
          "colname": "level3"
        },
        {
          "name": "Crew Unfamiliars",
          "group": "A",
          "value": 515,
          "colname": "level3"
        },        
        {
          "name": "Crew Familiars",
          "group": "A",
          "value": 174,
          "colname": "level3"
        },
      ],
    },
    {
      "name": "Martin Scorsese",
      "children": [
        {
          "name": "Cast Unfamiliars",
          "group": "A",
          "value": 626,
          "colname": "level3"
        },
        {
          "name": "Cast Familiars",
          "group": "A",
          "value": 71,
          "colname": "level3"
        },
        {
          "name": "Crew Unfamiliars",
          "group": "A",
          "value": 848,
          "colname": "level3"
        },
        {
          "name": "Crew Familiars",
          "group": "A",
          "value": 191,
          "colname": "level3"
        },
      ],
    },
    {
      "name": "Christopher Nolan",
      "children": [
        {
          "name": "Cast Unfamiliars",
          "group": "A",
          "value": 282,
          "colname": "level3"
        },
        {
          "name": "Cast Familiars",
          "group": "A",
          "value": 24,
          "colname": "level3"
        },      
        {
          "name": "Crew Unfamiliars",
          "group": "A",
          "value": 1365,
          "colname": "level3"
        },      
        {
          "name": "Crew Familiars",
          "group": "A",
          "value": 273,
          "colname": "level3"
        },
      ],
    },
  ]
}

export const treeMap = () => {

    let newSeed = JSON.parse(localStorage.getItem('currentChartData'))

    let oldChart = document.getElementById("my_dataviz")
    if (oldChart !== null) {oldChart.remove()}

    let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 850 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

    const addDiv = () => {
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "my_dataviz")
        document.body.appendChild(newDiv);
    }

    addDiv();

// append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

// read json data

    // Give the data to this cluster layout:
    var root = d3.hierarchy(newSeed).sum(function(d){return d.value}) // Here the size of each leave is given in the 'value' field in input data
    const color = d3.scaleOrdinal()
        .domain(['Quentin Tarantino', 'Martin Scorsese', 'Christopher Nolan'])
        .range(["#402D54", "#D18975", "#8FD175"])

    var opacity = d3.scaleLinear()
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
        .style("stroke", "black")
        .style("fill", function (d, i) {
            return color(d.parent.data.name);
        })
        .style("opacity", function(d){return opacity(d.data.value)})

    // and to add the text labels
    svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", function(d){ return d.x0+2.5})    // +10 to adjust position (more right)
        .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
        .text(function(d){ return `${d.data.name}: ${d.data.value}` })
        .attr("font-size", "10px")
        .attr("fill", "white")
        .attr("class", "box-text")

    svg
        .selectAll("titles")
        .data(root.descendants().filter(function(d){return d.depth==1}))
        .enter()
        .append("text")
        .attr("x", function(d){return d.x0+1.5})
        .attr("y", function(d){ return d.y0+17.5})
        .text(function(d){ return d.data.name })
        .attr("font-size", "19px")
        .attr("fill",  "black" )
        .attr("class", "director-name")
}

//        .attr("x", function(d){return ((d.x0 + 50) % d.x1)})