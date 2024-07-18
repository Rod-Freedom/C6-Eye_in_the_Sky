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
            response.forEach((obj, index) => {
                const cityName = obj.name;
                const liEl = document.createElement('li');
                liEl.innerText = cityName;
                liEl.classList.add('city-option');
                liEl.dataset.index = index;
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
}