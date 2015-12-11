/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



var config = require("../../config/local-local.js"),
    uuid = require('uuid'),
    nodemailer = require('nodemailer'),
    _ = require('lodash'),
    randomString = require('random-string'), // defaults to 8 char string
    once = require('once');


var inUseStrings = []; // array loaded up at init


function loadStrings() {
    console.log("loading up strings:")
    User.find({}).exec(function(err, users) {
        if(err) console.error("Error loading up user records, err:", err);
        users.forEach(function(u) {
            console.log("pushing another user mySharingToken into list:", u.mySharingToken);
            inUseStrings.push(u.mySharingToken);
        });
    });
}

function findUnusedString() {
    loadStrings = once(loadStrings);
    var done = false;

    while(!done) {
        var tmp = randomString({length: 4}); // candidate string
        if (_.findIndex(inUseStrings, tmp) == -1) {
            console.log("found unusedString:", tmp); // not in use
            inUseStrings.push(tmp);
            return tmp;
        }
    }
}


/**
 * Send welcome
 */
function sendWelcomeMail(user) {
    console.log('Sending welcome email to new user:', user.email);
    var transport = nodemailer.createTransport(config.mailer);

    var mailOptions = {
        from: 'Vidii support <' +  config.mailer.auth.user  +'>',
        to: user.email,
        subject: "Welcome to Vidii!",
        text: "Hi " + user.email + ",\n\nCongratulations, you are now registered with the Vidii rewards program! This program allows you to invite friends to join you on Vidii, and accumulate award points. Your share code is: " + config.referralURLbase + 'q/' + '?r=' + user.mySharingToken +  '\n' + "Please share this code with your friends and when they sign up you'll acumulate award points (you can check how you're doing by returning to the vidii.co page and entering your email address). " + '\n\n' + "The Vidii team"
    };

    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
}

