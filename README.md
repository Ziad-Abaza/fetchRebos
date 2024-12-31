### Fetch Repositories Application

#### Overview

The `Fetch Repositories` application allows users to search for GitHub repositories by entering a username. It provides a user-friendly interface to display repository details such as name, description, owner, last updated date, and a link to the repository. The application also enables users to save their search queries for future use, offering suggestions based on previously searched usernames.

#### Key Features

- Fetch and display repositories using the GitHub API.
- Show repository details, including name, owner, description, and last updated time.
- Save search queries and retrieve suggestions from local storage.
- Provide a visually appealing interface with Bootstrap and Particle.js for styling.

#### File Breakdown

##### `repo.js`

This JavaScript file is the core logic for the application, handling API calls, data processing, and event listeners.

- **Event Listeners**:
  - `window.onload`: Initializes variables, retrieves search history, and sets up input and button listeners.
  - `eleInput`: Provides suggestions based on saved search queries and toggles the "Save" button.
  - `btnSearch`: Triggers the repository fetch process on click.

- **Functions**:
  - `getRepos()`: Fetches repositories for a given username, clears previous results, and displays fetched data. Handles errors for invalid usernames or failed API calls.
  - `createRepoCard()`: Creates and structures repository cards to display detailed information.
  - `shuffleArray()`: Randomizes the order of items in an array for display purposes.

##### `topics.html`

This HTML file provides the structure and layout for the application's interface.

- **Elements**:
  - Input field for entering GitHub usernames.
  - Search button to trigger the fetch operation.
  - Container to display fetched repository cards dynamically.

- **Dependencies**:
  - Bootstrap for responsive design.
  - Particle.js for interactive background effects.

- **Included Scripts**:
  - `repo.js`: Main application logic.
  - `particles.min.js` and `particles-script.js`: Adds animated particles to the background.
  - `jquery-3.5.1.min.js`, `popper.min.js`, and `bootstrap.js`: Provides necessary JavaScript utilities and styles.

#### Usage Instructions

1. Open `topics.html` in a web browser.
2. Enter a GitHub username in the search bar.
3. Click the "Search" button to fetch and display repositories.
4. Save search queries by clicking the "Save" button.
5. View previously searched usernames as suggestions.
