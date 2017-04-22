import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './userSide.html';
import './hospitalSide.html';

Template.loginPage.onCreated(() => {
    Meteor.subscribe("userdata.all");
});

Template.loginPage.events({
    "click #userButton": () => {
        FlowRouter.go("/userside")
    },
    "click #hospitalButton": () => {
        FlowRouter.go("/hospitalside")
    }
});

Template.userSide.events({
    "click #back": () => {
        FlowRouter.go("/")
    }
});

Template.hospitalSide.events({
    "click #back": () => {
        FlowRouter.go("/")
    }
});

