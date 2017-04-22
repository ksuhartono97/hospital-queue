/**
 * Created by kristiansuhartono on 22/4/2017.
 */

Meteor.publish("userdata.all", () => {
    return UserData.find();
});

Meteor.publish("userinfo.all", () => {
    return UserInfo.find();
});