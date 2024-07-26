import DOMel from "./domReactor.js";

export const renderWeather = (nowObj, forecastObj) => {
    const rootEl = document.querySelector(':root');
    const bodyEl = document.body;
    const loadingScreen = document.querySelector('#loading-div');
    const weatherDisplay = document.querySelector('#weather-display');
    const location = document.querySelector('#location');
    const temp = document.querySelector('#temp');
    const weather = document.querySelector('#weather');
    const minTempMain = document.querySelector('#min-temp');
    const maxTempMain = document.querySelector('#max-temp');
    const thermostat = document.querySelector('#thermostat');
    const pressure = document.querySelector('#pressure');
    const needle = document.querySelector('#needle-div');
    const wind = document.querySelector('#wind');
    const windArrow = document.querySelector('#wind-arrow');
    const humidity = document.querySelector('#humidity');
    const hoursDiv = document.querySelector('#hours-div');
    const nowUnix = Date.now();
    const dayTime = nowUnix < nowObj.sunriseAdjUnix || nowUnix > nowObj.sunsetAdjUnix ? 'night' : 'day';
    const minPress = 900;
    const maxPress = 1100;
    const thermPercentage = (nowObj.temp - forecastObj.minTemp)/(forecastObj.maxTemp - forecastObj.minTemp) * 100;
    const thermWidth = thermPercentage > 100 ? 100
        : thermPercentage < 0 ? 0
        : thermPercentage
    ;
    const pressNeedleDegs = (((nowObj.pressure - minPress)/(maxPress - minPress)) * 180) - 90;
    
    // for background
    switch (nowObj.mainWeather) {
        case 'Rain':
        case 'Drizzle':
            rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/rain.GIF)');
            break;
        case 'Thunderstorm':
            rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/storm.GIF)');
            break;
        case 'Snow':
            rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/blizzard.GIF)');
            break;
        case 'Clouds':
            if (nowObj.weathDesc === 'overcast clouds') rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/overcast.GIF)');
            else rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/broken.GIF)');
            break;
        default:
            rootEl.style.setProperty('--bg-weather', 'url(../images/weathers/broken.GIF)');
    }

    // for highlights
    if (nowObj.liveLocation) location.classList.add('location')
    else location.classList.remove('location')
    
    location.innerText = nowObj.location;
    temp.innerHTML = `&nbsp;${nowObj.temp}º`;
    weather.innerText = nowObj.weathDesc;
    
    // for specs
    DOMel.renderMeasures(pressure, 'press', nowObj.pressure, 'hPa');
    DOMel.renderMeasures(wind, 'wind', nowObj.windSpeed, 'km/h');
    DOMel.renderMeasures(humidity, 'humidity', nowObj.humidity, '%');

    // for hourly forecast
    hoursDiv.replaceChildren();
    forecastObj.hoursArray.forEach(hour => {
        const hourDiv = DOMel.newHourDiv(hour);
        hoursDiv.appendChild(hourDiv);
    })


    // animated features
    setTimeout(() => {
        // for background
        rootEl.style.setProperty(`--bg-weather-filter`, `var(--bg-weather-filter-${dayTime})`);
        
        // for specs
        minTempMain.innerHTML = `&nbsp;${forecastObj.minTemp}º`;
        maxTempMain.innerHTML = `&nbsp;${forecastObj.maxTemp}º`;
        thermostat.style.width = `${thermWidth}%`;
        temp.innerHTML = `&nbsp;${nowObj.temp}º`;
        needle.style.rotate = `${pressNeedleDegs}deg`;
        windArrow.style.rotate = `${nowObj.windDir}deg`;
    }, 1000);

    setTimeout(() => {
        if (dayTime === 'day') {
            switch(nowObj.mainWeather) {
                case 'Rain':
                case 'Drizzle':
                case 'Thunderstorm':
                    rootEl.style.setProperty(`--bg-weather-filter`, `var(--bg-weather-filter-rainy)`);
                    break;
                case 'Clouds':
                    if (nowObj.weathDesc === 'overcast clouds') rootEl.style.setProperty(`--bg-weather-filter`, `var(--bg-weather-filter-rainy)`);
                    break;
            }
        }
    }, 2000);

    weatherDisplay.classList.add('flex');
    weatherDisplay.classList.remove('hidden');
    bodyEl.removeChild(loadingScreen);
};
