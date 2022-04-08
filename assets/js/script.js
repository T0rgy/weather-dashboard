var key = "6abd422032a07f4d3ac394904d57e5fb"
var city = "madison"

var date = moment().format('llll');
var cityHistory = [];
var contHistEl = $('.cityHistory');
var cardTodayBody = $('.cardBodyToday');

$('#search').on('click', function (event){
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === "") {
        return;
    };
    cityHistory.push(city);

    localStorage.setItem('city', JSON.stringify(cityHistory));
    fiveForecastEl.empty();
    getHistory();
    getWeatherToday();
});

function getHistory() {
    contHistEl.empty();

    for (var i = 0; i < cityHistory.length; i++) {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text('${cityHistory[i]}');

        rowEl.addClass('row hisBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        contHistEl.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    };

    $('.histBtn').on('click', function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveForecastEl.empty();
        getWeatherToday();
    });
};


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

getCurrentWeather('madison');


