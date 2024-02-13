### Documentation for `Fetch Repositories` Application

#### `repo.js` File

This JavaScript file handles the functionality of the Fetch Repositories application. It fetches GitHub repositories based on a provided username, displays them, and allows users to save their search queries.

- **`window.onload` Event Listener**: The main function of the application runs when the window is fully loaded. It initializes variables, retrieves previously used search queries from local storage, and sets up event listeners.

    - `eleInput`: Represents the input field for entering the GitHub username.
    - `btnSearch`: Represents the button used to initiate the search for repositories.
    - `containerData`: Represents the container where repository data will be displayed.
    - `resultInfo`: Represents the element where result information will be displayed.
    - `previousSearches`: Stores previously used search queries retrieved from local storage.
    - `saveRepo`: Represents the "Save" button that allows users to save their search queries.

- **`eleInput` Event Listeners**:
    - Sets up suggestions for previously used search queries.
    - Checks if the current search input value is in local storage and displays the "Save" button accordingly.

- **`btnSearch.onclick` Event Listener**: Initiates the process of fetching repositories when the search button is clicked.

- **`getRepos()` Function**:
    - Clears previous search data.
    - Retrieves the GitHub username from the input field.
    - Fetches repositories from the GitHub API based on the provided username.
    - Displays fetched repositories, including their names, links, and download buttons.
    - Handles errors if repositories cannot be fetched.

- **`createRepoCard()` Function**:
    - Creates a card element for displaying repository information.
    - Constructs the card with repository name, owner, description, last updated date, image, and link to the repository.

- **`shuffleArray()` Function**:
    - Shuffles an array randomly.

#### `topics.html` File

This HTML file represents the user interface of the Fetch Repositories application.

- **Structure**:
    - Contains input fields for entering GitHub usernames and a button to initiate the search.
    - Displays fetched repository data within a container.

- **Dependencies**:
    - Uses Bootstrap for styling and layout.
    - Utilizes Particle.js for background effects.

- **Scripts**:
    - Includes the necessary JavaScript files (`repo.js`, `particles.min.js`, `particales-script.js`, `jquery-3.5.1.min.js`, `popper.min.js`, `bootstrap.js`) for application functionality and styling.

### Conclusion

The `Fetch Repositories` application allows users to search for GitHub repositories by entering a username. It provides a user-friendly interface, displays repository information, and allows users to save their search queries for future reference.