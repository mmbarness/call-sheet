import { bubbleMaker } from "../../d3/bubble"

export const setChartStorage = ({counter, searchQuery}) => {
    let directorJSON = 
    {"children": [
        {
          "name": searchQuery.input,
          "info": searchQuery.searchResults,
          "children": [
            {
              "name": "Cast Unfamiliars",
              "group": "A",
              "value":(counter.allCastmembersEver - counter.familiarCastmembers),
              "colname": "level3"
            },
            {
              "name": "Cast Familiars",
              "group": "A",
              "value": counter.familiarCastmembers,
              "colname": "level3"
            },
            {
              "name": "Crew Unfamiliars",
              "group": "A",
              "value": counter.allCrewmembersEver - counter.familiarCrewMembers,
              "colname": "level3"
            },        
            {
              "name": "Crew Familiars",
              "group": "A",
              "value": counter.familiarCrewMembers,
              "colname": "level3"
            },
          ],
      }
    ]}
    return directorJSON 
}

export const appendChartStorage = (storage, {counter, searchQuery}) => {
  let directorJSON =         {
          "name": searchQuery.input,
          "info": searchQuery.searchResults,
          "children": [
            {
              "name": "Cast Unfamiliars",
              "group": "A",
              "value":(counter.allCastmembersEver - counter.familiarCastmembers),
              "colname": "level3"
            },
            {
              "name": "Cast Familiars",
              "group": "A",
              "value": counter.familiarCastmembers,
              "colname": "level3"
            },
            {
              "name": "Crew Unfamiliars",
              "group": "A",
              "value": counter.allCrewmembersEver - counter.familiarCrewMembers,
              "colname": "level3"
            },        
            {
              "name": "Crew Familiars",
              "group": "A",
              "value": counter.familiarCrewMembers,
              "colname": "level3"
            },
          ],
      }
  storage['children'].push(directorJSON)
  return storage; 
}

export const rectClassParser = (name) => {
  return `${name.replace(" ", "-")}-treemap-rect`
}

export const chartClicker = (e) => {
  const searchQuery = (e.currentTarget.className.baseVal).replace("-treemap", "").replace("-", " ").replace("-rect", "")
  bubbleMaker(searchQuery)
}

export const titleizeTreemap = (title) => {
  const treemap = document.getElementById(`${title.replace(" ", "-")}-treemap`)
  const titleEle = document.createElement('h3')
  titleEle.textContent = title
  treemap.insertAdjacentElement('afterbegin', titleEle);
}