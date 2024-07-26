import { 
    fetchAutocomplete,
    getLocation,
    getPermissions,
    fetchNowWeather,
    fetchFiveDayForecast,
    updateLocalStorage
} from "./data.js";
import { renderWeather } from "./weather.js";
import DOMel from "./domReactor.js";

// root elements
const bodyEl = document.body;
const mainEl = document.querySelector('main');
const loadingScreen = DOMel.newLoadingScreen();

// Header elements
const inputDiv = document.querySelector('#input-div');
const inputCity = document.querySelector('#city-input');
const btnSearch = document.querySelector('#btn-search');
const autocompDiv = DOMel.newAutoCompDiv();
const spinner = DOMel.newSpinner();
const autocompList = DOMel.newAutocompList();

// Main elements
const savedSec = document.querySelector('#saved-sec');
const noResultsPrompt = DOMel.newNoResults();
const currentLocDiv = DOMel.newCurrentLocBtn();
let noLocDiv;

// Features variables
let arrowsController;
let currentLocation;
let sorryPrompt;

const cityOracleFunc = () => {
    const text = inputCity.value;
    
    autocompDiv.replaceChildren();
    autocompList.replaceChildren();
    autocompDiv.appendChild(spinner);

    if (arrowsController) arrowsController.abort()

    const executeAutocomp = async () => {
        if (text.length !== inputCity.value.length) return

        autocompList.replaceChildren();

        if (text.length > 0) {
            const citiesResponse = await fetchAutocomplete(text);
            const listEls = DOMel.newListEls(citiesResponse);
            
            autocompDiv.replaceChildren();
            autocompDiv.appendChild(autocompList);
            autocompList.append(...listEls);

            if (citiesResponse.length === 0) return

            listEls.forEach(liEl => {
                liEl.addEventListener('mouseenter', hoverCityListFunc);
                liEl.addEventListener('mouseleave', hoverCityListFunc);
            });

            arrowsController = new AbortController();
            document.addEventListener('keydown', arrowSelectFunc(listEls), { signal: arrowsController.signal })
        } else {
            const listEls = DOMel.newListEls([]);

            autocompDiv.replaceChildren();
            autocompDiv.appendChild(autocompList);
            autocompList.append(...listEls);
        }
    };

    setTimeout(executeAutocomp, 500);
};

const hoverCityListFunc = (event) => {
    const { type, target } = event;

    if (type === 'mouseenter') target.style.filter = 'brightness(150%)'
    if (type === 'mouseleave') target.style.removeProperty('filter')
};

const arrowSelectFunc = (listEls) => {
    let counter;
    const length = listEls.length;

    return (event) => {
        const { key } = event;
        if (key === 'ArrowDown') {

            event.preventDefault();
            
            if (counter !== undefined) listEls[counter].style.removeProperty('filter');

            if (counter === undefined) counter = 0
            else if ((counter + 1) < length) counter++
            else counter = 0
            
        } else if (key === 'ArrowUp') {
            
            event.preventDefault();
            
            if (counter !== undefined) listEls[counter].style.removeProperty('filter');

            if (counter === undefined) counter = length - 1;
            else if (counter > 0) counter--
            else counter = length - 1
        
        } else if (key === 'Enter') {
            if (autocompList.children.length === 0 || !autocompList.children[0].classList.contains('city-option') || autocompList.children[0].innerText === 'No results') return
            if (counter === undefined) counter = 0
            const cityLocation = listEls[counter].dataset;

            arrowsController.abort();
            updateLocalStorage(cityLocation);
            startForecast(cityLocation);
            inputCity.blur();
            autocompDiv.replaceChildren();
            autocompList.replaceChildren();
            inputDiv.removeChild(autocompDiv);
            document.removeEventListener('click', focusInputCity);
        }
        
        if (listEls[counter]) listEls[counter].style.filter = 'brightness(150%)';
    }
};

const selectCityOption = (event) => {
    const { target: { classList, dataset: cityLocation } } = event;

    if (!classList.contains('city-option')) return

    arrowsController.abort();
    startForecast(cityLocation);
    inputCity.blur();
    autocompDiv.replaceChildren();
    inputDiv.removeChild(autocompDiv);
    document.removeEventListener('click', focusInputCity);
};

