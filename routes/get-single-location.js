"use strict";

var $ = require('jquery'),
    request = require("request");

var createTrimmedArray = function(text){
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++) {
        lines[i] = $.trim(lines[i]);
    }
    return lines;
};


exports.getLocationDetails = function(locationHref, callback){
    request(locationHref, function(error, response, body) {
        var locationRows = $(body).find("#dnn_Contenttop div div div table tbody tr");

        var addressText = $(locationRows[1]).find("td").text();
        var address = createTrimmedArray(addressText);

        var phoneText = $.trim($(locationRows[2]).find("td").text());
        var phone = createTrimmedArray(phoneText);

        var contactsText = $(locationRows[4]).find("td").text();
        var contacts = createTrimmedArray(contactsText);

        var locationDetail = { address: address, phone: phone, contacts: contacts };
        callback(locationDetail);
    });
};
