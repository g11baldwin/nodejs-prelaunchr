/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */



var config = require("../../config/local-local.js"),
    _ = require('lodash');


/**
 * Send welcome
 */

module.exports = {

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
