# Drawsome

## About the project

Drawsome is a a multiplayer drawing game inspired by pictionary and cards against humanity. A game consists of 1-5 rounds, where 3-8 players all draw a picture based on the same prompt displayed at the top of the drawing canvas. At the end of each round, players vote on their favorite drawing. A leaderboard shows the current standings in between rounds, then a final game results page is shown when the game is over. You can also draw solo, view all of your past solo and in-game drawings, edit drawing titles, and delete past drawings.

## [🔗 Live Site](https://drawsome.onrender.com/)

<br>

## Highlights

### **General** **layout**

<img src='layout.png' style='width: 900px'>

### **Drawing**

<img src='frontend/src/images/howto/draw.png' style='width: 400px'/>

### **Voting**

<img src='frontend/src/images/howto/voting.png' style='width: 500px'/>

### **leaderboard**

<img src='frontend/src/images/howto/leaderboard.png' style='width: 500px'/>

### **Game** **end**

<img src='frontend/src/images/howto/final-scores.png' style='width: 700px'/>

## Upcoming features

- Improved drawing interface with more brush/color options and an undo button
- Ability to view all past game stats
- In game chat
- User profile pictures
- Sitewide leaderboard/statistics
- Friends/invite feature

## Tech Stack 🥞

[![JavaScript](https://img.shields.io/badge/JavaScript-000000.svg?&style=for-the-badge&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/html-000000.svg?&style=for-the-badge&logo=html5)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/css-000000.svg?&style=for-the-badge&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/css)
[![CSS3](https://img.shields.io/badge/react-000000.svg?&style=for-the-badge&logo=react)](https://reactjs.org/)
[![REDUX](https://img.shields.io/badge/redux-000000.svg?&style=for-the-badge&logo=redux)](https://redux.js.org/)

[![EXPRESS](https://img.shields.io/badge/express.js-000000.svg?&style=for-the-badge&logo=express)](https://expressjs.com/)
[![SOCKET.IO](https://img.shields.io/badge/socket.io-000000.svg?&style=for-the-badge&logo=socket.io)](https://socket.io/)
[![SEQUELIZE](https://img.shields.io/badge/sequelize-000000.svg?&style=for-the-badge&logo=sequelize)](https://sequelize.org/)
[![POSTGRESQL](https://img.shields.io/badge/postgresql-000000.svg?&style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

[![RENDER](https://img.shields.io/badge/render-000000.svg?&style=for-the-badge&logo=render)](https://www.render.com/)
[![AWSS3](https://img.shields.io/badge/amazon%20s3-000000.svg?&style=for-the-badge&logo=amazons3)](https://aws.amazon.com/pm/serv-s3/?trk=fecf68c9-3874-4ae2-a7ed-72b6d19c8034&sc_channel=ps&s_kwcid=AL!4422!3!536452728638!e!!g!!aws%20s3&ef_id=CjwKCAiA2rOeBhAsEiwA2Pl7Q6Zfh1RxX9qRTYsnbgE54_VrB3J2URKpsGLTGCGimZk9gYKtgiEfvhoCsmQQAvD_BwE:G:s&s_kwcid=AL!4422!3!536452728638!e!!g!!aws%20s3)

## Installation

(paste this into the terminal to skip steps 1-5)

```
git clone https://github.com/hen-wood/drawsome.git && cd drawsome && npm install && cd backend && mv .env.example .env && npm run dbreset && npm start
```

1. git clone this repo

```
git clone https://github.com/hen-wood/drawsome.git
```

2. Install dependencies from the root directory

```
cd drawsome && npm install
```

3. From the backend directory, rename .env.example to .env

- **Note**: AWS Image uploads will not work without `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` environment variables set. Follow [these instructions](https://aws.amazon.com/s3/getting-started/) to set up your own account.

```
cd backend && mv .env.example .env
```

4. From the backend directory, run the "dbreset" script to initalize the database and populate it with seed data. (This script can be used any time you want to reset the database)

```
npm run dbreset
```

5. Start the server from the backend directory

```
npm start
```

6. In another terminal, start React from the frontend directory

```
npm start
```

7. Navigate to http://localhost:3000
