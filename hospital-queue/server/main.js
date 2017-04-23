import { Meteor } from 'meteor/meteor';

Meteor.startup(function () {
    Meteor.call('wipeUserData');
    Meteor.call('wipeHospitalData');
    Meteor.call('wipeUserInfo');
    Meteor.call('virtualQueue.wipe');

    Meteor.call('virtualQueue.insert', "SojK48jHDRMvXZjuw", "John", "14.00-15.00");
    Meteor.call('virtualQueue.insert', "SojK48jHDRMvXZjuw", "Kammy", "16.00-17.00");
    Meteor.call('virtualQueue.insert', "SojK48jHDRMvXZjuw", "Lee", "16.00-17.00")
});