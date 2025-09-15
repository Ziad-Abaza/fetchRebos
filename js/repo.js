window.onload = () => {
  const eleInput = document.getElementById("username-input");
  const btnSearch = document.getElementById("search-button");
  const containerData = document.getElementById("repos-container");
  const resultInfo = document.getElementById("result-info");

  resultInfo.style.display = "none";

  let previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];
  let currentPage = 1;
  let currentUser = "";
  let loading = false;
  let hasMore = true;

  // bookmark icon
  const bookmarkIcon = document.createElement("img");
  bookmarkIcon.src = "./image/bookmark.png";
  bookmarkIcon.alt = "Bookmark";
  bookmarkIcon.style.cursor = "pointer";
  bookmarkIcon.classList.add("bookmark-icon");
  bookmarkIcon.style.marginLeft = "10px";
  bookmarkIcon.style.width = "20px";
  bookmarkIcon.style.height = "20px";

  function updateBookmarkIcon() {
    const username = eleInput.value.trim();
    if (previousSearches.includes(username)) {
      bookmarkIcon.src = "./image/bookmark-active.png";
      bookmarkIcon.title = "Remove from favorites";
    } else {
      bookmarkIcon.src = "./image/bookmark.png";
      bookmarkIcon.title = "Add to favorites";
    }
  }

  // toggle favorites
  bookmarkIcon.addEventListener("click", function () {
    const username = eleInput.value.trim();
    if (!username) return;
    const index = previousSearches.indexOf(username);
    if (index === -1) {
      previousSearches.push(username);
    } else {
      previousSearches.splice(index, 1);
    }
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
    updateDatalist();
    updateBookmarkIcon();
  });

  // datalist for search history
  const datalist = document.createElement("datalist");
  datalist.id = "search-suggestions";
  document.body.appendChild(datalist);

  function updateDatalist() {
    datalist.innerHTML = "";
    previousSearches.forEach((query) => {
      const option = document.createElement("option");
      option.value = query;
      datalist.appendChild(option);
    });
  }
  updateDatalist();
  eleInput.setAttribute("list", "search-suggestions");
  eleInput.addEventListener("input", updateBookmarkIcon);

  // search triggers
  btnSearch.onclick = () => startSearch();
  eleInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") startSearch();
  });

  function startSearch() {
    currentUser = eleInput.value.trim();
    currentPage = 1;
    hasMore = true;
    containerData.innerHTML = "";
    getRepos(currentUser, currentPage);
  }

  // fetch repos with pagination
  function getRepos(username, page = 1) {
    if (!username) {
      resultInfo.textContent = "Please enter a GitHub username.";
      return;
    }
    if (loading || !hasMore) return;

    loading = true;
    resultInfo.style.display = "flex";
    resultInfo.textContent = "Loading repositories...";
    updateBookmarkIcon();
    resultInfo.appendChild(bookmarkIcon);

    fetch(
      `https://api.github.com/users/${username}/repos?per_page=20&page=${page}`
    )
      .then((response) => {
        if (!response.ok) throw new Error("User not found");
        return response.json();
      })
      .then((repos) => {
        if (repos.length === 0) {
          if (page === 1) {
            resultInfo.textContent = "No repositories found.";
          } else {
            resultInfo.textContent = "No more repositories.";
          }
          hasMore = false;
          return;
        }

        resultInfo.style.display = "none";

        repos.forEach((repo) => {
          const repoContainer = document.createElement("div");
          const btnContainer = document.createElement("div");
          const repoTitle = document.createElement("h3");
          const btnVisit = document.createElement("button");
          const btnDownload = document.createElement("button");
          const repoLink = document.createElement("a");
          const repoDownloadLink = document.createElement("a");

          repoTitle.textContent = repo.name;
          repoContainer.classList.add("container-data");
          btnContainer.classList.add("link-Container");
          btnVisit.classList.add("btn-visit");
          btnDownload.classList.add("btn-download");

          // visit link
          repoLink.href = repo.html_url;
          repoLink.target = "_blank";
          repoLink.textContent = "Visit";
          btnVisit.appendChild(repoLink);

          // download link
          repoDownloadLink.href = `https://github.com/${username}/${repo.name}/archive/refs/heads/main.zip`;
          repoDownloadLink.download = repo.name;
          repoDownloadLink.textContent = "Download";
          btnDownload.appendChild(repoDownloadLink);

          btnContainer.appendChild(btnVisit);
          btnContainer.appendChild(btnDownload);

          // check GitHub Pages demo
          fetch(`https://${username}.github.io/${repo.name}/`, {
            method: "HEAD",
          })
            .then((response) => {
              if (response.ok) {
                const btnPage = document.createElement("button");
                const pageLink = document.createElement("a");
                pageLink.textContent = "Demo";
                pageLink.href = `https://${username}.github.io/${repo.name}/`;
                pageLink.target = "_blank";
                btnPage.classList.add("btn-PageLink");
                btnPage.appendChild(pageLink);
                btnContainer.appendChild(btnPage);
              }
            })
            .catch(() => {});

          repoContainer.appendChild(repoTitle);
          repoContainer.appendChild(btnContainer);
          containerData.appendChild(repoContainer);
        });

        currentPage++;
      })
      .catch((err) => {
        resultInfo.textContent =
          "Error fetching repositories. Please try again.";
        console.error(err);
      })
      .finally(() => {
        loading = false;
      });
  }

  // infinite scroll
  window.addEventListener("scroll", () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      getRepos(currentUser, currentPage);
    }
  });

  updateBookmarkIcon();
};
