import Notiflix from 'notiflix';
import axios from 'axios'

Notiflix.Notify.init(
    {position: 'center-top'}
)


const searchForm = document.querySelector(".search-form");
const textInput = document.querySelector(".text-input");
const submitBtn = document.querySelector(".submit-btn");
const gallery = document.querySelector(".gallery")
const loadBtn = document.querySelector(".load-more")

// axios.defaults.baseURL = `https://pixabay.com/api/`;
const APIKEY = "36981447-281557b64426541a1312b4aee";
const BASE_URL = `https://pixabay.com/api/`;
const hitsOnPage = 40;

let pageToFatch = 1;
let queryToFetch = '';
let SumHits = 0;


 function fetchEvents(keyword, page) {
// async
    // try {        
    //     const response = await axios.get(`?key=${APIKEY}&q=${keyword}&image_type=photo&orientation=horisontal&safesearch=true&per_page=${hitsOnPage}&page=${page}`)
    //     console.log(response)
    // } catch (error) {
    //     console.log(error)
    // }


    return fetch(`${BASE_URL}?key=${APIKEY}&q=${keyword}&image_type=photo&orientation=horisontal&safesearch=true&per_page=${hitsOnPage}&page=${page}`)
        .then((response) => {
        // console.log(response);
        if (!response.ok) {
            throw new Error(response.status)
        }
        return response.json()
    })
}

function getEvents(query, page) {
    fetchEvents(query, page).then(data => {
        console.log(data)
        if (data.totalHits === 0) {
            Notiflix.Notify.failure('"Sorry, there are no images matching your search query. Please try again."');
            // alert("Sorry, there are no images matching your search query. Please try again.")
            return
        }
        const events = data.hits
        console.log(events)
        renderEvents(events)
        // alert(`Hooray! We found ${data.totalHits} images.`)
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        let totalPages = Math.ceil(data.totalHits / hitsOnPage);
        SumHits = SumHits + data.hits.length
        console.log('SumHits', SumHits)
        console.log('data.totalHits',data.totalHits)
        console.log('pageToFatch', pageToFatch)
        console.log('totalPages', totalPages)
        console.log('data.hits.length', data.hits.length)
        if (totalPages > 1 && data.totalHits > SumHits) {
            loadBtn.classList.remove("unvisible")            
        }
    })
}

// getEvents('cat')

function renderEvents(events) {
    const markup = events.map(({
        webformatURL,
        
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads
    }) => {
        return `<div class="photo-card">
        <img class="img" src="${webformatURL}" alt="img" loading="lazy" />
        <div class="info">
        <p class="info-item"><b>Likes</b><br>${likes}</p>
        <p class="info-item"><b>Views</b><br>${views}</p>
        <p class="info-item"><b>Comments</b><br>${comments}</p>
        <p class="info-item"><b>Downloads</b><br>${downloads}</p></div>
        </div>`
    }).join("")
    gallery.insertAdjacentHTML('beforeend', markup)
}


searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
    const inputValue = textInput.value
    if (!inputValue.trim() || inputValue === queryToFetch) {
        return;
    }
  queryToFetch = inputValue;
  pageToFatch = 1;
  gallery.innerHTML = '';
  SumHits = 0
  loadBtn.classList.add("unvisible")
  getEvents(queryToFetch, pageToFatch);
});



loadBtn.addEventListener('click', handleLoadMore);

function handleLoadMore() {
    pageToFatch += 1;
    getEvents(queryToFetch, pageToFatch);
    loadBtn.classList.add('unvisible')
}
