# Base template to start a new express api application  

## Complete user workflow
 - [x] create user
 - [x] activation user
 - [x] forgot password
 - [x] reset password
 - [x] session to login and auth middleware
 - [x] Bull jobs
 - [x] nodemailer with handlebars template
 - [x] body validation with Yup
 - [x] param validation using middleware
 - [x] all tested, except send mail (i'm learning about that)
 
## How to use
 
```
$ git clone https://github.com/rvieceli/express-template.git awesome_project
$ cd awesome_project
$ yarn
$ yarn test --forceExit
```

## How to start your new awesome project

 - [ ] create .env file on start path project (looks .env.example)
   - [ ] APP_SECRET requires 256-bit key for production, for development use anything, but not empty
   - [ ] database default and recomended is Postgres
   - [ ] mongodb is not yet exemplified in this template
   - [ ] redis is used to queue job
   - [ ] mail is send to confirmation account and reset password
   
 - [ ] let's code!
