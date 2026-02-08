const API_KEY = '82650220645068a8cf72d421d234a413'; 
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// ١. ئینانا فیلمێن تڕێند (Trending)
async function getMovies() {
    const res = await fetch(`${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}`);
    const data = await res.json();
    renderMovies(data.results);
}

// ٢. نیشاندانا فیلمان ل سەر شاشەیێ
function renderMovies(movies) {
    const grid = document.getElementById('movieGrid');
    grid.innerHTML = ''; 

    movies.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => openM(movie.id, movie.title, movie.overview);

        card.innerHTML = `
            <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/500x750?text=No+Image'}" alt="${movie.title}" loading="lazy">
            <div class="card-info">
                <h3>${movie.title}</h3>
                <span>⭐ ${movie.vote_average}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ٣. گەڕیان د ناڤ ملیۆنان فیلمان دا
async function searchMovies() {
    const term = document.getElementById('searchInput').value;
    if(term.trim()) {
        const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${term}`);
        const data = await res.json();
        renderMovies(data.results);
    } else {
        getMovies();
    }
}

// ٤. ڤەکرنا فیلمی و دیتنا "Trailer" ب شێوەیەکێ ئۆتۆماتیکی
async function openM(id, title, desc) {
    // ئینانا لینکا یوتیوبی ب ڕێکا API
    const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
    const data = await res.json();
    const trailer = data.results.find(v => v.type === 'Trailer');
    
    const videoLink = trailer ? `https://www.youtube.com/embed/${trailer.key}` : "";
    
    document.getElementById('frame').src = videoLink;
    document.getElementById('mTitle').innerText = title;
    document.getElementById('mDesc').innerText = desc;
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeM() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('frame').src = "";
    document.body.style.overflow = 'auto';
}

// دەستپێکرن
getMovies();
