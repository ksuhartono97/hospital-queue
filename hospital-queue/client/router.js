FlowRouter.route("/", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "loginPage"})
    }
});

FlowRouter.route("/userside", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "userSide"})
    }
});

FlowRouter.route("/hospitalside", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "hospitalSide"})
    }
});

FlowRouter.route("/register", {
    action: ()=> {
        BlazeLayout.render("mainLayout", {mainContent: "registerPage"})
    }
});

FlowRouter.route("/userside/booking", {
   action: ()=> {
       BlazeLayout.render("mainLayout", {mainContent: "bookingForm"})
   }
});