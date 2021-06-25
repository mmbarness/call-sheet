export const addDiv = (params) => { 
  const newDiv = document.createElement('div');
  newDiv.setAttribute(`${params.type}`, `${params.text}`)
  params.append(newDiv);
  return newDiv 
}

// requires an object formatted like {
//     append: (div) => document.body.appendChild(div), - where/how to append the created div
//     type: "class", "id", whatever 
//     text: desired classname or id tag here
// }

