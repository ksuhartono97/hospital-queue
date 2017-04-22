import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import './userSide.html';
import './hospitalSide.html';

Template.loginPage.onCreated(() => {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("userinfo.all");
});

Template.userSide.onCreated(()=> {
   Meteor.subscribe("userdata.all");
   Meteor.subscribe("userinfo.all");
});

Template.registerPage.onCreated(()=> {
    Meteor.subscribe("userdata.all");
    Meteor.subscribe("userinfo.all");
});

Template.loginPage.events({
    "click #registerButton": () => {
        FlowRouter.go("/register")
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

Template.loginPage.events({
    'submit form': function(event) {
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;

        Meteor.call("userData.login", emailVar, passwordVar, function(error, result) {
            if(error) {
                alert("Failed to login, check your credentials")
            }
            if(result.length > 0) {
                if(result[0].group == "hospital") FlowRouter.go("/hospitalside");
                else if(result[0].group == "general") FlowRouter.go("/userside");
                else alert("ERROR, CONTACT ADMIN")
            }
            else {
                alert("Failed to login, check your credentials")
            }
        });
    }
})

Template.registerPage.events({
    'submit form': function(event) {
        event.preventDefault();
        let emailVar = event.target.loginEmail.value;
        let passwordVar = event.target.loginPassword.value;
        let name = event.target.namefield.value;

        Meteor.call("userData.insert", emailVar, name, passwordVar, "general", function(error, result) {
            console.log(result);
            Meteor.call("userInfo.create", UserData.find({"_id" : result}).fetch()[0]._id);
        });

        console.log("Form submitted.");
        FlowRouter.go("/")
    }
});
