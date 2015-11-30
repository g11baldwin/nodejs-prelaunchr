/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var localConfig = require("../../config/local.js"),
    uuid = require('uuid'),
    nodemailer = require('nodemailer'),
    _ = require('lodash');

/**
 * Send reset password email
 */
function sendMail(mailOptions) {
    var transport = nodemailer.createTransport(config.mailer);
    transport.sendMail(mailOptions, function(err, response) {
        if (err) return err;
        return response;
    });
}

module.exports = {

    login: function (req, res) {
        res.view();
    },
    loginfailed: function (req, res) {
        res.view();
    },
    process: function(req, res){
    },

    logout: function (req,res){
    },

    reset: function (req, res) {
        console.error("password reset not supported");
        res.view();
    },

    create: function(req, res) {
        console.log('creating a new user, req.body=', req.body);
        User.create(req.body, function userCreated(err, user) {
            if (err) {
                console.error("ERROR: ", err);
                req.flash('error', 'creating user... try again.')
                return res.redirect('/');
            }

            if(user) {
                console.info("user created: ", user);
                user.creatorname = 'null';
                user.email = req.email;;
                user.mySharingToken = uuid.v4();
                user.sourceIp = req.connection.remoteAddress;
                var t = new Date();
                user.created = t.now()
                user.enabled = true;

                user.save(function(err, user) {
                    if(err) {
                        console.error("Error: ", err);
                        return res.serverError("Error creating new user.");
                    }

                    console.log('Sending welcome email to new user:', user.email);
                    var mailOptions = {
                        from: localConfig.smtpTransportConfig.auth.user,
                        to: user.email,
                        subject: "Welcome to Vidii!",
                        text: "Hi " + user.email + ",\nYou've been registered with the Vidii rewards program. Your share code is: " + user.mySharingToken +  "  Please share this code with your friends to acumulate awards points"
                    };

                    sendMail(mailOptions, function(err) {
                        if (err) res.end('Error sending welcome email: ' + err)
                    });
                });
            }
            res.redirect('user/share'); // redirect to show user how to share
        });
    },

    share: function(req, res){
        console.log("showing user how to share...");
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
    index: function (req, res) {
        console.info("user index user:", req.user);
        User.find({}).limit(100).done(function(err, users) {
            if(err) return res.serverError("Error on user lookup");
            return res.view({ admin: 'true', users: users});
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