This project is a final assignment on Web Technologies 2 (Backend). It is my implementation of web-site for my portfolio.

Implemented:
- Authentication and Authorization with JWT tokens, different permissions for users and admins.
- REST API for projects using MongoDB
- 3 using of third-party APIs (nager.date, restcountries, Financial Modeling Prep) with Charts in Front-side.
- sending emails when new users register and when someone logs in

Besides, I have created convenience site using EJS, CSS, JS, that allows to check the work ability of my server application. 
To open it write 'http://localhost:3000/home' 

Launch Instructions:
1. In .env file change DATABASE_URL to your connection
2. Run the server
3. Open 'http://localhost:3000/home'  in your browser or check endpoints using Postman


ENDPOINTS: 
GET /home - diplays html page and provides interface for the whole project functional

POST /auth/register - creates new users, allows to singup

POST /auth/login - implements users' log in

GET /api/holidays - retrieves data about holidays in San Marino by months. It's available only for authorized users (ADMIN or USER)

GET /api/marketcap - retrieves data about Apple's market capitalization from 02.01.2024 to 29.02.2024. It's available only for authorized users (ADMIN or USER)

GET /api/asiapopulation - retrieves data about population in Asian countries. It's available only for authorized users (ADMIN or USER)

GET /project - retrieves all projects

GET /project/:id - retrieves project by id

POST /project - create new project. It's available only for ADMIN

PUT /project/:id - updated project by id. It's available only for ADMIN

DELETE /project:/id  - deletes project by id. It's available only for ADMIN

