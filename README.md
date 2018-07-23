# MyReads Project
#### Front End Web Developer | Udacity
---

## Project Overview

This is bookshelf app that allows you to select and categorize books you have read, are currently reading, or want to read.

The main page displays a list of "shelves" (i.e. categories), each of which contains a number of books. The three shelves are:

- Currently Reading
- Want to Read
- Read

You can move books between shelves or remove them.

This app has a search page too that allows you to find books to add to your library.

## How to run
1. Clone this repository or download a zip file (use the `Clone or download` green button)
2. `cd` in the downloaded folder
3. Install all project dependencies with `npm install`
4. Start the development server with `npm start`
3. With your server running, visit the site: `http://localhost:3000/`.

## Important
The backend API uses a fixed set of cached search results and is limited to a particular set of search terms, which can be found in [SEARCH_TERMS.md](SEARCH_TERMS.md). That list of terms are the _only_ terms that will work with the backend, so don't be surprised if your searches for Basket Weaving or Bubble Wrap don't come back with any results.

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find more information on how to perform common tasks [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).
