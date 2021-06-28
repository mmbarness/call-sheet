export const roleHandler = (node) => {
    // if (node.data.)
}

export const setBubbleChartStorage = ({cast, crew, searchQuery}) => {
  let castArr = [];
  let crewArr = [];
  for (const k in cast) {
    castArr.push({
      id: cast[k].id, 
      name: k, 
      value: cast[k].count, 
      group: 'cast', 
      role: cast[k].known_for, 
      prof_path: cast[k].prof_path
    })
  }
  for (const k in crew){
    crewArr.push({
      id: crew[k].id, 
      name: k, 
      value: crew[k].count, 
      group: 'crew', 
      job: crew[k].job,
      known_for: crew[k].known_for, 
      prof_path: crew[k].prof_path
    })
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
    castArr.push({
      id: cast[k].id, 
      name: k, 
      value: cast[k].count, 
      group: 'cast', 
      role: cast[k].known_for, 
      prof_path: cast[k].prof_path
    })
  }
  for (const k in crew){
    crewArr.push({
      id: crew[k].id, 
      name: k, 
      value: crew[k].count, 
      group: 'crew', 
      job: crew[k].job,
      known_for: crew[k].known_for, 
      prof_path: crew[k].prof_path
    })
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
