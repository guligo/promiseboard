# Notes

## Installation of prerequisites

- Install [Node.js](https://nodejs.org/en/download)

- Install PostgreSQL:
  - apt-get install postgresql-9.4
  - sudo -u postgres -i
    - psql
      - alter user postgres password 'secret';
      - \q
    - createdb promiseboard
  - exit

## Starting up project

- cd [repo dir]
- npm install
- npm test
- npm start

Application should be accessible via [localhost:5000](http://localhost:5000).

## List of frequently used commands on [Heroku](https://www.heroku.com).

Frequently used deployment commands:

- git push heroku master
- heroku logs
- heroku pg:reset DATABASE
- heroku pg:reset DATABASE --confirm promiseboard
- heroku restart
