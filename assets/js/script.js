var apiKey = "6abd422032a07f4d3ac394904d57e5fb"
var city = "milwaukee"

function getLocationData(city) {
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=" + apiKey)
    .then(function(response) {
        return response.json()
    })
    .then(function(locationData) {
        console.log(locationData)
        getCurrentWeather(locationData[0].lat, locationData[0].lon)
})

 function getCurrentWeather(lat, lon) {
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon +"&appid=" + apiKey + "&units=imperial")
    .then(function(response) {
        return response.json() 
        })
        .then(function(weatherData) {
            console.log(weatherData)
    })
}
}

getCurrentWeather('milwaukee');


