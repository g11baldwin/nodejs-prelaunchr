# nodeprelaunchr

---------------------------------------------------------------------

### Overview

The nodeprelaunchr webapp is a Nodejs version of the **Harry's (shave club)** Rails prelaunchr webapp. 
The [original app is here](https://github.com/harrystech/prelaunchr).  The switch to Node was made because 
our other webapps were also based on Node/mongodb. The [Sails](http://sailsjs.org) framework was chosen because 
it's a quick and easy way to get a webapp up and running.

The webapps primary function is to allow potential new [app] users to signup prior to launching our
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




------------------------------------------------------------------------

##### Running the app

- In development mode:
`$ node app.js`


- In production mode:
`$ forever start app.js`
