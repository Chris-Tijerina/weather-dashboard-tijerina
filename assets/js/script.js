// Variable pulled from the user input
var citySearch;
var lat;
var lon;


var previousCities = function() {
var cityHistory = JSON.parse(localStorage.getItem("searchHistory"))
console.log(cityHistory)
$("#previous-searches").empty();
    for (var i = cityHistory.length - 1; i >= 0; i--) {
        var historyButton = $("<button type='submit'>")
        .addClass("searchBtn btn btn-secondary col-12 mb-3")
        .text(cityHistory[i])
        .appendTo("#previous-searches")
    }

}

// gather form input data on "click" of the Search Button
$(".searchBtn").on("click", function () {
    $(".error").text("")
    citySearch = $("#citySearch").val()
    getCityData()
})

// save the names of any searched cities to an array
var setSearchHistory = function () {

    var searchHistory = new Array();

    // Check local storage array for any previous data
    if (localStorage.getItem("searchHistory")) {
        var storageSearchHistory = localStorage.getItem("searchHistory")
        searchHistory = searchHistory.concat(JSON.parse(storageSearchHistory))
    }
    // cut off the list at some length
    if (searchHistory.length >= 8) {
        searchHistory.shift()
    }
    // add the current value to the array
    searchHistory.push(citySearch)

    // save the array to the local storage
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
}




// call API return data for city
var getCityData = function () {
    var cityName = citySearch.trim()
    console.log(cityName)
    var fetchData = fetch("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=7600d4fdd9952dcc11a35941ea3373d6")

        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.Statustext);
            }
        })

        .then(data => {
            console.log("success", data);
            setSearchHistory();
            var date = new Date();
            var dateToday = date.toLocaleDateString(
                'en-US', {
                year: "numeric",
                month: "numeric",
                day: "numeric"
            })


            $(".city-name").text(data.name + "(" + dateToday + ")");
            $(".city-temp").text("Temperature: " + data.main.temp + "\xB0F");
            $(".city-wind-speed").text("Wind Speed: " + data.wind.speed + " MPH")
            $(".city-hum").text("Humidity: " + data.main.humidity + "%");
            var lat = data.coord.lat;
            var lon = data.coord.lon;

            var fetchDataAgain = ("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=7600d4fdd9952dcc11a35941ea3373d6")
            fetch(fetchDataAgain)
                .then(response => {
                    if (response.status >= 200 && response.status <= 299) {
                        return response.json();
                    } else {
                        throw Error(response.Statustext);
                    }
                })

                .then(data => {
                    console.log("success", data);
                    $(".city-uv").text("UV Index: ")

                    var uvIndex = data.daily[0].uvi
                    var indexText = $("<p id ='uv-text'>").text(uvIndex)


                    console.log(uvIndex)
                    if (uvIndex <= 2) {

                        indexText.addClass("bg-success bg-opacity-75 border border-dark border-1 rounded-pill")

                    } else if (uvIndex >= 3 && uvIndex <= 5) {

                        indexText.addClass("bg-warning bg-opacity-50 border border-dark border-1 rounded-pill")

                    } else if (uvIndex >= 6 && uvIndex <= 7) {

                        indexText.addClass("bg-warning border border-dark border-1 rounded-pill")

                    } else if (uvIndex >= 8 && uvIndex <= 10) {

                        indexText.addClass("bg-danger bg-opacity-75 border border-dark border-1 rounded-pill")

                    } 
                    indexText.appendTo("#city-uv")

                    dailyWeather(data)
                    previousCities()
                })
        })
        .catch(error => {
            //TODO create alert for error message or paragraph in search div
            $(".error").text("city not found, please check the spelling and try again")
        });
}

var dailyWeather = function(data) {
    var dayElem = $(".daily")
    var dailyDate = new Date();

    for (var i = 0; i < dayElem.length; i++) {
        let dateIndex = i+1
        dailyDate.setDate(dailyDate.getDate()+1)
        
        var dailyDateText = dailyDate.toLocaleDateString(
            'en-US', {
            year: "numeric",
            month: "numeric",
            day: "numeric"
        })
        $(dayElem[i]).children(".daily-date").text(dailyDateText)
        $(dayElem[i]).children(".daily-temp").text("Temp: " + data.daily[dateIndex].temp.day + "\xB0F")
        $(dayElem[i]).children(".daily-wind").text("Wind: " + data.daily[dateIndex].wind_speed + " MPH")
        $(dayElem[i]).children(".daily-humidity").text("Humidity: " + data.daily[dateIndex].humidity + "%")
    }
}


previousCities()