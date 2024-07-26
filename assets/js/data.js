import { 
    DayForecast,
    Location,
    NowWeather,
    SavedLoc
} from "./dataObjs.js";

const forData = { n: 'fPxlMogzzLQ4pjLuQHWS4w==x9g7XnHSXgG2AxwH', w: '72f4793569ce879d637b3c27d14f4db6' };

export const fetchAutocomplete = (input) => new Promise((res, rej) => {
    const url = `https://api.api-ninjas.com/v1/city?name=${input}&limit=5&X-Api-Key=${forData.n}`;
    
    fetch(url)
        .then(string => {
            if (string.ok) res(string.json())
            else throw new Error()
        })
        .catch(err => res([]))
})

export const getLocation = () => new Promise((res, rej) => {
    navigator.geolocation.getCurrentPosition(location => {
        const newLocationObj = new Location(location, true);

        res(newLocationObj)
    });
});

export const getPermissions = () => new Promise((res, rej) => {
    navigator.permissions.query({ name: "geolocation" })
        .then(obj => res(obj.state))
});

export const fetchNowWeather = ({ latitude, longitude, live, city }) => new Promise((res, rej) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${forData.w}`;
    
    fetch(url)
        .then(string => {
            if (string.ok) return string.json()
            else throw new Error('An unknown error arose.')
        })
        .then(dataObj => res(new NowWeather(dataObj, live, city)))
        .catch(err => rej(err))
})

export const fetchFiveDayForecast = ({latitude, longitude}, nowWeatherObj) => new Promise((res, rej) => {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${forData.w}`;
    
    fetch(url)
        .then(string => {
            if (string.ok) return string.json()
            else throw new Error('An unknown error arose.')
        })
        .then(dataObj => res(new DayForecast(dataObj, nowWeatherObj)))
        .catch(err => rej(err))
})

export const updateLocalStorage = (locObj) => {
    const localSaves = localStorage.getItem('EitS-Saved-Locations') ? JSON.parse(localStorage.getItem('EitS-Saved-Locations')) : [];
    
    if (locObj) {
        const newLocation = new SavedLoc(locObj);
        
        for (let i = 0; i < localSaves.length; i++) {
            if (newLocation.city === localSaves[i].city) localSaves.splice(i, 1)
        }

        localSaves.push(newLocation);
        if (localSaves.length > 5) localSaves.splice(0, 1)
        localStorage.setItem('EitS-Saved-Locations', JSON.stringify(localSaves));
    } 
    
    return localSaves
}