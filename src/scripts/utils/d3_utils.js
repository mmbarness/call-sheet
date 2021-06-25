import { local } from "d3";
import { bubbleMaker } from "../d3/bubble";

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


export const setBubbleChartStorage = ({cast, crew, searchQuery}) => {
  let castArr = [];
  let crewArr = [];
  for (const k in cast) {
    castArr.push({id: cast[k].id, name: k, value: cast[k].count, group: 'cast', role: cast[k].role, prof_path: cast[k].prof_path})
  }
  for (const k in crew){
    crewArr.push({id: crew[k].id, name: k, value: crew[k].count, group: 'crew', role: crew[k].role, prof_path: crew[k].prof_path})
  }

  let directorFavoritesJSON = {
    children:
        [
          {
          "name": searchQuery.input,
          "info": searchQuery.searchResults,
            "children": [
              {
                "name": "Favorite Crewmembers",
                "children": crewArr
              },
              {
                "name": "Favorite Castmembers",
                "children": castArr 
              }
            ]
          }
        ]
      }

  return directorFavoritesJSON
}

export const appendBubbleChartStorage = (storage, {cast, crew, searchQuery}) => {
  let castArr = [];
  let crewArr = [];
  for (const k in cast) {
    castArr.push({id: cast[k].id, name: k, value: cast[k].count, group: 'cast', role: cast[k].role, prof_path: cast[k].prof_path})
  }
  for (const k in crew){
    crewArr.push({id: crew[k].id, name: k, value: crew[k].count, group: 'crew', role: crew[k].role, prof_path: crew[k].prof_path})
  }
  let directorFavoritesJSON = {
          "name": searchQuery.input,
          "info": searchQuery.searchResults,
          "children": [
            {
              "name": "Favorite Crewmembers",
              "children": crewArr
            },
            {
              "name": "Favorite Castmembers",
              "children": castArr 
            }
          ]
      }
  storage['children'].push(directorFavoritesJSON)
  return storage; 
}

export const deleteSVGs = (eles) => {
  eles.forEach((div) => document.getElementById(div.id).remove())
}

export const chartClicker = (e) => {
  const searchQuery = (e.currentTarget.className.baseVal).replace("-treemap", "").replace("-", " ").replace("-rect", "")
  bubbleMaker(searchQuery)
}

export const rectClassParser = (name) => {
  return `${name.replace(" ", "-")}-treemap-rect`
}

export const colorSetter = () => {
  const data = JSON.parse(localStorage.getItem('currentChartData'));
  const dirArray = (data.children).map(director => director.name)
  return dirArray;
}

export const titleizeTreemap = (title) => {
  const treemap = document.getElementById(`${title.replace(" ", "-")}-treemap`)
  const titleEle = document.createElement('h3')
  titleEle.textContent = title
  treemap.insertAdjacentElement('afterbegin', titleEle);
}

export const storageChecker = (searchQuery, d3type) => {
  let localData = JSON.parse(localStorage.getItem(d3type))
  if (localData === null) return false 
  return (searchQuery in localData) ? true : false 
}