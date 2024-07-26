export default class DOMel {
    static newSpinner () {
        const spinnerCircle = document.createElement('div');
        spinnerCircle.id = 'spinner-circle';
        spinnerCircle.classList.add('spinner-part');
        
        const spinner = document.createElement('div');
        spinner.id = 'spinner';
        spinner.classList.add('spinner-part');

        spinnerCircle.appendChild(spinner);

        return spinnerCircle
    }

    static newAutoCompDiv () {
        const autocompDiv = document.createElement('div');
        autocompDiv.id = 'autocomp-div';

        return autocompDiv
    }

    static newAutocompList () {
        const autocompList = document.createElement('ul');
        autocompList.id = 'autocomp-list';

        return autocompList
    }

    static newListEls (response) {
        let listEls = [];

        if (response.length > 0) {
            response.forEach(obj => {
                const { name: cityName, country, latitude, longitude } = obj;
                const liEl = document.createElement('li');
                liEl.innerText = `${cityName}, ${country}`;
                liEl.classList.add('city-option');
                liEl.dataset.latitude = latitude;
                liEl.dataset.longitude = longitude;
                liEl.dataset.city = `${cityName}, ${country}`;
                listEls.push(liEl);
            });
        } else {
            const text = 'No results';
            const liEl = document.createElement('li');
            liEl.innerText = text;
            liEl.classList.add('city-option');
            listEls.push(liEl);
        }

        return listEls
    }

    static newNoLocDiv () {
        const noLocDiv = document.createElement('div');
        noLocDiv.id = 'no-location-div';

        const h1 = document.createElement('h1');
        h1.id = 'no-location';
        h1.innerText = 'Please select a location.';

        const btn = document.createElement('button');
        const iEl = document.createElement('i');
        btn.id = 'btn-location';
        iEl.id = 'location-icon';
        iEl.classList.add('fa-solid', 'fa-location-dot');
        btn.append(iEl, 'Use my current location');

        noLocDiv.append(h1, btn);

        return noLocDiv
    }

    static newSorryPrompt () {
        const filter = document.createElement('div');
        filter.id = 'sorry-filter';

        const sorryDiv = document.createElement('div');
        filter.appendChild(sorryDiv);
        const h1 = document.createElement('h1');
        sorryDiv.id = 'sorry-div';
        h1.id = 'sorry';
        h1.innerHTML = `Sorry, you need to grant Eye in the Sky<br>access to your location.<br><br>Reload the page when you're done.`;

        const btnClose = document.createElement('button');
        btnClose.id = 'btn-close-sorry';
        btnClose.innerText = 'Close';

        sorryDiv.append(h1, btnClose);
        return filter
    }

    static newLoadingScreen () {
        const loadingDiv = document.createElement('div');
        const bg = document.createElement('div');
        const iconsDiv = document.createElement('div');
        const logoDiv = document.createElement('div');
        const logoAnimate = document.createElement('div');
        const logo = document.createElement('div');
        const text = document.createElement('h1');

        loadingDiv.id = 'loading-div';
        bg.id = 'loading-bg';
        iconsDiv.id = 'loading-icons';
        logoDiv.id = 'loading-logo-div';
        logoAnimate.id = 'loading-logo-animate';
        logo.id = 'loading-logo';
        text.id = 'loading-text';

        loadingDiv.append(bg, iconsDiv);
        iconsDiv.append(logoDiv, text);
        logoDiv.append(logoAnimate, logo);
        text.innerText = 'Loading...';
        
        return loadingDiv
    }

    static renderMeasures (element, kind, measure, units) {
        const span = document.createElement('span');
        span.id = `${kind}-units`;
        span.innerText = units;

        element.replaceChildren(measure, span);
    }

    static newHourDiv (hourObj) {
        const { hour, temp, icon, pop } = hourObj;

        const hourDiv = document.createElement('div');
        const h3 = document.createElement('h3');
        const timeDiv = document.createElement('div');
        const img = document.createElement('img');
        const h4 = document.createElement('h4');

        hourDiv.classList.add('hour-div');
        if (pop) {
            timeDiv.classList.add('time', 'pr2');
            timeDiv.append(img, `${pop}%`);
        } else {
            timeDiv.classList.add('time');
            timeDiv.append(img);
        }
        img.classList.add('weather-icon');
        h4.classList.add('hour-temp');

        h3.innerText = hour === 'Now' ? hour : `${hour}:00`;
        img.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
        img.alt = 'weather icon';
        h4.innerHTML = `&nbsp;${temp}º`;

        hourDiv.append(h3, timeDiv, h4);

        return hourDiv
    }

    static newNoResults () {
        const parentDiv = document.createElement('div');
        const h1 = document.createElement('h1');
        const h2 = document.createElement('h2');

        h1.innerText = 'Sorry!';
        h2.innerText = 'Couldn\'t find that place.';
        parentDiv.id = 'no-results';
        parentDiv.append(h1, h2);

        return parentDiv
    }

    static newSaves (localSaves) {
        const savesEls = []; 
        
        if (localSaves.length === 0) {
            const saveDiv = document.createElement('div');
            const h1 = document.createElement('h1');
            saveDiv.classList.add('saved-location');
            h1.innerText = 'No saved locations';
            
            saveDiv.appendChild(h1);
            savesEls.push(saveDiv);
        } else {
            localSaves.forEach(save => {
                const { latitude, longitude, city } = save;
                const saveDiv = document.createElement('div');
                const h1 = document.createElement('h1');
                
                saveDiv.classList.add('saved-location');
                saveDiv.dataset.latitude = latitude;
                saveDiv.dataset.longitude = longitude;
                saveDiv.dataset.city = city;

                h1.innerText = city;
                
                saveDiv.appendChild(h1);
                savesEls.push(saveDiv);
            });
        }

        return savesEls
    }

    static newCurrentLocBtn () {
        const currentLocDiv = document.createElement('div');
        const h1 = document.createElement('h1');

        currentLocDiv.id = 'current-loc';
        h1.innerText = 'Current location';
        currentLocDiv.appendChild(h1);

        return currentLocDiv
    }
}