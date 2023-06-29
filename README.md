# Northcoders News API

This project is an API which mimics a backend service such as Reddit, to provide information information to front end architecture.

## For developers who wish to run this project locally:

**Clone the repository by running the following command in the terminal:**

git clone https://github.com/DeanDevine/be-nc-news.git

**Create the necessary .env files and include the following code:**

.env.development:

PGDATABASE=nc_news

.env.test:

PGDATABASE=nc_news_test

**Install dotenv, express and pg package dependencies the following command in the terminal:**

npm install

Minimum package versions required for this project:

PostgreSQL - v14.8
Node.js - v20.1.0

**Run the following scripts in the terminal to create and seed the local databases:**

npm run setup-dbs
npm run seed

**To test the API, run the following script:**

npm run test app

**The hosted database can be found on:**

https://be-nc-news-whiy.onrender.com/api/

For a list of available endpoints, please see [endpoints.json](../be-nc-news/endpoints.json).