# Promiseboard

![alt tag](https://raw.githubusercontent.com/guligo/promiseboard/master/assets/promiseboard.png)
![alt tag](https://raw.githubusercontent.com/guligo/promiseboard/master/assets/promiseboard-2.png)
![alt tag](https://raw.githubusercontent.com/guligo/promiseboard/master/assets/promiseboard-3.png)

## About

Web app that challenges people to commit and keep promises made to themselves and other people.

+ [Promiseboard on the web](http://promiseboard.net)
+ [Promiseboard on Facebook](http://www.facebook.com/promiseboard.net)
+ [Promiseboard on Youtube](https://www.youtube.com/channel/UCCBthbBumYqtBlMY5TwDzJw)
+ [Promiseboard on Instagram](https://www.instagram.com/promiseboard)
+ [Promiseboard on Twitter](http://www.twitter.com/promiseboardnet)

## Key technologies

Node.js, PostgreSQL, Bootstrap

## Deployment instructions

### Prerequisites

- Install [Node.js](https://nodejs.org/en/download)

- Install [PostgreSQL](http://www.postgresql.org):
  - sudo apt-get install postgresql-9.4
  - sudo -u postgres -i
    - psql
      - alter user postgres password 'secret';
      - \q
    - createdb promiseboard
  - exit

### Compilation, testing & deployment

- cd [repo dir]
- npm install
- npm test
- npm start

Application should be accessible via [localhost:5000](http://localhost:5000).

### Useful [Heroku](https://www.heroku.com) commands

Promiseboard can be hosted on Heroku cloud application platform. Below are some useful commands for development purpose:

- git push heroku master
- heroku logs
- heroku pg:reset DATABASE
- heroku pg:reset DATABASE --confirm promiseboard
- heroku restart
