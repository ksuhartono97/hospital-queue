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