const btnSearchEvent = () => {
    if (autocompList.children.length === 0 || !autocompList.children[0].classList.contains('city-option') || autocompList.children[0].innerText === 'No results') renderNoResultsPrompt()
    else {
        const cityLocation = autocompList.children[0].dataset;

        arrowsController.abort();
        updateLocalStorage(cityLocation);
        startForecast(cityLocation);
        inputCity.blur();
        autocompDiv.replaceChildren();
        autocompList.replaceChildren();
        inputDiv.removeChild(autocompDiv);
        document.removeEventListener('click', focusInputCity);
    }
};

const saveSelectEvent = (event) => {
    const { target } = event;
    
    if (target.dataset.city) return startForecast(target.dataset)
    if (target.parentElement.dataset.city) return startForecast(target.parentElement.dataset)
}

const focusInputCity = (event) => {
    const { type, target } = event;

    if (type === 'focusin') {
        inputDiv.appendChild(autocompDiv);
        document.addEventListener('click', focusInputCity);

        cityOracleFunc();
    }
    
    if (type === 'click') {
        if (target === btnSearch || target === btnSearch.children[0] || !inputDiv.contains(target)) {
            autocompDiv.replaceChildren();
            inputDiv.removeChild(autocompDiv);
            document.removeEventListener('click', focusInputCity);
            autocompList.replaceChildren();
        }
    }
};

const renderNoResultsPrompt = () => {
    if (mainEl.contains(noResultsPrompt)) return
    else {
        mainEl.appendChild(noResultsPrompt);
        setTimeout(() => mainEl.removeChild(noResultsPrompt), 2000);
    }
};

const renderNoLocLanding = () => {
    noLocDiv = DOMel.newNoLocDiv();
    mainEl.appendChild(noLocDiv);
    
    const btnLocation = document.querySelector('#btn-location');
    btnLocation.addEventListener('click', currentLocationFunc);
};

const promptNoPermission = () => {
    const closePromptFunc = () => {
        const filter = document.querySelector('#sorry-filter');
        
        mainEl.removeChild(filter);
    };
    
    if (sorryPrompt === undefined) {
        sorryPrompt = DOMel.newSorryPrompt();
        mainEl.appendChild(sorryPrompt);
        const btnClose = document.querySelector('#btn-close-sorry');
        btnClose.addEventListener('click', closePromptFunc);
    } else mainEl.appendChild(sorryPrompt);
};

const startForecast = async (locObj) => {
    const { live } = locObj;
    bodyEl.appendChild(loadingScreen);
    renderSaves();
    if (mainEl.contains(noLocDiv)) mainEl.removeChild(noLocDiv);

    if (live) currentLocation = await getLocation()
    else currentLocation = locObj
    const nowWeatherObj = await fetchNowWeather(currentLocation);
    const dayForecastObj = await fetchFiveDayForecast(currentLocation, nowWeatherObj);

    renderWeather(nowWeatherObj, dayForecastObj);
    if (!live) savedSec.appendChild(currentLocDiv);
};

const startSite = async () => {
    const locationPermission = await getPermissions();
    if (locationPermission === 'granted') startForecast({ live: true })
    else renderNoLocLanding()
};

const currentLocationFunc = async () => {
    const locationPermission = await getPermissions();
    if (locationPermission === 'denied') return promptNoPermission()
    else startForecast({ live: true })
};

const renderSaves = () => {
    const localSaves = updateLocalStorage();
    const savesEls = DOMel.newSaves(localSaves);

    savedSec.replaceChildren(...savesEls);
};

const startLogic = () => {
    inputCity.addEventListener('input', cityOracleFunc);
    inputCity.addEventListener('focusin', focusInputCity);
    inputCity.addEventListener('focusout', focusInputCity);
    autocompDiv.addEventListener('click', selectCityOption);
    btnSearch.addEventListener('click', btnSearchEvent);
    savedSec.addEventListener('click', saveSelectEvent);
    currentLocDiv.addEventListener('click', currentLocationFunc);
    renderSaves();
    
    startSite();
};

window.onload = startLogic();