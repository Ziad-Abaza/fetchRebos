# GitHub Repositories Viewer

This is a simple web application that allows you to search for a GitHub user's repositories and view their details.

## Usage

1. Open the `index.html` file in your web browser.
2. Enter a GitHub username in the input field.
3. Click the "Search" button to fetch the user's repositories.

## Code Explanation

The code is written in JavaScript and uses the GitHub API to retrieve a user's repositories and display them on the web page. Here's a brief overview of the code:

- The HTML file (`index.html`) contains the user interface elements, including an input field and a search button.

- The JavaScript code in `script.js` is responsible for the functionality of the application. It does the following:

  - Fetches the user's repositories from the GitHub API when the "Search" button is clicked.

  - Clears the previous search results before displaying new ones.

  - Dynamically creates HTML elements to display each repository's information, including the repository name, a link to the repository, and an option to download the repository as a ZIP file.

  - Checks if the user has a GitHub Pages site for each repository and provides a link to it if available.

## How to Run

To run this application locally, follow these steps:

1. Clone this repository to your computer.
2. Open the `index.html` file in a web browser.

## Example

Here's how the application works:

![GitHub Repositories Viewer](screenshot.png)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

Feel free to contribute to the project or use it as a starting point for your own GitHub-related applications!
