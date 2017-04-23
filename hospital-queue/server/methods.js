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
        UserInfo.insert({type:"info", uid: udataref, bookings: []})
    },
    'userInfo.query' : (uid) => {
        return UserInfo.find({uid:uid}).fetch();
    },
    'userInfo.addBookingData' : (uid, newData) => {
        let temp = UserInfo.find({uid:uid}).fetch()[0].bookings;
        temp.push(newData);
        UserInfo.update({uid:uid}, {$set : {bookings: temp}})
    },
    'wipeUserInfo' : () => {
        UserInfo.remove({type:"info"})
    },
    'hospitalData.create' : (udataref, onQueue, offQueue) => {
        HospitalData.insert({type:"hosp", uid: udataref, online: onQueue, offline: offQueue})
    },
    'wipeHospitalData' : () => {
        HospitalData.remove({type:"hosp"})
    },
    'hospitalData.updateOffline' : (udataref, offQueue) => {
        doc_id = HospitalData.findOne({uid:udataref})._id;
        HospitalData.update({_id:doc_id}, {$set : {offline: offQueue}});
    },
    'hospitalData.updateOnline' : (udataref, onQueue) => {
        doc_id = HospitalData.findOne({uid:udataref})._id;
        HospitalData.update({_id:doc_id}, {$set : {online: onQueue}});
    }

});