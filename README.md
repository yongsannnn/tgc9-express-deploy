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

5. Create a Procfile. 