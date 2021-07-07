import * as d3 from 'd3'
import { clearChildren} from '../utils/d3/d3_utils'

export const showTooltip = (d, tooltip) => {
    let data = d.currentTarget.__data__.data
    let linkUrl= `https://www.themoviedb.org/person/${data.id}-${data.name.replace(" ", "-")}`   
    let imageUrl = `https://www.themoviedb.org/t/p/w1280/${data.prof_path}`

    clearChildren(tooltip)

    const hideTooltip = (d) => {
        clearChildren(tooltip);
        tooltip
            .transition()
                // .duration(00)
                .style("opacity", 0)
    }
    
    let info = () => {
        if (data.job){
            return (`${data.name}, ${data.job}`)
        } else {
            return (`${data.name}`)
        }
    }

    tooltip
        .transition()
            .duration(200)
    tooltip
        .style("opacity", 1)
        // .text(info())
        .style("left", d.pageX + "px")
        .style("top", d.pageY + "px")

    const tooltipContainer = tooltip
        .append("div")
        .attr("class", "tooltipContainer")

    tooltipContainer  //tmdb link
        .append("a")
        .attr("href", linkUrl)
        .html(info())
        .attr("id", "tooltip-link")
        .attr("target", "_blank")
        .attr("rel", "noopener noreferrer")

    if (imageUrl !== "https://www.themoviedb.org/t/p/w1280/null"){  //a href img
        tooltipContainer  
            .append("img")
            .attr("src", imageUrl)
            .attr("id", "tooltip-img")
    }

    tooltip //close &times; icon 
        .append("span")
        .html("&times;")
        .on("click", hideTooltip)
}
