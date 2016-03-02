# nodeprelaunchr

---------------------------------------------------------------------

### Overview

The nodeprelaunchr webapp is a Nodejs version of the **Harry's (shave club)** Rails prelaunchr webapp. 
The [original app is here](https://github.com/harrystech/prelaunchr).  The switch to Node was made because 
our other webapps were also based on Node/mongodb. The [Sails](http://sailsjs.org) framework was chosen because 
it's a quick and easy way to get a webapp up and running.

The webapps primary function is to allow potential new [app] users to signup prior to launching an
app. As people sign up, using an email address, they are provided with a unique code, that is encoded 
in a URL. This URL can then be shared with friends, and if/when their friends click the URL, they are
directed to the webapp, and if they sign up, then the person who invited them, get's "credit".

Credits are accumulated and, in our case, awards are provided for users reaching various quantities of 
credits. 




##### Behavior / Restrictions:
1. **Email addresses are unique** - email address uses are idempotent, so if an email address is re-entered, 
e.g. somebody signs up twice with same email address, they are only signed up once, and the same URL/token 
that was origninally returned is returned on subsequent signups, whether it's the same person or not. 

2. **Source IP controlling** - a simple source IP limiting is done regardless of the email address provided.  
Currently the system allows a maximum of 2 signups from the same IP address. 


##### Configuration
1. **Port mapping**
The app is a typical sails app in that it listens on port 1337. The app can be configured to use port 80 or port
443, for http or https, respectively. We ran it behind a LB (load balancer) using https, and had the LB do the 
port mapping, i.e. we ran the app on port 1337, and had the LB route port 80 and port 443 traffic to port 1337. 

2. **Database**
We used mongodb behind the app (Sails can handle several different dbs via the Waterline ORM). Our config info 
is scrubbed, so you'll need to add your own mongodb config.


##### Licensing
This web application is derived from the Harry's "prelaunchr" webapp and as such, is licensed under the same terms as 
they provided. The code, documentation, non-branded copy and configuration are released under the MIT license. 
Any branded assets are included only to illustrate and inspire. Please change the artwork to use your own brand! 
We have attempted to remove any reference to Harry's in the web application; however, in the case we have missed 
sometihng, Harry's does not give you permission to use their brand or trademarks in your own marketing. In a similar
way, Vidicons does not give you permission to use our brand or trademarks in your marketing.




------------------------------------------------------------------------

##### Running the app

- In development mode:
`$ node app.js`


- In production mode:
`$ forever start app.js`
