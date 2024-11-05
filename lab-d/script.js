function getWeather() {
    const containers = document.getElementsByClassName("weather-container");
    while (containers.length > 0) {
        containers[0].remove();
    }
    //const key = "7ded80d91f2b280ec979100cc8bbba94";
    const key = "5913e6cd0e9c8a5932a834daed70615f";
    const city = document.getElementById('localization').value;
    currentWeather(city, key);
    for5DaysWeather(city, key);
}

function createDayWeatherContainer(city, day, temperature, description, humidity, windSpeed, pressure) {
    const div = document.createElement("div");
    const fragment = document.createDocumentFragment();
    const today = (new Date()).getDate()
    div.className = "weather-container";

    if(today.toString() === day.at(0) && document.getElementById("current") === null){
        div.id = "current";
        const h2 = document.createElement("h2");
        h2.textContent = "Aktualna Pogoda";
        //div.appendChild(h2);
    }
    const elements = [
        { tag: "h2", text: `Miasto: ${city}`, className: "city" },
        { tag: "h3", text: `${day}`, className: "day"},
        { tag: "p", text: `Temperatura: ${temperature}°C`, className: "temperature" },
        { tag: "p", text: `Opis pogody: ${description}`, className: "description" },
        { tag: "p", text: `Wilgotność: ${humidity}%`, className: "humidity" },
        { tag: "p", text: `Prędkość wiatru: ${windSpeed} m/s`, className: "windSpeed" },
        { tag: "p", text: `Ciśnienie: ${pressure} hPa`, className: "pressure" }
    ];
    elements.forEach(({ tag, text, className }) => {
        const elem = document.createElement(tag);

        elem.className = className;
        elem.textContent = text;

        fragment.appendChild(elem);
    });

    div.appendChild(fragment);
    document.getElementById("displayWeatherContent").appendChild(div);
}

function currentWeather(city, key) {
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
            const json = JSON.parse(xhr.response);

            const cityName = json.name
            const date = new Date(json.dt*1000)
            const dateCombined = `${date.getDate()}.${(date.getMonth()+1)}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
            const temperature = json.main.temp;
            const description = json.weather[0].description;
            const humidity = json.main.humidity;
            const windSpeed = json.wind.speed;
            const pressure = json.main.pressure;

            console.log(json);
            createDayWeatherContainer(cityName, dateCombined, temperature, description, humidity, windSpeed, pressure);

        }
    });
    xhr.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`);
    xhr.send();
}

async function for5DaysWeather(city, key) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}&units=metric`);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        console.log(json);
        const forecastList = json.list;

        const cityName = json.city.name;
        forecastList.forEach(forecast => {
            const date = new Date(forecast.dt * 1000);
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const temperature = forecast.main.temp;
            const description = forecast.weather[0].description;
            const humidity = forecast.main.humidity;
            const windSpeed = forecast.wind.speed;
            const pressure = forecast.main.pressure;

            createDayWeatherContainer(cityName, formattedDate, temperature, description, humidity, windSpeed, pressure);
        });

    } catch (error) {
        console.error(error.message);
    }
}
