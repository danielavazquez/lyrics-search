//*First create api variable and bring in all DOM elements
//*Second add Eventlistener for submit event, within have a searchSongs function not yet created
//*Third create searchSongs function, use synchAwait to deal with asynch data with promises when useing fetch API
//we get a response with a promise and have to format it to json and get another promise back and console log the data
//*Fourth for fetch API request we will create a showData function instead of console.log(data); to put data in DOM
//*Fifth
//*Sixth

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = 'https://api.lyrics.ovh';

//Search by song or artist
async function searchSongs(term) {
  // fetch(`${apiURL}/suggest/${term}`)
  //   .then(res => res.json())
  //   .then(data => console.log(data));

  //cleaner, easier to read, get response then get data
  const res = await fetch(`${apiURL}/suggest/${term}`);
  const data = await res.json();

  showData(data);
}

//Show song and artist data in DOM
function showData(data) {

};

//Event listeners

//add e.preventDefault so it doesn't submit to a file
//add validation if else if they don't type in something sends alert to browser
form.addEventListener('submit', e => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert('Please type in a search term');
  } else {
    searchSongs(searchTerm);
  }
});