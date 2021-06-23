import * as d3 from 'd3'
export const pieDrawer = () => {

    const svgEle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEle.setAttribute('width', '500');
    svgEle.setAttribute('height', '400');
    svgEle.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    document.body.appendChild(svgEle);

    const data = [{ "All Cast Members Ever": 95 }, { "Familiar Cast Members": 16 }]
    window.data = data; 
    const svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height"),
        radius = Math.min(width, height) / 2,
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']);

    // Generate the pie
    const pie = d3.pie();

    // Generate the arcs
    let arc = d3.arc()
        .innerRadius(radius * .75)
        .outerRadius(radius);

    var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius * .75);

    var label = d3.arc()
        .outerRadius(radius)
        .innerRadius(radius - 80);

    //Generate groups
    let dataVals = []
    data.forEach(obj => dataVals.push(Object.values(obj)))

    let dataKeys = []
    data.forEach(obj => dataKeys.push(Object.keys(obj)))
    let arcs = g.selectAll("arc")
        .data(pie(dataVals))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("id", (d, i) =>  { return "pieSlice" + i; })

    //Draw arc paths
    arcs.append("path")
        .attr("fill", function (d, i) {
            return color(i);
        })
        .attr("d", arc);

    let texts = g.selectAll("arc")
        .data(dataKeys)
        .enter()
        .append("g")
        .attr("class", "arcText")
        .attr("id", (d, i) => { return "pieSliceText" + i; })

    texts.append("text")
        // .attr("transform", function (d) {
        //     var _d = arc.centroid(d);
        //     _d[0] *= 1.5;	//multiply by a constant factor
        //     _d[1] *= 1.5;	//multiply by a constant factor
        //     return "translate(" + _d + ")";
        // })
        .attr("dy", ".50em")
        .style("text-anchor", "middle")
        .text(function (d) {
            return d[0]
        });

}