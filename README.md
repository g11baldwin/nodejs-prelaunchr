# nodeprelaunchr

---------------------------------------------------------------------
#### Overview

The nodeprelaunchr webapp is a Nodejs version of the **Harry's (shave club)** Rails prelaunchr webapp. 
The [original app is here](https://github.com/harrystech/prelaunchr).  The switch to Node was made because 
our other webapps were also based on Node/mongodb. The [Sails](http://sailsjs.org) framework was chosen because 
it's a quick and easy way to get a webapp up and running. Our thanks to both the Harry's and the Sails teams!


------------------------------------------------------------------------
#### Functionality

The webapps primary function is to allow people to signup for a mobile app prior to the app launching. As 
people sign up using an email address, they are provided with a unique code that is embedded in a URL. This URL 
can then be shared with friends via Facebook, Twitter, email or other social media. If/when their friends click the 
URL, they are directed to the webapp, and if they sign up, then the person who invited them, get's "credit", and *the 
newly signed up person* receives their own code to share.
Credits are accumulated by those people doing the invites, and in our case, awards are provided for users reaching 
various quantities of credits. 


**Some notes:**

**Email addresses** - an email address can only be used for a single sign up. Additionally, email uses 
are idempotent, so if an email address is re-entered, e.g. somebody attempts to sign up twice with same email address, 
they're only signed up once, and the same URL/token is returned on the initial and subsequent signups.

**Source IP limiting** - a simple source IP limiting is done to limit the number of signups from a given IP
 address, regardless of the email address provided. Currently the system allows a maximum of 2 signups from the same 
 IP address.  

**Prize levels** - prize levels can be set as desired. 


------------------------------------------------------------------------
#### Configuration
**Port mapping**
The app is a typical Sails app in that it listens on port 1337. The app can be configured to use port 80 or port
443, for http or https, respectively. We ran it behind a LB (load balancer) and had the LB do the port mapping,
we ran the app on port 1337, and had the LB route port 80 and port 443 traffic to port 1337. 

**Database**
We used mongodb behind the app (Sails can handle several different dbs via the Waterline ORM). Our config info 
is scrubbed, so you'll need to add your own mongodb config. *Mongo database configuration is done in the
 local/connections.js file*.

**Email**
Email's are sent to users when they sign up welcoming them to our **app**. The email also contains the URL described
 above that contains an invite code. The email framework is provided by **nodemailer**, which has direct support for
 Mailgun, Gmail, and many other common email senders. *Nodemailer configuration is done in the config/local.js file.*

**Award levels**
The award levels are based on the number of friends invited who signup. *These levels can be configured in the 
views/user/share.ejs and views/user/share-javascript files.* Additionally, the tooltip images are configurable, but 
you are welcome to use the ones provided.

**Social media**
We support Twitter and Facebook sharing, allowing a user to post once they've registered. *The account information
will need to be updated to utilize your accounts.*


------------------------------------------------------------------------
#### Licensing
This web application is derived from the Harry's "prelaunchr" webapp and as such, is licensed under the same terms as 
they provided. Specifically, the license is:

"The code, documentation, non-branded copy and configuration are released under the MIT license."
 
We have attempted to remove any reference to Harry's in this Nodejs version of the web application; however, if 
any Harry's asset exists, Harry's does not give you permission to use their brand or trademarks in your own marketing. 
In a similar way, Vidicons does not give you permission to use our brand or trademarks in your marketing.



------------------------------------------------------------------------
#### Running the app

- In development mode:
`$ node app.js`


- In production mode (we used **forever** as our way of keeping the app running...)
`$ forever start app.js`

------------------------------------------------------------------------
#### When signup is complete (post-processing)

Signup stats (clickable columns would be a nice add) are accessed at the URL: 

http://localhost:1337/user/xrayvision/?key=secret

*where secret is defined in config/local.js file and the secret var*

Note: While the key is validated, this is not an authenticated route, so you may want to remove the route and run 
this as a script against the db.

