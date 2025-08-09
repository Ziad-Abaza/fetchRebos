window.onload = () => {
  const eleInput = document.getElementById("username-input");
  const btnSearch = document.getElementById("search-button");
  const containerData = document.getElementById("repos-container");
  const resultInfo = document.getElementById("result-info");

  resultInfo.style.display = "none";

  let previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];

  // create the bookmark icon
  const bookmarkIcon = document.createElement("img");
  bookmarkIcon.src = "./image/bookmark.png";
  bookmarkIcon.alt = "Bookmark";
  bookmarkIcon.style.cursor = "pointer";
  bookmarkIcon.classList.add("bookmark-icon");
  bookmarkIcon.style.marginLeft = "10px";
  bookmarkIcon.style.width = "20px";
  bookmarkIcon.style.height = "20px";

  // update the bookmark icon based on previous searches
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

  // when the bookmark icon is clicked
  bookmarkIcon.addEventListener("click", function () {
    const username = eleInput.value.trim();
    if (!username) return;

    const index = previousSearches.indexOf(username);
    if (index === -1) {
      // add to favorites if not already present
      previousSearches.push(username);
      bookmarkIcon.src = "./image/bookmark-active.png";
      bookmarkIcon.title = "Remove from favorites";
    } else {
      // remove from favorites if already present
      previousSearches.splice(index, 1);
      bookmarkIcon.src = "./image/bookmark.png";
      bookmarkIcon.title = "Add to favorites";
    }

    // update localStorage
    localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
    updateDatalist();

    // update the datalist
    updateBookmarkIcon();
  });

  // create a datalist for search suggestions
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

  // related to the input field
  eleInput.setAttribute("list", "search-suggestions");

  // when the input changes, update the bookmark icon
  eleInput.addEventListener("input", function () {
    updateBookmarkIcon();
  });

  // when the search button is clicked
  btnSearch.onclick = () => getRepos();

  eleInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") getRepos();
  });

  // get repositories from GitHub API
  function getRepos() {
    containerData.innerHTML = "";
    resultInfo.innerHTML = "";
    resultInfo.style.display = "flex";

    const username = eleInput.value.trim();
    if (!username) {
      resultInfo.textContent = "Please enter a GitHub username.";
      return;
    }

    resultInfo.textContent = "Loading repositories...";

    // update the bookmark icon
    updateBookmarkIcon();
    resultInfo.appendChild(bookmarkIcon);

    fetch(`https://api.github.com/users/${username}/repos`)
      .then((response) => {
        if (!response.ok) throw new Error("User not found");
        return response.json();
      })
      .then((repos) => {
        if (repos.length === 0) {
          resultInfo.textContent = "No repositories found.";
          containerData.classList.add("d-none");
          return;
        }

        resultInfo.innerHTML = "";
        resultInfo.textContent = `Repositories for ${username}`;
        resultInfo.appendChild(bookmarkIcon);

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

          // icon for visit
          const visitImg = document.createElement("img");
          visitImg.src = "./image/visit.png";
          visitImg.alt = "Visit";
          visitImg.style.width = "24px";
          visitImg.style.height = "24px";

          // icon for download
          const downloadImg = document.createElement("img");
          downloadImg.src = "./image/download.png";
          downloadImg.alt = "Download";
          downloadImg.style.width = "24px";
          downloadImg.style.height = "24px";

          // create links for visit and download
          repoLink.href = `https://github.com/${username}/${repo.name}`;
          repoLink.target = "_blank";
          repoLink.appendChild(visitImg);
          btnVisit.appendChild(repoLink);

          repoDownloadLink.href = `https://github.com/${username}/${repo.name}/archive/refs/heads/main.zip`;
          repoDownloadLink.download = repo.name;
          repoDownloadLink.appendChild(downloadImg);
          btnDownload.appendChild(repoDownloadLink);

          btnContainer.appendChild(btnVisit);
          btnContainer.appendChild(btnDownload);

          // check if the repository has a GitHub Pages site
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
            .catch(() => {
            });

          repoContainer.appendChild(repoTitle);
          repoContainer.appendChild(btnContainer);
          containerData.appendChild(repoContainer);
        });

        containerData.classList.remove("d-none");
      })
      .catch((err) => {
        resultInfo.textContent =
          "Error fetching repositories. Please try again.";
        console.error(err);
      });
  }

  updateBookmarkIcon();
};
