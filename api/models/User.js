/**
* User.js
*
* @description :: Model for user info.
* @docs        :: TODO: add more doc
*
*/

var haveRunOnce = false;

module.exports = {
    attributes: {
        username: { // use email
            type: 'string'
        },
        password: { // no password required
            type: 'string',
            minLength: 8
        },
        confirm: { // NA
            type: 'string',   // used to confirm password on changes
            minLength: 8
        },
        email: {
            type: 'email',
            required: true,
            unique: true
        },
        sourceIp: {
            type: 'string'
        },
        role: {
            type: 'string',
            defaultsTo: 'user'    // either user, admin, or TBD
        },
        enabled: {
            type: 'Boolean',
            defaultsTo: true
        },
        invitedByUserId: { // the mongo id of user that invited this user to signup (or null if they signed up w/o invite)
            type: 'string'
        },
        mySharingToken: { // token that is given to others to associate their signup with my invite
            type: 'string'
        },
        numberFriendsJoined: {
            type: 'integer'
        },
//        friendsJoinedEmails : { // keep array of all who joined via our invite
//            type: []
//        },

        toJSON: function () {
            var obj = this.toObject();
            delete obj.password;
            return obj;
        }
    },

    beforeCreate: function (user, cb) {
        cb();
    },

    verifyPassword: function (pwd) {
        console.error('NB: not validating passwords for this app!');
        return user;
    }

};
