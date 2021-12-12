// Variable pulled from the user input
var citySearch;

// var previousCities = function() {
    
//     for (i = 0; i < localStorage.length; i++) {
//         var storageSlot = localStorage.key([i])
//         $("<button>"+JSON.parse(localStorage.getItem(storageSlot))+"</button>").appendTo ("previous-searches")
//     }
// }

// gather form input data on "click" of the Search Button
$(".searchBtn").on("click", function () {
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
var getCityData = function() {
    var cityName = citySearch
    console.log(cityName)
    var fetchData = fetch("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=7600d4fdd9952dcc11a35941ea3373d6")

        .then (response => {
            if (response.status >= 200 && response.status <= 299) {
                return response.json();
            } else {
                throw Error(response.Statustext);
            }
        })

        .then (data => {
            console.log("success", data)
            setSearchHistory()

        var lat = data.coord.lat
        var lon = data.coord.lon
        console.log(lat, lon)

        temp = data.main.temp
        wind = data.wind.speed 
        humid = data.main.humidity
        console.log (temp, wind, humid)

        $

        })
        .catch (error => {
            //TODO create alert for error message or paragraph in search div
            $(".error").text("city not found, please check the spelling and try again")
        }) 

    
}

// previousCities()