import {Template} from 'meteor/templating';
import {ReactiveVar} from 'meteor/reactive-var';
import { GoogleMaps } from 'meteor/dburles:google-maps';
import { GoogleDistance } from 'meteor/andrei:google-distance';

import './main.html';
import './userSide.html';
import './hospitalSide.html';
import './form.html';
var MAP_ZOOM = 15;

Meteor.startup(function() {
    GoogleMaps.load({ key: 'AIzaSyBoX34mlKXuDH-GxofMGX3Uh-wnE4lk_Xc' });
    // GoogleDistance.key('AIzaSyBoX34mlKXuDH-GxofMGX3Uh-wnE4lk_Xc');
});

var loggedInUserId = null;

Template.loginPage.onCreated(() => {
    Meteor.subscribe("userdata.all");
    GoogleDistance.get(
        {
            origin: 'San Francisco, CA',
            destination: 'San Diego, CA'
        },
        function(err, data) {
            if (err) return console.log(err);
            console.log(data.durationValue);
        });
});

Template.userSide.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("userinfo.all");
    GoogleMaps.ready('exampleMap', function(map) {
        var latLng = Geolocation.latLng();
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
        });
    });
});

Template.userSide.helpers({
    geolocationError: function() {
        var error = Geolocation.error();
        return error && error.message;
    },
    exampleMapOptions: function() {
        var latLng = Geolocation.latLng();
        // Initialize the map once we have the latLng.
        // Make sure the maps API has loaded
        if (GoogleMaps.loaded() && latLng) {
            // Map initialization options
            return {
                center: new google.maps.LatLng(latLng.lat, latLng.lng),
                zoom: MAP_ZOOM
            };
        }
    },
    bookingArray : () => {
        console.log(loggedInUserId)
        const info = UserInfo.find({uid:loggedInUserId}).fetch();
        if (info.length > 0) {
            let result = info[0].bookings;
            console.log(result);
            return result
        }
    }
});

Template.userSide.events({
    "click #back": () => {
        FlowRouter.go("/")
    },
    "click #createBooking": () => {
        FlowRouter.go("/userside/booking")
    }
});

Template.hospitalSide.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("hospitaldata.all");
});

Template.registerPage.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("userinfo.all");
    Meteor.subscribe("hospitaldata.all");
});

Template.loginPage.events({
    "click #registerButton": () => {
        FlowRouter.go("/register")
    }
});



/*
Template.hospitalSide.events({
    "click #back": () => {
        FlowRouter.go("/")
    }
});*/

Template.bookingForm.events({
   "submit form" : function (event) {
       event.preventDefault();
       let severity = event.target.severity.value;
       let methodOfTransport = event.target.methodOfTransport.value;
       let newBooking = {severity:severity, methodOfTransport:methodOfTransport};
       Meteor.call('userInfo.addBookingData', loggedInUserId, newBooking);
       console.log(loggedInUserId);
       FlowRouter.go("/userside");
   }
});

Template.loginPage.events({
    'submit form': function (event) {
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;

        Meteor.call("userData.login", emailVar, passwordVar, function (error, result) {
            if (error) {
                alert("Failed to login, check your credentials")
            }
            if (result.length > 0) {
                if (result[0].group == "hospital") {
                    loggedInUserId = result[0]._id;
                    FlowRouter.go("/hospitalside");
                }
                else if (result[0].group == "general"){
                    loggedInUserId = result[0]._id;
                    FlowRouter.go("/userside");
                }
                else alert("ERROR, CONTACT ADMIN")
            }
            else {
                alert("Failed to login, check your credentials")
            }
        });
    }
})

Template.registerPage.events({
    'submit form': function (event) {
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;
        let name = event.target.namefield.value;
        let radio = event.target.radio1.value;
        if (radio == 1) { //Hospital
            let lineOnline = new Queue();
            let lineOffline = new Queue();
            Meteor.call("userData.insert", emailVar, name, passwordVar, "hospital", function (error, result) {
                Meteor.call("hospitalData.create", result, lineOnline, lineOffline);
            });

        }
        else if (radio == 0) { //Client
            Meteor.call("userData.insert", emailVar, name, passwordVar, "general", function (error, result) {
                Meteor.call("userInfo.create", result);
            });
        }

        FlowRouter.go("/")
    }
});


/// patient object
function Patient(first, last, idNum, arrivalTime) {
    this.firstName = first;
    this.lastName = last;
    this.idNum = idNum;
    this.arrivalTime = arrivalTime;
};

///// queue object
function Queue() {
    this._oldestIndex = 1;
    this._newestIndex = 1;
    this._storage = [];
    this._last = false;
}

// size
Queue.prototype.size = function () {
    return this._newestIndex - this._oldestIndex;
};

//enqueue
Queue.prototype.enqueue = function (data) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
};

// dequeue
Queue.prototype.dequeue = function () {
    var oldestIndex = this._oldestIndex,
        newestIndex = this._newestIndex,
        deletedData;
    if (oldestIndex !== newestIndex) {
        deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
        this._last = true;/// last time unit lastest user is dequeued
        console.log(this._last);
        return deletedData;
    }
};

//move the patient
function move(lineOffline, lineOnline) {
    // online patient arrive
    if (lineOffline._last) {
        if (lineOnline._storage[lineOnline._oldestIndex].arrivalTime
            <= lineOffline._storage[lineOffline._oldestIndex].arrivalTime) {
            var a = lineOnline.dequeue();
        }
        else {
            var a = lineOffline.dequeue();
        }
    }
    else {
        var a = lineOffline.dequeue();
    }
    return a;
}
