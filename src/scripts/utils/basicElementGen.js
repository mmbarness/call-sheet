export const addDiv = ({append, type, text, innerText = false}) => { 
  const newDiv = document.createElement('div');
  newDiv.setAttribute(`${type}`, `${text}`)
  append(newDiv);
  if (innerText) {newDiv.innerText = innerText}
  return newDiv 
}