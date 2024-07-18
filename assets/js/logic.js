import { 
    fetchAutocomplete
} from "./data.js";

import DOMel from "./domReactor.js";


const inputDiv = document.querySelector('#input-div');
const inputCity = document.querySelector('#city-input');
const autocompDiv = DOMel.newAutoCompDiv();
const spinner = DOMel.newSpinner();
const autocompList = DOMel.newAutocompList();
let arrowsController;

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
        if (event.key === 'ArrowDown') {

            event.preventDefault();
            
            if (counter !== undefined) listEls[counter].style.removeProperty('filter');

            if (counter === undefined) counter = 0
            else if ((counter + 1) < length) counter++
            else counter = 0
            
        } else if (event.key === 'ArrowUp') {
            
            event.preventDefault();
            
            if (counter !== undefined) listEls[counter].style.removeProperty('filter');

            if (counter === undefined) counter = length - 1;
            else if (counter > 0) counter--
            else counter = length - 1
        }

        if (listEls[counter]) listEls[counter].style.filter = 'brightness(150%)';
    }
};

const focusInputCity = (event) => {
    const type = event.type;

    if (type === 'focusin') {
        inputDiv.appendChild(autocompDiv);

        cityOracleFunc();
    }
    
    if (type === 'focusout') {
        autocompDiv.replaceChildren()
        inputDiv.removeChild(autocompDiv);
    }
};

const startLogic = () => {
    inputCity.addEventListener('input', cityOracleFunc)
    inputCity.addEventListener('focusin', focusInputCity)
    inputCity.addEventListener('focusout', focusInputCity)
};

window.onload = startLogic();