const HOST = 'https://api.giphy.com';
const PATH = '/v1/gifs/trending';
const LIMIT = 25;
const RATING = 'G';
// NOTE: In production I would most likely do this fetch from giphy server side
// as not to expose key, but since there is no server: this is here :(
const KEY = '5c843f0756d044b495770177c4f3fcf0';


/**
 * Get object of trending gifs from GIPHY
 * @async
 * @return {Promise<Object[]>} array of gifData objects
 */
async function fetchTrending() {
  const url = `${HOST}${PATH}?api_key=${KEY}&limit=${LIMIT}&rating=${RATING}`;
  const json = await fetch(url).then(res => res.json());
  return json.data;
}


/**
 * Render clicked-on image in fullscreen lighbox
 * @param {Object} gifData - object containing all data for a single gif
 * @param {Number} index - index of gif in object of all gif data
 * @return {undefined}
 */
function renderFeatured(gifData, index) {
  const { images, slug } = gifData;
  const url = images.original.url;

  // gif element
  const gif = new Image();
  gif.className = 'featured';
  gif.dataset.index = index;
  gif.src = url;
  gif.alt = slug;


  const pTag = document.createElement('p');
  pTag.className = 'tags';

  // giphy API was not returning tags for free account so currenlty using slug
  const tags = slug.split('-').join(' #');
  pTag.textContent = `#${tags}`;

  const photoOverlay = document.createElement('div');
  photoOverlay.className = 'photo-overlay';
  photoOverlay.appendChild(pTag);

  const featureContainer = document.querySelector('.feature-container');
  featureContainer.innerHTML = '';
  featureContainer.appendChild(gif);
  featureContainer.appendChild(photoOverlay);
}


/**
 * Render clicked-on image in fullscreen lighbox
 * @param {Object} e - click event object
 * @param {Object[]} allData - array of all trending gif objects
 * @return {undefined}
 */
function openLightbox(e, allData) {
  const overlay = document.querySelector('.overlay');
  overlay.style.display = 'flex';

  const clickedElement = e.target;
  const index = clickedElement.dataset.index;

  const gifData = allData[index];
  renderFeatured(gifData, index);
}


/**
 * Close lightbox overlay in response to `close` button click
 * @param {Object} e - click event object
 * @return {undefined}
 */
function closeLightbox(e) {
  e.preventDefault();
  const overlay = document.querySelector('.overlay');
  overlay.style.display = 'none';
}


/**
 * Determines next/prev gif in response to arrow click and passes to render
 * @param {Object} direction - indicates left vs right click
 * @param {Object[]} allData - array of all trending gif objects
 * @return {undefined}
 */
function handleArrowClick(direction, allData) {
  const featured = document.querySelector('.featured');
  const index = +featured.dataset.index;

  // reset at back if left click on first image
  const NUMBER_OF_GIFS = 25;
  let newIndex = direction === 'left' ? index - 1 : index + 1;
  if (newIndex < 0) {
    newIndex = NUMBER_OF_GIFS - 1;
  }

  // mod handles right click on last img
  const newGifData = allData[newIndex % NUMBER_OF_GIFS];

  renderFeatured(newGifData, newIndex);
}


/**
 * Determines if arrow click needs to call render (if lightbox is active)
 * @param {Object} direction - indicates left vs right click
 * @param {Object[]} allData - array of all trending gif objects
 * @return {undefined}
 */
function handleArrowPress(direction, allData) {
  // make sure overlay is open
  const overlay = document.querySelector('.overlay');
  if (overlay.style.display === 'none') { return; }

  handleArrowClick(direction, allData);
}


/**
 * Fires on every keypress - if it is a left or right arrow passes to handleArrowPress
 * @param {Object} e - click event object
 * @param {Object[]} allData - array of all trending gif objects
 * @return {undefined}
 */
function checkKey(e, allData) {
  // left arrow
  debugger;
  if (e.keyCode === 37) {
    handleArrowPress('left', allData);
  }
  // right arrow
  else if (e.keyCode === 39) {
    handleArrowPress('left', allData);
  }
  // escape
  else if (e.keyCode === 27) {
    closeLightbox(e);
  }
}


/**
 * Makes thumbnail element containing small version of gif
 * @param {Object} gifData - object containing all data for a single gif
 * @param {Number} index - index of gif in object of all gif data
 * @return {Object} - element containing gif to be rendered
 */
function createThumbnailElement(gifData, index) {
  const { images, slug } = gifData;
  const url = images.fixed_width.url;

  const container = document.createElement('div');
  container.className = 'thumbnail-container';

  const gif = new Image(200, 200);
  gif.className = 'thumbnail';
  gif.dataset.index = index;
  gif.src = url;
  gif.alt = slug;

  container.appendChild(gif);
  return container;
}


/**
 * Takes the gif array and adds the thumbnails to the DOM
 * @param {Object[]} allData - array of all trending gif objects
 * @return {undefined}
 */
function renderThumbnails(allData) {
  const thumbnailElements = allData.map(createThumbnailElement);

  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  thumbnailElements.forEach(thumbnail => gallery.appendChild(thumbnail));
}


/**
 * Main function that fires on DOM load. Starts gallery building process and
 * adds all event listeners
 * @async
 * @return {undefined}
 */
async function main() {
  // get data and build main gallery
  const allData = await fetchTrending();
  renderThumbnails(allData);

  // add event listeners
  const images = document.querySelectorAll('.thumbnail');
  images.forEach(img => img.addEventListener('click', e => openLightbox(e, allData)));

  const leftArrow = document.querySelector('.left-arrow');
  leftArrow.addEventListener('click', () => handleArrowClick('left', allData));

  const rightArrow = document.querySelector('.right-arrow');
  rightArrow.addEventListener('click', () => handleArrowClick('right', allData));

  const close = document.querySelector('.close');
  close.addEventListener('click', closeLightbox);

  document.onkeydown = e => checkKey(e, allData);
}

document.body.onload = main;
