/**
 * Created by kristiansuhartono on 22/4/2017.
 */

Meteor.methods({
    'userData.insert' : (email, username, password, group)=> {
        return UserData.insert({type:"user", group:group, email:email, username:username, password: password})
    },
    'userData.login' : (email, password) => {
        return UserData.find({type:"user", email:email, password:password}).fetch()
    },
    'wipeUserData' : () => {
        UserData.remove({type: "user"})
    },
    'userInfo.create' : (udataref)=> {
        UserInfo.insert({type:"info", uid: udataref})
    },
    'wipeUserInfo' : () => {
        UserInfo.remove({type:"info"})
    },
    'hospitalData.create' : (udataref, onQueue, offQueue) => {
        HospitalData.insert({type:"hosp", uid: udataref, online: onQueue, offline: offQueue})
    },
    'wipeHospitalData' : () => {
        HospitalData.remove({type:"hosp"})
    }

});