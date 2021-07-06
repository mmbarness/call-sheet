import { local } from "d3";
import { bubbleMaker } from "../../d3/bubble";
import { loadingIcon } from "../../components/bubbleStuff";

export const deleteSVGs = (eles) => {
  eles.forEach((div) => document.getElementById(div.id).remove())
}

export const colorSetter = () => {
  const data = JSON.parse(localStorage.getItem('currentChartData'));
  const dirArray = (data.children).map(director => director.name)
  return dirArray;
}

export const storageChecker = (searchQuery, d3type) => {
  let localData = JSON.parse(localStorage.getItem(d3type))
  if (localData === null) return false 
  return (searchQuery in localData) ? true : false 
}

export const fetchIcon = () => {
  const bubbleContainer = document.getElementById('bubble-chart')
  let icon = (document.getElementsByClassName('loader').length > 0) ? document.getElementsByClassName('loader') : loadingIcon(bubbleContainer, true)  //same idea- passing it bubbleContainer so that it can append loading Icon to it
  if (HTMLCollection.prototype.isPrototypeOf(icon)){
      icon = icon[0]
  }
  if (document.getElementById("bubble")){
      document.getElementById("bubble").remove()
  }
  return icon;
};

export const clearChildren = (parent) => {
  const children = parent.selectChildren()
  children.remove();
}