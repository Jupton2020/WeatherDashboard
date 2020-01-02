var apiKey = "23302ddb187391ead663cc6c36ea9130";
var city = '';
var date = new Date()
var longitude = "";
var latitude = "";
var pushGo = [];

// function to use previous search history
function searchHistory() {
    pushGo = []
    var pastSearch = localStorage.getItem("pastSearch")
if (pastSearch !== null) {

        for (var i = 0; i < pastSearch.length; i++) {

            var prevHistory = pastSearch.split(",").reverse()
            console.log(prevHistory)

            if (i < 3 && prevHistory[i] !== undefined) {
                var getHistoryList = $("<div class='historylist' city=" + prevHistory[i].replace(" ", "-") + ">" + prevHistory[i] + "</div>")

                $(".search-data").append(getHistoryList)

                pushGo.push(prevHistory[i])
            }
        }
    }
}

// function to get current user location weather

function currentWeather() {
    navigator.geolocation.getCurrentPosition(function (position) {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&appid=" + apiKey;
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                console.log(response);
                // move content to HTML
                var city = $(".city").html("<strong>" + "Current location: " + response.name + "</strong>" + " (" + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + ")");
                city.append(("<img id='wicon' src='' alt='Weather icon'>"));
                $(".temp").text("Temperature (F)" + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2));
                $(".wind").text("Wind Speed:" + response.wind.speed);
                $(".humidity").text("Humidity:" + response.main.humidity);
                $(".uvIndex").text("UV Index:");
                $('#wicon').attr('src', iconurl);

                var cityLat = response.coord.lat;
                var cityLng = response.coord.lon;
                // get UV index
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLng,
                    method: "GET"
                })

                    .then(function (response) {
                        // append UV index value to current weather div
                        $(".uvIndex").text("UV Index:" + response.value);

                        console.log(response);

                    });


            })
    });
}
currentWeather()
searchHistory()

// function to get searched city data

function showResults() {
    if (city !== "") {

        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        // run AJAX for OpenWeather API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (response) {
                var iconcode = response.weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

                console.log(response)

                // create HTML for data
                var city = $(".city").html("<strong>" + response.name + "</strong>" + " (" + (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear() + ")");
                city.append(("<img id='wicon' src='' alt='Weather icon'>"));
                $(".temp").text("Temperature (F)" + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(2));
                $(".wind").text("Wind Speed:" + response.wind.speed);
                $(".humidity").text("Humidity:" + response.main.humidity);
                $(".uvIndex").text("UV Index:");
                $('#wicon').attr('src', iconurl);

                var cityLat = response.coord.lat;
                var cityLng = response.coord.lon;
                // get UV index
                $.ajax({
                    url: "https://api.openweathermap.org/data/2.5/uvi?appid=" + apiKey + "&lat=" + cityLat + "&lon=" + cityLng,
                    method: "GET"
                })

                    .then(function (response) {
                        // append UV index value to current weather div
                        $(".uvIndex").text("UV Index:" + response.value);

                        console.log(response);

                    });
            });

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

        // run AJAX for OpenWeather API
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(function (secondResponse) {
                var fiveDay = $(".five")
                fiveDay.empty()

                for (var i = 2; i < secondResponse.list.length; i += 8) {
                    var secondIconCode = secondResponse.list[i].weather[0].icon;
                    var secondIconUrl = "http://openweathermap.org/img/w/" + secondIconCode + ".png";

                    console.log(secondIconCode)
                    $(".five-day").text("Five Day Forecast:")

                    var fiveDayCard = $("<div>")
                    fiveDayCard.attr("class", "col style")
                    var tempDate = secondResponse.list[i].dt_txt

                    fiveDayCard.append($("<h5>" + 'Date:' + tempDate.substring(0, 10) + "</h5>"))
                    fiveDayCard.append(("<img id ='wicon2' src=" + secondIconUrl + " alt= 'Weather icon'>"))
                    fiveDayCard.append($("<h6>" + "Temp: " + ((secondResponse.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2) + " &#176F" + "</h6>"))
                    fiveDayCard.append(("<h6>" + "Humidity: " + secondResponse.list[i].main.humidity + "%"))
                    fiveDay.append(fiveDayCard)
                }
            })
    }
    else {
        alert("Please enter a city name")
    }
}
$("button").on("click", function () {
    var cityContent = $("#get-weather")

    city = cityContent.val()

    if (pushGo.includes(city) || city == "") {
        localStorage.setItem("pastSearch", pushGo)

    } else {
        pushGo.push(city)

        localStorage.setItem("pastSearch", pushGo)
        var addHistoryList = $("<div class='historylist' city=" + city.replace(" ", "-") + ">" + city + "</div>")

        $(".search-data").append(addHistoryList)
    }

    console.log(pushGo)

    showResults()
    clickHistory()
})
function clickHistory() {
    $(".historylist").on("click", function () {

        var pushCity = $(this).attr("city")
        city = pushCity.replace("-", " ")
        showResults()
    })
}
clickHistory()
