export const addDiv = (params) => { 
  const newDiv = document.createElement('div');
  newDiv.setAttribute(`${params.type}`, `${params.text}`)
  params.append(newDiv);
  return newDiv 
}