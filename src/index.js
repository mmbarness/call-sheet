import "regenerator-runtime/runtime";
import { creditsParser } from "./scripts/tmdb/data_builder";
import { treeMap } from "./scripts/d3/treemap";
import './scripts/genDom/search'
import './scripts/genDom/basicElements'
import { addSearch } from "./scripts/genDom/search";
import './styles/index.scss'

const fetcher = async () => {
  let careerData = await creditsParser('christopher nolan', 'Director')
  return careerData
}

// fetcher().then(resp => {treeMap(resp.counter, resp.searchQuery)})

// creditsParser('Alfred Hitchcock', 'Director').then(data => console.log( 'Hitchcock:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Stanley Kubrick', 'Director').then(data => console.log( 'Kubrick:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew } ))
// creditsParser('Clint Eastwood', 'Director').then(data => console.log('Eastwood:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('Christopher Nolan', 'Director').then(data => console.log('Nolan:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('David Lowery', 'Director').then(data => console.log('Lowery:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Chloe Zhao', 'Director').then(data => console.log('Zhao:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
