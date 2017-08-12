const HOST = 'http://api.giphy.com';
const PATH = '/v1/gifs/trending';
const LIMIT = 25;
const RATING = 'G';
// NOTE: In production I would most likely do this fetch from giphy server side
// as not to expose key, but since there is no server: this is here :(
const KEY = '5c843f0756d044b495770177c4f3fcf0';


async function fetchTrending() {
  const url = `${HOST}${PATH}?api_key=${KEY}&limit=${LIMIT}&rating=${RATING}`;
  const json = await fetch(url).then(res => res.json());
  return json.data;
}

function openLightbox(e, allData) {
  const el = e.target;

  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
}


function createThumbnailElement(gifData, index) {
  const url = gifData.images.fixed_width.url;

  const container = document.createElement('a');
  container.className = 'thumbnail-container';

  const gif = new Image(200, 200);
  gif.className = 'thumbnail';
  gif.dataset.index = index;
  gif.src = url;

  container.appendChild(gif);
  return container;
}


function renderThumbnails(allData) {
  const gallery = document.querySelector('.gallery');
  const thumbnailElements = allData.map(createThumbnailElement);

  gallery.innerHTML = '';

  thumbnailElements.forEach(thumbnail => gallery.appendChild(thumbnail));
}

async function main() {
  const allData = await fetchTrending();
  renderThumbnails(allData);

  const images = document.querySelectorAll('.thumbnail');
  images.forEach(img => img.addEventListener('click', e => openLightbox(e, allData)));
}

document.body.onload = main;
