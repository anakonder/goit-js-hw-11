import Notiflix from 'notiflix';
import axios from 'axios';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

Notiflix.Notify.init(
    {position: 'center-top'}
)


const searchForm = document.querySelector(".search-form");
const textInput = document.querySelector(".text-input");
const submitBtn = document.querySelector(".submit-btn");
const gallery = document.querySelector(".gallery")
const loadBtn = document.querySelector(".load-more")

axios.defaults.baseURL = `https://pixabay.com/api/`;
const APIKEY = "36981447-281557b64426541a1312b4aee";
const hitsOnPage = 40;

let pageToFatch = 1;
let queryToFetch = '';
let SumHits = 0;


async function fetchEvents(keyword, page) {
  try {
    const {data} = await axios("", {
      params: {
            key: APIKEY,
            q: keyword,
            page,
            image_type: "photo",
            orientation: "horisontal",
            safesearch: true,
            per_page: hitsOnPage,
       
      },
    });
      console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}




async function getEvents(query, page) {
    const data = await fetchEvents(query, page)
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
}



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
        return `
        <a class="gallery__link" href=${largeImageURL} >
            <div class="photo-card">
            <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
            <p class="info-item"><b>Likes</b><br>${likes}</p>
            <p class="info-item"><b>Views</b><br>${views}</p>
            <p class="info-item"><b>Comments</b><br>${comments}</p>
            <p class="info-item"><b>Downloads</b><br>${downloads}</p></div>
            </div>
        </a>
        `
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

const option = {
    sourceAttr: "href",
    captionsData: "alt",
    captionsDelay: 250
}

const simpleLitbox = new SimpleLightbox('.gallery__link', option);