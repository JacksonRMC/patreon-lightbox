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

// for initial gallery view
const getThumbnailUrls = allData =>
  allData.map(gif => gif.images.fixed_width.url);

function createThumbnailElement(url) {
  const container = document.createElement('a');
  container.className = 'thumbnail-container';

  const gif = new Image(200, 200);
  gif.className = 'thumbnail';
  gif.src = url;

  container.appendChild(gif);
  return container;
}


function renderThumbnails(urls) {
  const gallery = document.querySelector('.gallery');
  const thumbnailElements = urls.map(createThumbnailElement);

  gallery.innerHTML = '';

  thumbnailElements.forEach(thumbnail => gallery.appendChild(thumbnail));
}

async function main() {
  const allData = await fetchTrending();
  const thumbnailUrls = getThumbnailUrls(allData);
  renderThumbnails(thumbnailUrls);
}

document.body.onload = main;
