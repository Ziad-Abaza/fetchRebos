window.onload = () => {
  // Variables
  let eleInput = document.getElementById("username-input");
  let btnSearch = document.getElementById("search-button");
  let containerData = document.getElementById("repos-container");
  let resultInfo = document.getElementById("result-info");

  // Initialize hidden state for result-info
  resultInfo.style.display = "none";

  // Retrieve previously used search queries from local storage
  let previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];

  // Create bookmark icon
  let bookmarkIcon = document.createElement("img");
  bookmarkIcon.src = "./image/bookmark.png"; // Use bookmark.png initially
  bookmarkIcon.alt = "Save";
  bookmarkIcon.style.cursor = "pointer";
  bookmarkIcon.classList.add("bookmark-icon");

  bookmarkIcon.addEventListener("click", function () {
    // Add the search query to the previous searches
    const username = eleInput.value.trim();
    if (!previousSearches.includes(username)) {
      previousSearches.push(username);
      localStorage.setItem(
        "previousSearches",
        JSON.stringify(previousSearches)
      );
      // Change the icon to bookmark-active.png after saving
      bookmarkIcon.src = "./image/bookmark-active.png";
    }
    console.log("Clicked bookmark icon");
  });

  // Suggest previously used search queries
  eleInput.setAttribute("list", "search-suggestions");
  const datalist = document.createElement("datalist");
  datalist.id = "search-suggestions";
  previousSearches.forEach((query) => {
    const option = document.createElement("option");
    option.value = query;
    datalist.appendChild(option);
  });
  document.body.appendChild(datalist);

  // Check if the current search input value is in local storage
  eleInput.addEventListener("input", function () {
    const inputValue = eleInput.value.trim();
    if (previousSearches.includes(inputValue)) {
      // Hide the bookmark icon if already saved
      bookmarkIcon.style.display = "none";
    } else {
      // Show the bookmark icon
      bookmarkIcon.style.display = "block";
    }
  });

  btnSearch.onclick = () => {
    getRepos();
  };

  // Trigger search on Enter key press
  eleInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      getRepos();
    }
  });

  // Function to fetch all repositories using pagination
  async function fetchAllRepos(username) {
    let allRepos = [];
    let page = 1;
    let perPage = 100; // Number of items per page (can be adjusted)

    while (true) {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`
      );
      const repos = await response.json();

      if (repos.length === 0) {
        break; // Stop if no more repositories are returned
      }

      allRepos = allRepos.concat(repos); // Add the repositories to the list
      page++; // Move to the next page
    }

    return allRepos;
  }

  // Get repositories function
  async function getRepos() {
    // Clear previous search data
    containerData.innerHTML = ""; // Clear the container
    resultInfo.textContent = ""; // Clear the info message

    const username = eleInput.value.trim();
    if (username === "") {
      resultInfo.textContent = "Please enter a GitHub username.";
      resultInfo.style.display = "flex";
      return;
    }

    resultInfo.textContent = "Loading repositories...";
    resultInfo.style.display = "flex";

    try {
      const allRepos = await fetchAllRepos(username); // Fetch all repositories

      if (allRepos.length === 0) {
        resultInfo.textContent = "No repositories found.";
      } else {
        resultInfo.textContent = `Repositories for ${username}:`;

        allRepos.forEach((repo) => {
          // Create elements
          let repoContainer = document.createElement("div");
          let btnContainer = document.createElement("div");
          let repoTitle = document.createElement("h3");
          let btnVisit = document.createElement("button");
          let repoLink = document.createElement("a");
          let btnDownload = document.createElement("button");
          let repoDownload = document.createElement("a");
          let repoName = document.createTextNode(repo.name);
          let repoVisit = document.createTextNode("Visit");

          // Add class names to elements
          repoContainer.classList.add("container-data");
          repoTitle.classList.add("title-repo");
          btnVisit.classList.add("btn-visit");
          btnDownload.classList.add("btn-download");
          btnContainer.classList.add("link-Container");

          // Set images instead of text for buttons
          let downloadImg = document.createElement("img");
          downloadImg.src = "./image/download.png"; // Replace with actual path
          downloadImg.alt = "Download";
          downloadImg.style.width = "24px";
          downloadImg.style.height = "24px";
          btnDownload.appendChild(downloadImg);

          let visitImg = document.createElement("img");
          visitImg.src = "./image/visit.png"; // Replace with actual path
          visitImg.alt = "Visit";
          visitImg.style.width = "24px";
          visitImg.style.height = "24px";
          btnVisit.appendChild(visitImg);

          // Add attributes to elements
          repoDownload.setAttribute(
            "href",
            `https://github.com/${eleInput.value}/${repo.name}/archive/refs/heads/main.zip`
          );
          repoDownload.setAttribute("download", repo.name);
          repoLink.setAttribute(
            "href",
            `https://github.com/${eleInput.value}/${repo.name}`
          );
          repoLink.setAttribute("target", "_blank");

          // Add child elements
          repoTitle.appendChild(repoName);
          repoLink.appendChild(visitImg);
          btnVisit.appendChild(repoLink);
          btnDownload.appendChild(repoDownload);
          repoDownload.appendChild(downloadImg);

          // Append to container
          repoContainer.appendChild(repoTitle);
          btnContainer.appendChild(btnVisit);
          btnContainer.appendChild(btnDownload);
          repoContainer.appendChild(btnContainer);

          // Append bookmark icon to resultInfo
          resultInfo.textContent = `Repositories for ${username} `;
          resultInfo.appendChild(bookmarkIcon);

          // Check if GitHub Pages exists
          fetch(`https://${eleInput.value}.github.io/${repo.name}/`).then(
            (response) => {
              if (response.status === 200) {
                let btnPageLink = document.createElement("button");
                let repoPageLink = document.createElement("a");
                let pageLinkText = document.createTextNode("Demo");
                btnPageLink.classList.add("btn-PageLink");
                repoPageLink.appendChild(pageLinkText);
                btnPageLink.appendChild(repoPageLink);
                repoPageLink.setAttribute(
                  "href",
                  `https://${eleInput.value}.github.io/${repo.name}/`
                );
                repoPageLink.setAttribute("target", "_blank");
                btnContainer.appendChild(btnPageLink);
                repoContainer.appendChild(btnContainer);
              }
            }
          );

          // Append to page only if GitHub Pages exists
          containerData.appendChild(repoContainer);
        });

        // Display the container if repositories were found
        containerData.classList.remove("d-none");
        resultInfo.style.display = "flex";
      }
    } catch (error) {
      resultInfo.textContent = "Error fetching repositories. Please try again.";
      resultInfo.style.display = "flex";
    }
  }
};
