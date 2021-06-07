# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

Basic requriements to the run the project.

Need to have node js installed to run the project

In the project directory:

To install node modules

### `npm install`

To Run the app

### `yarn start` or `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test` or `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### Assumptions

1. Use bootstrap for webpage styling. Similar to https://www.metrotransit.org/
2. Use React JS for user interactivity and routing.
3. User should not navigate away from the current page at any point.
4. Use child views for showing directions and stops list.
5. Add route id and route id to url, so that when user navigates back and forward using browser button we can track the selected id and use it to select the matched option automatically.