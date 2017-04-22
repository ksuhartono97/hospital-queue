/**
 * Created by kristiansuhartono on 22/4/2017.
 */

Meteor.methods({
    'userData.insert' : (username, group)=> {
        UserData.insert({type:"user", group:group, username:username})
    },
    'wipeUserData' : () => {
        UserData.remove({type:"user"})
    }
});