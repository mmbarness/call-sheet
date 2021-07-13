import d3 from 'd3'

const highlightSelector = ({target, svg}) => {
    const selection = svg.selectAll(target)
    const nodes = selection._groups[0]
    const nodeArr = Array.from(nodes);
    return nodeArr 
}

const highlighter = ({e, svg}) => {  //decides whether to highlight cast or crew, depending on mouse event
    const nodeArr = highlightSelector({target: `.${e.currentTarget.__data__}-node`, svg})
    addOrRemove(nodeArr) ? drawHighlights({nodeArr, svg}) : deleteHighlights({nodeArr, svg})
}

const addOrRemove = (nodeArr) => {
    return (nodeArr[0].style.stroke === "")
}

const drawHighlights = ({nodeArr, svg}) => {  //handles the higlighting
    nodeArr.map(node => {
        node.style.setProperty("stroke","#afded9");
        node.style.setProperty("stroke-width","5px");
    })
}

const deleteHighlights = ({nodeArr, svg}) => { //deletes the highlighting
    nodeArr.map(node => {
        node.style.setProperty("stroke","");
        node.style.setProperty("stroke-width","");
    })
}

export const legend = ({svg, color, node}) => {
    var size = 20
    var allgroups = ["cast", "crew"]

    const legendNode = svg.selectAll("legend-node")
        .data(allgroups)
        .enter()
        .append("g")
        .attr("class", "legend-nodes")
        .on("mouseover", e => highlighter({svg, e}))
        .on("mouseout", e => highlighter({svg, e}))

    legendNode.append("circle")
        .attr("dataset", d => d)
        .attr('class', 'legend-dot')
        .attr("cx", 150)
        .attr("cy", function(d,i){ return 20 + i*(size+15)}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 15)
        .style("fill", function(d){ return color(d)})

    legendNode.append("text")
        .attr('class', 'legend-text')
        .attr("x", 150 + size*.9)
        .attr("y", function(d,i){ return i * (size + 10) + (size/2) + 10}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return color(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
}