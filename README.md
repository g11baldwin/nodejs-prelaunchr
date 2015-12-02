# nodeprelaunchr

a [Sails](http://sailsjs.org) application

The nodeprelaunchr app is a nodejs version of the Harry's (shave club) Rails prelaunchr app.
The primary function is to sign potential new users up prior to launching an app. As people sign
up (with an email address) they are provided with a code (UUID) that is encoded in a URL. The URL
can then be shared with their friends, and if/when their friends sign up, then the person who is
already signed up and invited them, get's a credit.
Credits are accumulated and awards are provided for users reaching various quantities of credits.


Restrictions:
1. Email addresses are unique / 1 signup per email address - email addresses are idempotent, so if an
email address is re-entered the same token is returned (whether it's the same person or not)

2. Source IP controlling - limits are placed on the number of signups (regardless of email address provided)
from a single IP address. Currently the system allows a maximum of 2 email addresses from the same IP address.



To run the app:

In development mode:
$ cd
$ cd vidii/nodeprelaunchr
$ node app.js


In production mode:
$ cd
$ cd vidii/nodeprelaunchr
$ forever start app.js



// The following is snipped from an actual runtime:

root@rails vidii/nodeprelaunchr# forever start app.js
warn:    --minUptime not set. Defaulting to: 1000ms
warn:    --spinSleepTime not set. Your script will exit if it does not stay up for at least 1000ms
info:    Forever processing file: app.js


// And to check on status
root@rails vidii/nodeprelaunchr# ps -ef |grep node
root      1353     1 15 18:50 ?        00:00:01 /usr/bin/nodejs /usr/lib/node_modules/forever/bin/monitor app.js
root      1376  1353 90 18:50 ?        00:00:05 /usr/bin/nodejs /root/vidii/nodeprelaunchr/app.js
root      1385   774  0 18:50 pts/6    00:00:00 grep --color=auto node
