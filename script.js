const apiKey = '73451c00';  // Your OMDb API key
const searchInput = document.getElementById('searchInput');
const movieResults = document.getElementById('movieResults');
const watchlist = document.getElementById('watchlist');

// Watchlist stored in localStorage
let myWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

searchInput.addEventListener('input', async function () {
  const query = this.value.trim();
  if (!query) {
    movieResults.innerHTML = '';
    return;
  }

  const res = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
  const data = await res.json();

  if (!data.Search) {
    movieResults.innerHTML = '<p>No results found</p>';
    return;
  }

  movieResults.innerHTML = '';
  for (const movie of data.Search) {
    const fullData = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${movie.imdbID}`);
    const movieData = await fullData.json();

    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.innerHTML = `
      <img src="${movieData.Poster !== 'N/A' ? movieData.Poster : 'https://via.placeholder.com/80x120?text=No+Poster'}" />
      <div>
        <strong>${movieData.Title}</strong> (${movieData.Year})
      </div>
      <button onclick="addToWatchlist('${movieData.imdbID}')">+ Add</button>
    `;
    movieResults.appendChild(card);
  }
});

function addToWatchlist(imdbID) {
  if (!myWatchlist.some(movie => movie.imdbID === imdbID)) {
    fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
      .then(res => res.json())
      .then(movie => {
        movie.watched = false;
        myWatchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(myWatchlist));
        renderWatchlist();
      });
  }
}

function toggleWatched(imdbID) {
  myWatchlist = myWatchlist.map(movie => {
    if (movie.imdbID === imdbID) {
      movie.watched = !movie.watched;
    }
    return movie;
  });
  localStorage.setItem('watchlist', JSON.stringify(myWatchlist));
  renderWatchlist();
}

function renderWatchlist() {
  watchlist.innerHTML = '';
  for (const movie of myWatchlist) {
    const card = document.createElement('div');
    card.classList.add('movie-card');

    card.innerHTML = `
      <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/80x120?text=No+Poster'}" />
      <div>
        <strong>${movie.Title}</strong> (${movie.Year})<br/>
        <small>${movie.watched ? '✅ Watched' : 'Not Watched'}</small>
      </div>
      <button onclick="toggleWatched('${movie.imdbID}')">
        ${movie.watched ? '✓ Watched' : 'Mark Watched'}
      </button>
    `;

    watchlist.appendChild(card);
  }
}

renderWatchlist();
