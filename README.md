# Dependencies

* express
* hbs
* wax-on
* handlebars-helpers
* mongodb
* dotenv


Setup steps
1. Create `.env` file with `MONGO_URL` filled in

2. Run `yarn install`

3. `heroku login -i` Key in email and pw 

4. create a heroku app `heroku create <app-name>`  app name must be unique throught the entire database

run `git remote -v` you should see heroku showing

5. Create a Procfile. Add in where to start the application
```
web: node index.js
```

Take note it can be app.js also. 

6. Go to package.json and look for "script". Add into the object 

```
 "start": "node index.js"
```

7. Go to index.js (express) and change the port number to `process.env.PORT`

8. Get ready to push to heroku
```
git add . 
git commit "message"
git push heroku
```

At the end should see "Build succeeded!" and the link deployed to heroku

9. Go to Heroku website, click on the repo. Click on Setting. Click on "Reveal Config Vars" to add in your MONGO_URL and the value. 

10. If there are any errors, can refer to "More" -> "View Logs"