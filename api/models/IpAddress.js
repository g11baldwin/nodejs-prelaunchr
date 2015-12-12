/**
* IpAddress.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
    attributes: {
        sourceIp: {
            type: 'string'
        },
        numberJoinedFromThisIp: {
            type: 'integer'
        }
    },


    checkAndAddIp: function (ipaddress, cb) {
        console.log("checkAndAddIp called with ipaddress:", ipaddress);

        IpAddress.findOne({
            sourceIp: ipaddress
        }).exec(function (err, ipa) {
            if (ipa) {
                console.log("\nIP Address already in use, ipa:", ipa);
                var tmp = ipa.numberJoinedFromThisIp;
                console.log("\nIP Address already exists, with ", tmp + " associated!");
                if (tmp > 1) {
                    cb("\nError: limit of emails from this IP address!", null); // at the limit
                } else {
                    ipa.numberJoinedFromThisIp = tmp + 1;
                    ipa.save(function (err, ipsaved) {
                        if (err) console.error("ERROR:", err);
                        console.log("\nipsaved=", ipsaved);
                        cb(null, ipsaved);
                    });
                }
            } else {
                console.log("\nIP address isn't in use, add it, ipa:", ipaddress);
                var newIp = {};
                newIp.sourceIp = ipaddress;
                newIp.numberJoinedFromThisIp = 0;
                IpAddress.create(newIp, function(err, ipa) {
                    if (err) {
                        console.error("\nError- ipAddress create err:", err);
                        cb("Error creating new IP address record", null);
                    } else {
                        if (ipa) {
                            ipa.sourceIp = ipaddress;
                            ipa.numberJoinedFromThisIp = 1;
                            ipa.save(function (err, ipac) {
                                if (err) console.error("\nError: ipaddress.save error: ", err);
                                cb(null, ipac);
                            });
                        } else {
                            cb("\nError: creating new IP Address record", null);
                        }
                    }
                });
            }
        });
    }
};