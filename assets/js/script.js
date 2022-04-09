// global variables
var key = "6abd422032a07f4d3ac394904d57e5fb"
var city = "Madison"
var date = moment().format('llll');
var cityHistory = [];
var historyContainer = $('.cityHistory');
var todayBody = $('.todayBody');
var fiveDayForecast = $('.fiveDayForecast');

// function when city search button is clicked
$('.search').click(function (event){
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === "") {
        return;
    };
    cityHistory.push(city);

    // saves to local storage
    localStorage.setItem('city', JSON.stringify(cityHistory));
    fiveDayForecast.empty();
    getHistory();
    getCurrentWeather();
});

// function to display previously searched cities
function getHistory() {
    historyContainer.empty();

    for (var i = 0; i < cityHistory.length; i++) {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityHistory[i]}`);

        rowEl.addClass('row hisBtnRow');
        btnEl.addClass('btn btn-outline-secondary histBtn');
        btnEl.attr('type', 'button');

        historyContainer.prepend(rowEl);
        rowEl.append(btnEl);
    } if (!city) {
        return;
    };

    // displays city info once histBtn is clicked
    $('.histBtn').click(function (event) {
        event.preventDefault();
        city = $(this).text();
        fiveDayForecast.empty();
        getCurrentWeather();
    });
};

// collects current weather and displays in today card
 function getCurrentWeather() {
    var getUrlCurrent = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`);
    
    $(todayBody).empty();

    // fetches weather information from api
    $.ajax({
        url: getUrlCurrent,
        method: 'GET',
    }).then(function(response) {
        $('.todayCityName').text(response.name);
        $('.todayDate').text(date);
        // collects icons
        $('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`); 

        // data variables
        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var tempEl = $('<p>').text(`Temperature: ${response.main.temp}°F`);
        var humidityEl = $('<p>').text(`Humidity: ${response.main.humidity}%`);
        var windEl = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        
        todayBody.append(tempEl);
        todayBody.append(humidityEl);
        todayBody.append(windEl);

        // fetches UV index from api
        var getUrlUvi = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely&appid=${key}`);

        $.ajax({
            url: getUrlUvi,
            method: "GET",
        }).then(function(response) {
            var uviEl = $('<p>').text(`UV Index: `);
            var uviSpan = $('<span>').text(response.current.uvi);
            var uvi = response.current.uvi;
            uviEl.append(uviSpan);
            todayBody.append(uviEl);

            // adds background color to UV Index
            if (uvi >= 0 && uvi <= 3) {
                uviSpan.attr("class", "green");
            }else if (uvi > 3 && uvi <= 6) {
                uviSpan.attr("class", "yellow");
            }else if (uvi > 6 && uvi <= 100) {
                uviSpan.attr("class", "red");
            }
        });
    });

    // displays 5 day forcast after data is collected
    getFiveDayForecast();
};

// function to display 5 day forcast
function getFiveDayForecast() {
    var getUrlFiveDay = (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`);
    
    $.ajax({
        url: getUrlFiveDay,
        method: "GET",
    }).then(function(response) {
        // five day forcast array start
        var fiveDayArray = response.list;
        var weatherArray = [];
        $.each(fiveDayArray, function(i, value) {
            testObj = {
                date: value.dt_txt.split(" ")[0],
                time: value.dt_txt.split(" ")[1],
                icon: value.weather[0].icon,
                temp: value.main.temp,
                humidity: value.main.humidity,
                wind: value.wind.speed,
            };
             
            if (value.dt_txt.split(" ")[1] === "12:00:00") {
                weatherArray.push(testObj);
            };
        })
        // displays five day forcast cards
        for (var i = 0; i < weatherArray.length; i++) {
            var divCard = $('<div>');
            divCard.attr('class', 'card text-white bg-primary mb-3');
            divCard.attr('style', 'max-width: 200px;');
            fiveDayForecast.append(divCard);

            var divHeader = $('<div>');
            divHeader.attr('class', 'card-header');

            // displays date
            var date5Day = moment(`${weatherArray[i].date}`).format('MM-DD-YYYY');
            divHeader.text(date5Day);
            divCard.append(divHeader);

            var divBody = $('<div>');
            divBody.attr('class', 'card-body');
            divCard.append(divBody);

            // displays icons
            var divIcon = $('<img>');
            divIcon.attr('class', 'icon');
            divIcon.attr('src', `https://openweathermap.org/img/wn/${weatherArray[i].icon}@2x.png`);
            divBody.append(divIcon);

            var tempEl = $('<p>').text(`Temperature: ${weatherArray[i].temp}°F`);
            divBody.append(tempEl);
            var humidityEl = $('<p>').text(`Humidity: ${weatherArray[i].humidity}%`);
            divBody.append(humidityEl);
            var windEl = $('<p>').text(`Wind Speed: ${weatherArray[i].wind} MPH`);
            divBody.append(windEl);
        };
    });
};

// displays Madison on load and calls getHistory and getCurrentWeather functions
function startCity() {
    var cityHistoryStore = JSON.parse(localStorage.getItem('city'));
    if (cityHistoryStore !== null) {
        cityHistory = cityHistoryStore
    };

    getHistory();
    getCurrentWeather();
};

startCity();
