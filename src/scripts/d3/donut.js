import * as d3 from 'd3'

export const donutMaker = (data = [{ "All Cast Members Ever": 95 }, { "Familiar Cast Members": 16 }]) => {    
    const width = 450
    const height = 450 
    const margin = 40
    data = [{ "All Cast Members Ever": 95 }, { "Familiar Cast Members": 16 }]
    const radius = Math.min(width, height) / 2 - margin 

    // let svgEle = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    // svgEle.setAttribute('width', '500');
    // svgEle.setAttribute('height', '400');
    // svgEle.setAttribute('id', 'my_dataviz');
    // svgEle.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
    // document.body.appendChild(svgEle);

    const addDiv = () => {
        const newDiv = document.createElement('div');
        newDiv.setAttribute("id", "d3-root")
        document.body.appendChild(newDiv);
    }

    addDiv();

    let svg = d3.select('#d3-root')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3.scaleOrdinal(['#4daf4a', '#377eb8', '#ff7f00', '#984ea3', '#e41a1c']);

    const pie = d3.pie()
        .value((d) => Object.entries(d[1])[0][1])
    
    let dataVals = []
    data.forEach(obj => dataVals.push(Object.values(obj)))
    const data_ready = pie(Object.entries(data))

    svg
        .selectAll('slices')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('d', d3.arc()
            .innerRadius(radius * .75)
            .outerRadius(radius)
            )
        .attr('fill', (d, i) => {color(i)})
        .attr('stroke', 'black')
        .style('stroke-width', '2px')
        .style('opacity', 0.5)
}