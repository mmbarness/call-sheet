# Call Sheet

Data visualizer meant to illustrate any film director’s closest collaborators.

## Overview

Intended to give the user a more complete picture of film director's patterns in collaboration. Through the bubble chart, the website renders in visual language the working habits of a chosen director, revealing whether they tend to work with the same cast and crew or not. 

## Stack: Node/D3/VanillaJS

Home Court utilizes React and Redux to create the user interface and populate it with the appropriate data. Home Court utilizes CSS to style all of its React components. 

### Features of note
* Leverages the tmdb movie database api to enable users to search for and compare bubble charts representing a given director’s closest collaborators.
* Entirely custom search feature with regex testing of queries for robust error prevention.
* Builds a JSON dataset from the tmdb api call that is then relied upon by D3 to generate the bubble chart that is the cornerstone of the website.

![Image of Call Sheet](https://call-sheet.s3.amazonaws.com/callSheet.gif)