module.exports = {
    index: function(req, res) {
      return res.redirect('homepage');
    },
    login: function (req, res) {
      return res.redirect('homepage');
    },
    loginfailed: function (req, res) {
      return res.redirect('homepage');
    },
    process: function(req, res){
      return res.redirect('homepage');
    },

    logout: function (req,res){
      return res.redirect('homepage');
    },

    reset: function (req, res) {
      console.error("password reset not supported");
      return res.redirect('homepage');
    },


    create: function(req, res) {
      console.log('creating a new user, req.body=', req.body);
      console.log("user create, testing for referral (invitedByUserId):", req.param('invitedByUserId'));
      var retNumFriends = 0;

      User.findOne({
        email: req.body.email // if already exists, return same token
      }).exec(function(err, user) {
        if (user) {
          console.log("user already exists, returning existing token:", user.mySharingToken);
//                res.redirect('user/share');
          retNumFriends = user.numberFriendsJoined;

          return res.view('user/share', {
            referralurl: config.referralURLbase + 'q/' + '?r=' + user.mySharingToken,
            numberfriendsjoined: retNumFriends,
            error: ''
          });

        } else {

          User.create(req.body, function userCreated(err, user) {
            if (err) {
              console.error("ERROR: ", err);
              req.flash('error', 'creating user... try again.')
              return res.view('/', {
                referralurl: config.referralURLbase + 'q/' + '?r=' + user.mySharingToken,
                numberfriendsjoined: 0,
                error: 'invalid email address, please try again'
              });
            }

            if (user) {
              console.info("user created: ", user);
              user.creatorname = 'null';
              user.email = req.email;

//              user.mySharingToken = user.id; // use our id

                user.mySharingToken = findUnusedString(); // shorten to 5 char string

              user.sourceIp = req.connection.remoteAddress;
              user.numberFriendsJoined = 0;
//                        user.friendsJoinedEmails = [];
              user.enabled = true;
              if(typeof req.param('invitedByUserId') != "undefined") {
                console.log("user created by being invited, invitedByUserId:", req.param('invitedByUserId'));
                user.invitedByUserId = req.param('invitedByUserId');

                // now update the user record for the user that invited us
                User.findOne({
                  mySharingToken : req.param('invitedByUserId')
                }).exec(function(err, invitinguser) {
                  if(err) console.error('ERROR (failure on attribution for invite):', err);
                  if(invitinguser) {
                    console.log("inviting user email:", invitinguser.email);
                    if(typeof invitinguser.numberFriendsJoined != "undefined") {
                      invitinguser.numberFriendsJoined = invitinguser.numberFriendsJoined + 1;
                    } else {
                      invitinguser.numberFriendsJoined = 1;
                    }
                    retNumFriends = invitinguser.numberFriendsJoined;
//                                    invitinguser.friendsJoinedEmails.push(user.email);;
                    invitinguser.save(function(err, invitinguser) {
                      if(err) console.error("ERROR: updating inviting user record", err);

                      user.save(function (err, user) {
                        if (err) {
                          console.error("Error: ", err);
                          return res.serverError("Error creating new user.");
                        } else {
                          console.log("user:", user);
                        }

                        sendWelcomeMail(user, function (err) {
                          if (err) res.end('Error sending welcome email: ' + err)
                        });
                      });
                    });
                  }
                });
              } else {
                retNumFriends = user.numberFriendsJoined;
                user.save(function (err, user) {
                  if (err) {
                    console.error("Error: ", err);
                    return res.serverError("Error creating new user.");
                  } else {
                    console.log("user:", user);
                  }

                  sendWelcomeMail(user, function (err) {
                    if (err) res.end('Error sending welcome email: ' + err)
                  });
                });
              }
            }

            return res.view('user/share', {
              referralurl: config.referralURLbase + 'q/' + '?r=' + user.mySharingToken,
              numberfriendsjoined: user.numberFriendsJoined || 0,
              error: ''
            });

          });
        }
      });
    },


    q: function(req, res){
        console.log('q called');
        console.log("testing for referral (r param):", req.param('r'));
        // redirect this to main create screen, but provide referral code as param
      return res.view('homepagetoo', {
        referralcode: req.param('r'),
        error: ''
      });
    },



    /**
     * Action blueprints:
     *    `/user/edit`
     */
    edit: function(req, res){
        console.error('Error: user edit not supported');
      return res.redirect('homepage');
    },
    /**
     * Action blueprints:
     *    `/user/destroy`
     */
    destroy: function (req, res) {
        console.error('Error: user delete not supported');
        return res.redirect('homepage');
    },


    /**
     * Action blueprints:
     *    `/user/update`
     */
    update: function (req, res) {
        console.error('Error: user update not supported');
        return res.redirect('homepage');
    },

    /**
     * Action blueprints: show list of users
     *    `/user/index`
     *    `/user
     */
    xrayvision: function (req, res) {
        console.info("user list display requested");
        User.find({}).limit(100).exec(function(err, users) {
          if(err) return res.serverError("Error on user lookup");
          return res.view('user/xrayvision', {
            users: users,
            error: ''
          });


        });
    },

    /**
     * Initialization
     */
    _config: function() {
    }

};

/**
 * Sails controllers expose some logic automatically via blueprints.
 *
 * Blueprints are enabled for all controllers by default, and they can be turned on or off
 * app-wide in `config/controllers.js`. The settings below are overrides provided specifically
 * for AuthController.
 *
 * NOTE:
 * REST and CRUD shortcut blueprints are only enabled if a matching model file
 * (`models/Auth.js`) exists.
 *
 * NOTE:
 * You may also override the logic and leave the routes intact by creating your own
 * custom middleware for AuthController's `find`, `create`, `update`, and/or
 * `destroy` actions.
 */

module.exports.blueprints = {

    // Expose a route for every method,
    // e.g.
    // `/auth/foo` =&gt; `foo: function (req, res) {}`
    actions: true,

    // Expose a RESTful API, e.g.
    // `post /auth` =&gt; `create: function (req, res) {}`
    rest: true,

    // Expose simple CRUD shortcuts, e.g.
    // `/auth/create` =&gt; `create: function (req, res) {}`
    // (useful for prototyping)
    shortcuts: false
};
