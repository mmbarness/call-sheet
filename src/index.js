import { creditsParser } from "./scripts/data_builder";

creditsParser('Martin Scorsse', 'Director').then(data => console.log('Scorsese:',{ cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Alfred Hitchcock', 'Director').then(data => console.log( 'Hitchcock:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Stanley Kubrick', 'Director').then(data => console.log( 'Kubrick:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew } ))
// creditsParser('Clint Eastwood', 'Director').then(data => console.log('Eastwood:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('Christopher Nolan', 'Director').then(data => console.log('Nolan:', {cast: data.counter.familiarCast, crew: data.counter.familiarCrew}))
// creditsParser('David Lowery', 'Director').then(data => console.log('Lowery:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
// creditsParser('Chloe Zhao', 'Director').then(data => console.log('Zhao:', { cast: data.counter.familiarCast, crew: data.counter.familiarCrew }))
