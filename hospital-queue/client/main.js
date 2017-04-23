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
    //GoogleDistance.apiKey('AIzaSyBoX34mlKXuDH-GxofMGX3Uh-wnE4lk_Xc');
});
//Depends on type of user.
var loggedInUserId = null;
var latLng = null;

Template.loginPage.onCreated(() => {
    Meteor.subscribe("userdata.all");
});

Template.userSide.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("userinfo.all");
    Meteor.subscribe("virtualqueue.all");
    GoogleMaps.ready('exampleMap', function(map) {
        latLng = Geolocation.latLng();
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(latLng.lat, latLng.lng),
            map: map.instance
        });
        GoogleDistance.get(
        {
            origin: latLng.lat+','+latLng.lng,
            destinations: ['2 Po Ning Ln, Tseung Kwan O', '130 Hip Wo St, Kwun Tong', '118 Shatin Pass Rd, Chuk Un']
        },
        function(err, data) {
            if (err) return console.log(err);
            // to get the data data[0].durationValue
            console.log(data[0].durationValue);
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
    },
    "click #arrivalButton" : () => {
    const name = UserData.findOne({_id:loggedInUserId}).username;
    if(name.length > 0) {
        Meteor.call('virtualQueue.insert', loggedInUserId, name, "19.00-20.00");
    }

}
});

Template.hospitalSide.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("hospitaldata.all");
    Meteor.subscribe("virtualqueue.all");
});

Template.hospitalSide.events({
    "submit #offQueueReg" : function (event) {
        event.preventDefault();
        let name = event.target.nameBox.value;
        const info = HospitalData.find({uid:loggedInUserId}).fetch();
        if (info.length > 0) {
            let result = info[0].offline._storage;
            let result2 = info[0].offline;
            let newQueue = new Queue();
            newQueue._oldestIndex = result2._oldestIndex;
            newQueue._newestIndex = result2._newestIndex;
            newQueue._storage = result2._storage;
            newQueue._last = result2._last;
            let newPerson = new Patient(name, Math.random(), "stuff", Math.random());
            newQueue.enqueue(newPerson);
            Meteor.call('hospitalData.updateOffline', loggedInUserId, newQueue);
            return result
        }
    },
    "submit #onQueueReg" : function (event) {
        event.preventDefault();
        let name = event.target.nameBox.value;
        Meteor.call('virtualQueue.removeOne', name);
        const info = HospitalData.find({uid:loggedInUserId}).fetch();
        if (info.length > 0) {
            let result = info[0].online._storage;
            let result2 = info[0].online;
            let newQueue = new Queue();
            newQueue._oldestIndex = result2._oldestIndex;
            newQueue._newestIndex = result2._newestIndex;
            newQueue._storage = result2._storage;
            newQueue._last = result2._last;
            let newPerson = new Patient(name, Math.random(), "stuff", Math.random());
            newQueue.enqueue(newPerson);
            Meteor.call('hospitalData.updateOnline', loggedInUserId, newQueue);
            return result
        }
    }
});

Template.hospitalSide.helpers({
    onlineQueue : () => {
        const info = HospitalData.find({uid:loggedInUserId}).fetch();
        if (info.length > 0) {
            let result = info[0].online._storage;
            return result
        }
    },
    offlineQueue: () => {
        const info = HospitalData.find({uid:loggedInUserId}).fetch();
        if (info.length > 0) {
            let result = info[0].offline._storage;
            return result
        }
    },
    virtualQueue: () => {
        return VirtualQueue.find().fetch();
    }
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


Template.bookingForm.events({
   "submit form" : function (event) {
       event.preventDefault();
       let severity = event.target.severity.value;
       let methodOfTransport = event.target.methodOfTransport.value;
       let newBooking = {severity:severity, methodOfTransport:methodOfTransport};
       Meteor.call('userInfo.addBookingData', loggedInUserId, newBooking);
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
});

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
            console.log(lineOffline);
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
function Patient(name, id, bookingDets, arrivalTime) {
    this.name = name;
    this.id = id;
    this.bookingDetails = bookingDets;
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