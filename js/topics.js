document.addEventListener("DOMContentLoaded", function () {
    // Select necessary DOM elements
    const reposContainer = document.querySelector(".card-container");
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    // Event listener for search button click
    searchButton.addEventListener("click", function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm !== "") {
            searchGithubRepos(searchTerm);
        }
    });

    // Event listener for search input 'Enter' key press
    searchInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const searchTerm = searchInput.value.trim();
            if (searchTerm !== "") {
                searchGithubRepos(searchTerm);
            }
        }
    });

    // Retrieve previous searches from local storage
    const previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

    // Randomly shuffle the previous searches array
    shuffleArray(previousSearches);

    // Array to store all cards
    const allCards = [];

    // Display repositories for each previous search
    previousSearches.forEach(username => {
        fetch(`https://api.github.com/users/${username}/repos`)
            .then(response => response.json())
            .then(repos => {
                if (repos.length > 0) {
                    // Create card for each repository
                    repos.forEach(repo => {
                        const card = createRepoCard(username, repo);
                        allCards.push(card);
                    });

                    // Sort cards based on last update date (from newest to oldest)
                    allCards.sort((a, b) => {
                        const dateA = new Date(a.lastUpdated);
                        const dateB = new Date(b.lastUpdated);
                        return dateB - dateA;
                    });

                    // Append sorted cards to the container
                    allCards.forEach(card => {
                        reposContainer.appendChild(card.element);
                    });
                }
            })
            .catch(error => console.error('Error fetching repositories:', error));
    });
});


// Function to search GitHub repositories
function searchGithubRepos(searchTerm) {
    const reposContainer = document.querySelector(".card-container");
    reposContainer.innerHTML = ""; // Clear previous search results
    fetch(`https://api.github.com/search/repositories?q=${searchTerm}+language:english&sort=updated&order=desc&per_page=60`)
        .then(response => response.json())
        .then(data => {
            if (data.items.length > 0) {
                // Create card for each repository found
                data.items.forEach(repo => {
                    const card = createRepoCard(repo.owner.login, repo);
                    reposContainer.appendChild(card);
                });
            } else {
                reposContainer.innerHTML = "<p>No repositories found.</p>";
            }
        })
        .catch(error => console.error('Error fetching repositories:', error));
}

function truncateDescription(description, wordLimit) {
    if (!description) return 'No description'; 
    const words = description.split(" ");
    if (words.length > wordLimit) {
        return words.slice(0, wordLimit).join(" ") + "..."; 
    }
    return description; 
}


// Function to create repository card
function createRepoCard(username, repo) {
    // Create card element
    const card = document.createElement("div");
    card.classList.add("card", "mb-3", "w-px-300");

    // Create card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    
    // Create description body
    const descriptionBody = document.createElement("div");
    descriptionBody.classList.add("description-body");

    // Create elements for repository information
    const repoName = document.createElement("h5");
    repoName.classList.add("card-title");
    repoName.textContent = repo.name;

    const owner = document.createElement("p");
    owner.classList.add("card-text");
    owner.classList.add("owner-name");
    owner.textContent = `Owner: ${username}`;

    const repoDescription = document.createElement("p");
    repoDescription.classList.add("card-text");
    repoDescription.textContent = `Description: ${truncateDescription(repo.description, 15)}`;    

    const lastUpdated = document.createElement("p");
    lastUpdated.classList.add("card-text");
    lastUpdated.textContent = `Last updated: ${new Date(repo.updated_at).toLocaleString()}`;

    // Create image element for repository
    const repoImage = document.createElement("img");
    repoImage.classList.add("card-img-top", "repo-image");
    repoImage.src = repo.owner.avatar_url; // Using owner's avatar as a fallback
    repoImage.alt = "Repository Image";

    // Create link to GitHub repository
    const repoLink = document.createElement("a");
    repoLink.textContent = "View Repository";
    repoLink.href = repo.html_url;
    repoLink.target = "_blank";
    repoLink.classList.add("btn", "btn-primary");


    // Append repo description to description body
    descriptionBody.appendChild(repoDescription);

    // Append elements to card body
    cardBody.appendChild(repoImage);
    cardBody.appendChild(repoName);
    cardBody.appendChild(owner);
    cardBody.appendChild(descriptionBody); // Append description body
    cardBody.appendChild(lastUpdated);
    cardBody.appendChild(repoLink);

    // Append card body to card
    card.appendChild(cardBody);

    // Store last updated date in card object
    card.lastUpdated = repo.updated_at;

    // Store card element in card object
    card.element = card;

    return card;
}


// Function to shuffle array randomly
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
