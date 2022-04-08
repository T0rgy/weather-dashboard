var key = "6abd422032a07f4d3ac394904d57e5fb"
var city = "madison"

var date = moment().format('llll');
var cityHistory = [];
var contHistEl = $('.cityHistory');
var cardTodayBody = $('.cardBodyToday');
var fiveForecastEl = $('.fiveForecast';)

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

 function getCurrentWeather() {
    var getUrlCurrent = ("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon +"&appid=" + key + "&units=imperial");
    var getUrlUvi = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily,minutely&appid=" + key);
    var lon = response.coord.lon;
    var lat = response.coord.lat;
    
    $(cardTodayBody).empty();

    $.ajax({
        url: getUrlCurrent,
        method: 'GET',
    }).then(function(response) {
        $('.cardTodayCityName').text(response.name);
        $('.cardTodayDate').text(date);
        $('.icons').attr('src', `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`);
        
        var pEl = $('<p>').text(`Temperature: ${response.main} °F`);
        var pElHumid = $('<p>').text(`Humidity: ${response.main.humidity} %`);
        var pElWind = $('<p>').text(`Wind Speed: ${response.wind.speed} MPH`);
        
        cardTodayBody.append(pEl);
        cardTodayBody.append(pElHumid);
        cardTodayBody.append(pElWind);

        $.ajax({
            url: getUrlUvi,
            method: "GET",
        }).then(function(response) {
            var pElUvi = $('<p>').text("UV Index: ");
            var uviSpan = $('<span>').text(response.current.uvi);
            var uvi = response.current.uvi;

            if (uvi >= 0 && uvi <= 2) {
                uviSpan.attr("class", "green");
            }else if (uvi > 2 && uvi <= 6) {
                uviSpan.attr("class", "yellow");
            }else if (uvi > 6 && uvi <= 10) {
                uviSpan.attr("class", "red");
            };

            pElUvi.append(uviSpan);
            cardTodayBody.append(pElUvi);
        });
    });
    getFiveDayForecast();
};

function getFiveDayForecast() {
    var getUrlFiveDay = ("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + key);

    $.ajax({
        url: getUrlFiveDay,
        method: "GET",
    }).then(function(response) {
        var fiveDayArray = response.list;
        var myWeather = [];
        $.each(fiveDayArray, function(index, value) {
            testObj = {
                date: value.dt_txt.split(" ")[0],
                time:
            }
        })
    })
}


getCurrentWeather('madison');


