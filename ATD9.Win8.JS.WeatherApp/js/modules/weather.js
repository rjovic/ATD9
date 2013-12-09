define(["jquery", "knockout"], function($, ko) {

    var city = ko.observable("Zagreb, Croatia");
    var isLoading = ko.observable(false);
    var forecast = ko.observableArray();
    
    function forecastData(weather) {
        var date = new Date(weather.dt * 1000);
        var shortDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

        return {
            date: ko.observable(shortDate),
            description: ko.observable(weather.weather[0].description),
            icon: ko.observable(weather.weather[0].icon),
            temp: ko.observable(parseInt(weather.temp.day)),
            temp_min: ko.observable(parseInt(weather.temp.min)),
            temp_max: ko.observable(parseInt(weather.temp.max)),
            preasure: ko.observable(weather.pressure),
            humidity: ko.observable(weather.humidity)
        };
    }
    
    function retriveForecast() {
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast/daily?units=metric&cnt=10&q=" + city(),
            success: function (response) {
                if (response.cod == "200") {

                    forecast([]);
                    isLoading(false);

                    $.each(response.list, function(index, weather) {
                        forecast.push(new forecastData(weather));
                    });

                    updateTileWithWeatherInfo();
                } else {
                    (new Windows.UI.Popups.MessageDialog("I didn't find anything for given city.", "Warning")).showAsync().done();
                }
            },
            beforeSend: function () {
                isLoading(true);
            }
        });
    }
    
    function updateTileWithWeatherInfo() {
        var notifications = Windows.UI.Notifications;
        var tileXml = notifications.TileUpdateManager.getTemplateContent(notifications.TileTemplateType.tileWideSmallImageAndText02);

        var weather = forecast()[0];

        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(tileXml.createTextNode(city()));
        tileTextAttributes[1].appendChild(tileXml.createTextNode("Current temp : " + weather.temp()));
        tileTextAttributes[2].appendChild(tileXml.createTextNode("Min temp : " + weather.temp_min()));
        tileTextAttributes[3].appendChild(tileXml.createTextNode("Max temp : " + weather.temp_max()));

        var imageAttribute = tileXml.getElementsByTagName("image");
        imageAttribute[0].setAttribute("src", "http://api.openweathermap.org/img/w/" + weather.icon() + ".png");

        var tileNotification = new notifications.TileNotification(tileXml);

        notifications.TileUpdateManager.createTileUpdaterForApplication().update(tileNotification);
    }

    return {
        city: city,
        isLoading: isLoading,
        getForecast: retriveForecast,
        forecast: forecast
    };

});