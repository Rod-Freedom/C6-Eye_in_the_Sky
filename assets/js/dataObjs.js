export class Location {
    constructor ({ coords: { latitude, longitude } }, live) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.live = live ? true : false;
    }
}

export class SavedLoc extends Location {
    constructor ({ latitude, longitude, city }) {
        super({ coords: { latitude: latitude, longitude: longitude } }, false);
        this.city = city;
    }
}

export class NowWeather {
    constructor ({ weather: [{ main, description, icon }], main: { temp, pressure, humidity } , wind: { speed, deg }, dt, sys: { sunrise, sunset }, timezone, name }, live, city) {
        this.locationUnix = this.getUnix(dt, timezone);
        this.locationFullDate = new Date(this.locationUnix);
        this.locationHour = this.locationFullDate.getHours();
        this.locationDay = this.locationFullDate.getDate();
        this.locationMonth = this.locationFullDate.getMonth();
        this.sunriseAdjUnix = sunrise * 1000;
        this.sunsetAdjUnix = sunset * 1000;
        this.liveLocation = live;
        this.location = city ? city : name;
        this.mainWeather = main;
        this.weathDesc = description;
        this.iconCode = icon;
        this.temp = Math.round(temp - 273.15);
        this.pressure = pressure;
        this.humidity = humidity;
        this.windSpeed = Math.round(speed);
        this.windDir = deg + 360;
    }

    getUnix (localUnix, timezone) {
        const localTimezoneMinutes = new Date().getTimezoneOffset();
        const unix = (localUnix + (localTimezoneMinutes * 60) + timezone) * 1000;

        return unix
    }
}

export class DayForecast {
    constructor ({ list }, { locationUnix, temp, iconCode, locationHour, mainWeather }) {
        this.nowUnix = locationUnix;
        this.minTemp;
        this.maxTemp;
        this.hoursArray;

        this.getMinMaxTemp(list);
        this.getHoursObjs(list, temp, locationUnix, iconCode, locationHour, mainWeather);
    }

    getMinMaxTemp (hoursArr) {
        const tempsArray = [];
        for (let i = 0; i < 8; i++) {
            tempsArray.push(Math.round(hoursArr[i].main.temp - 273.15))
        }

        tempsArray.sort((a, b) => 
            a < b ? -1
            : a > b ? 1
            : 0
        )

        this.minTemp = tempsArray[0];
        this.maxTemp = tempsArray[7];
    }

    getHoursObjs (hoursArr, initTemp, initUnix, initIcon, initHour, initWeather) {
        const curatedHours = [];
        let localHour = initHour;
        hoursArr.splice(9);

        hoursArr.forEach(hour => {
            const { dt: hourUnix, main: { temp }, pop, weather: [{ icon }] } = hour;

            const pushCurrentHour = () => {
                localHour = localHour < 23 ? localHour + 1 : 0;
                const hourTemp = temp - 273.15;
                const hourPop = pop * 100;
                const hourObj = new HourObj(localHour, hourTemp, icon, hourPop);
                curatedHours.push(hourObj);
            };

            if (curatedHours.length === 0) {
                const hourDiff = Math.floor((hourUnix - (initUnix / 1000)) / 3600);
                const now = new HourObj('Now', initTemp, initIcon);
                curatedHours.push(now);
                
                for (let i = 0; i < hourDiff; i++) {
                    localHour = localHour < 23 ? localHour + 1 : 0;
                    let initHourPop;
                    if (initWeather === 'Rain' || initWeather === 'Thunderstorm' || initWeather === 'Drizzle') initHourPop = 1
                    else initHourPop = 0
                    const multiplier = (1 + i) / (hourDiff + 1);
                    const tempAdj = initTemp + ((temp - 273.15 - initTemp) * multiplier);
                    let popAdj = (initHourPop + ((pop - initHourPop) * multiplier)) * 100;
                    
                    const hourObj = new HourObj(localHour, tempAdj, icon, popAdj);
                    
                    curatedHours.push(hourObj);
                }
                
                pushCurrentHour();
                
            } else {
                const limit = curatedHours.length < 23 ? 2 : 24 - curatedHours.length;
                const { temp: pastTemp, pop: pastPop } = curatedHours[curatedHours.length - 1];
                for (let i = 0; i < limit; i++) {
                    localHour = localHour < 23 ? localHour + 1 : 0;
                    const multiplier = (1 + i) / 3;
                    const tempAdj = pastTemp + ((temp - 273.15 - pastTemp) * multiplier);
                    let popAdj = pastPop + (((pop * 100) - pastPop) * multiplier);
                    
                    const hourObj = new HourObj(localHour, tempAdj, icon, popAdj);
                    
                    curatedHours.push(hourObj);
                }
                
                pushCurrentHour();
            }
        });

        this.hoursArray = curatedHours;
    }
}

class HourObj {
    constructor (hour, temp, icon, pop) {
        this.hour = hour;
        this.temp = Math.round(temp);
        this.icon = icon;
        if (pop) this.pop = Math.round(pop);
    }
}