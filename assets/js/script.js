var key = "6abd422032a07f4d3ac394904d57e5fb"
var city = "Madison"

var date = moment().format('llll');
var cityHistory = [];
var contHistEl = $('.cityHistory');
var cardTodayBody = $('.cardBodyToday');
var fiveForecastEl = $('.fiveForecast');

$('.search').on('click', function (event){
    event.preventDefault();
    city = $(this).parent('.btnPar').siblings('.textVal').val().trim();
    if (city === "") {
        return;
    };
    cityHistory.push(city);

    localStorage.setItem('city', JSON.stringify(cityHistory));
    fiveForecastEl.empty();
    getHistory();
    getCurrentWeather();
});

function getHistory() {
    contHistEl.empty();

    for (var i = 0; i < cityHistory.length; i++) {
        var rowEl = $('<row>');
        var btnEl = $('<button>').text(`${cityHistory[i]}`);

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
        getCurrentWeather();
    });
};

 function getCurrentWeather() {
    var getUrlCurrent = (`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${key}`);
    
    
    $(cardTodayBody).empty();

    $.ajax({
        url: getUrlCurrent,
        method: 'GET',
    }).then(function(response) {
        $('.cardTodayCityName').text(response.name);
        $('.cardTodayDate').text(date);
        $('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);

        var lon = response.coord.lon;
        var lat = response.coord.lat;
        var pEl = $('<p>').text(`Temperature: ${response.main.temp}°F`);
        var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity}%`);
        var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        
        cardTodayBody.append(pEl);
        cardTodayBody.append(pElHumid);
        cardTodayBody.append(pElWind);

        
        var getUrlUvi = (`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,daily,minutely&appid=${key}`);

        $.ajax({
            url: getUrlUvi,
            method: "GET",
        }).then(function(response) {
            var pElUvi = $('<p>').text("UV Index: ");
            var uviSpan = $('<span>').text(response.current.uvi);
            var uvi = response.current.uvi;
            pElUvi.append(uviSpan);
            cardTodayBody.append(pElUvi);

            if (uvi >= 0 && uvi <= 2) {
                uviSpan.attr("class", "green");
            }else if (uvi > 2 && uvi <= 6) {
                uviSpan.attr("class", "yellow");
            }else if (uvi > 6 && uvi <= 10) {
                uviSpan.attr("class", "red");
            }

            
        });
    });
    getFiveDayForecast();
};

function getFiveDayForecast() {
    var getUrlFiveDay = (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${key}`);

    $.ajax({
        url: getUrlFiveDay,
        method: "GET",
    }).then(function(response) {
        var fiveDayArray = response.list;
        var myWeather = [];
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
                myWeather.push(testObj);
            };
        })
        for (var i = 0; i < myWeather.length; i++) {
            var divElCard = $('<div>');
            divElCard.attr('class', 'card text-white bg-primary mb-3 cardOne');
            divElCard.attr('style', 'max-width: 200px;');
            fiveForecastEl.append(divElCard);

            var divElHeader = $('<div>');
            divElHeader.attr('class', 'card-header');

            var m = moment(`${myWeather[i].date}`).format('MM-DD-YYYY');
            divElHeader.text(m);
            divElCard.append(divElHeader);

            var divElBody = $('<div>');
            divElBody.attr('class', 'card-body');
            divElCard.append(divElBody);

            var divElIcon = $('<img>');
            divElIcon.attr('class', 'icon');
            divElIcon.attr('src', `https://openweathermap.org/img/wn/${myWeather[i].icon}@2x.png`);
            divElBody.append(divElIcon);

            var pElTemp = $('<p>').text(`Temperature: ${myWeather[i].temp}°F`);
            divElBody.append(pElTemp);
            var pElHumid = $('<p>').text(`Humidity: ${myWeather[i].humidity}%`);
            divElBody.append(pElHumid);
            var pElWind = $('<p>').text(`Wind Speed: ${myWeather[i].wind} MPH`);
            divElBody.append(pElWind);
        };
    });
};

function startCity() {
    var cityHistoryStore = JSON.parse(localStorage.getItem('city'));
    if (cityHistoryStore !== null) {
        cityHistory = cityHistoryStore
    };

    getHistory();
    getCurrentWeather();
};

startCity();
