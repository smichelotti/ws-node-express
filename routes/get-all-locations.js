"use strict";

var $ = require('jquery'),
    request = require("request"),
    NodeCache = require("node-cache"),
    locationUtils = require("./get-single-location"),
    apiCache = new NodeCache({ stdTTL: 30 });


exports.getAll = function(req, res) {

    apiCache.get("all-locations", function(err, value){
        var timestamp = new Date().getSeconds();

        if ($.isEmptyObject(value)){
            console.log("Getting all locations... " + timestamp);
            getAllLocations(res);
        }
        else{
            console.log("Found object in cache! " + timestamp);
            res.send(value);
        }
    });
};


var getAllLocations = function(res){
    var locationUrl = "http://www.liscr.com/liscr/Location/tabid/195/Default.aspx",
        locationList = [],
        defList = [];

    request(locationUrl, function(error, response, body) {
        var locations = $(body).find("li[nid='195'] li");

        locations.each(function(index, value) {
            var def = $.Deferred();
            defList.push(def);

            var locationName = $(value).find("span").html();
            var locationLink = $(value).find("a").attr("href");

            locationUtils.getLocationDetails(locationLink, function(locationDetails){
                var location = { name: locationName, details: locationDetails };
                locationList.push(location);
                def.resolve();
            });
        });

        $.when.apply($, defList).then(function() {
            console.log("*Everything* is complete. Length: " + locationList.length) ;

            // for (var i = 0; i < locationList.length; i++) {
            //     var loc = locationList[i];
            //     console.log("*************************************");
            //     console.log(loc.name);
            //     console.log("Address: " + loc.details.address);
            //     console.log("Phone: " + loc.details.phone);
            //     console.log("Contacts: " + loc.details.contacts);
            // }

            console.log("Getting all locations complete.");
            apiCache.set("all-locations", locationList);
            res.send(locationList);
        });

    });
};
