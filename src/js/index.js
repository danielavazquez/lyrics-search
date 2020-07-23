//*First create api variable and bring in all DOM elements
//*Second add Eventlistener for submit event, within have a searchSongs function not yet created
//*Third create searchSongs function, use synchAwait to deal with asynch data with promises when useing fetch API
//we get a response with a promise and have to format it to json and get another promise back and console log the data
//*Fourth for fetch API request we will create a showData function instead of console.log(data); to put data in DOM, data.data = (data passed into function, data array)
//*Fifth within showData function we have an if stmt with a ternary operator that includes a button for getMoreSongs with an inline eventListener
//*Sixth create getMoreSongs function with CORS policy proxy from heroku
//*Seventh create eventListener for button element to grab artist and song when clicking on get lyrics button
//*Eighth create getLyrics function asnyc function, making another request for the API, use regEx .replace because lyrics are output in a block

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
  result.innerHTML = `
    <ul class="songs">
      ${data.data
      .map(
        song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span>
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
      )
      .join('')}
    </ul>
  `;
  if (data.prev || data.next) {
    more.innerHTML = `
      ${
      data.prev
        ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
        : ''
      }
      ${
      data.next
        ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
        : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs
//cross domain access to a server need to use a proxy
// Get prev and next songs
async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`); //what do you want to fetch?
  const data = await res.json();

  if (data.error) {
    result.innerHTML = data.error;
  } else {
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>'); //checking for any returns or a new line, g is global flag checks entire thing then replace with a line break

    result.innerHTML = `
            <h2><strong>${artist}</strong> - ${songTitle}</h2>
            <span>${lyrics}</span>
        `;
  }

  more.innerHTML = '';
}

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

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target; //need this because when you click on song name or artist you get the object in console, only want clickedEl to be the button

  if (clickedEl.tagName === 'BUTTON') { //need tagName for reason above ^
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});