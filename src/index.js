import './css/styles.css';
import fetchCountries from "./fetchCountries";
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countrylist: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(evt) {
  clearOutput();

  if(!evt.target.value){
    return;
  }

  fetchCountries(evt.target.value.trim())
  .then(data => {
    if (data.length > 10) {
      return Notiflix.Notify.info('To many matches found. Please enter a more specific name.')
    }

    if (data.length > 1){
      const markup = createListMarkup(data);
      addListMarkup(markup);
      return;
    }

    const markup = createCardMarkup(data[0]);
    addCardMarkup(markup);
  })
  .catch(() => Notiflix.Notify.failure('Oops, there is no country with that name'));
 
} 

  function clearOutput() {
    refs.countrylist.innerHTML = '';
    refs.countryInfo.innerHTML = ' '
  }

  function createListMarkup(data) {
    return data 
    .map(({ name, flags}) => {
      return `<li class='country'><img class='country-flag' src='${flags.svg}' alt='${name}'><p>${name}</p></li>`;
    })
    .join('');
  }

  function createCardMarkup(data){
    const languages = data.languages.map(lang => lang.name);
    return `<h1><img class='country-flag' src="${data.flags.svg}" alt="${data.name}">${data.name}</h1>
    <ul>
    <li><span>Capital: </span>${data.capital}</li>
    <li><span>Population: </span>${data.population}</li>
    <li><span>Languages: </span>${languages.join(', ')}</li>
    </ul>`;
  }

  function addListMarkup(markup){
    refs.countrylist.insertAdjacentHTML('beforeend', markup);
  }

  function addCardMarkup(markup){
    refs.countryInfo.insertAdjacentHTML('beforeend', markup);
  }

