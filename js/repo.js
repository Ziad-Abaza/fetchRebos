window.onload = () => {
  const eleInput = document.getElementById("username-input");
  const keywordInput = document.getElementById("keyword-input");
  const btnSearch = document.getElementById("search-button");
  const containerData = document.getElementById("repos-container");
  const resultInfo = document.getElementById("result-info");
  const userInfo = document.getElementById("user-info");

  resultInfo.style.display = "none";

  let previousSearches =
    JSON.parse(localStorage.getItem("previousSearches")) || [];
  let currentPage = 1;
  let currentUser = "";
  let loading = false;
  let hasMore = true;
  let allRepos = [];

  // Search by keyword filter
keywordInput.addEventListener("input", () => {
  currentPage = 1;
  allRepos = [];
  hasMore = true;
  getRepos(currentUser, currentPage, keywordInput.value.trim().toLowerCase());
});


  // Bookmark icon
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

  // Toggle favorites
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

  // Datalist for search history
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

  // Search triggers
  btnSearch.onclick = () => startSearch();
  eleInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") startSearch();
  });

  function startSearch() {
    currentUser = eleInput.value.trim();
    currentPage = 1;
    allRepos = [];
    hasMore = true;
    containerData.innerHTML = "";
    userInfo.style.display = "none";
    getUserInfo(currentUser);
    getRepos(currentUser, currentPage);
  }

  // Fetch user info
  function getUserInfo(username) {
    fetch(`https://api.github.com/users/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((user) => {
        userInfo.innerHTML = `
          <img src="${user.avatar_url}" alt="Avatar" class="rounded-circle mb-2" width="80" height="80">
          <h5 class="text-white">${user.login}</h5>
          <p class="text-light">
            <strong>${user.public_repos}</strong> Repositories | 
            <strong>${user.followers}</strong> Followers | 
            <strong>${user.following}</strong> Following
          </p>
        `;
        userInfo.style.display = "block";
      })
      .catch(() => {
        userInfo.innerHTML = `<p class="text-danger">User not found</p>`;
        userInfo.style.display = "block";
      });
  }

  // Fetch repos with search keyword directly from GitHub API
  function getRepos(username, page = 1, keyword = "") {
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

    // Use GitHub search API instead of filtering local data
    let url = `https://api.github.com/search/repositories?q=user:${username}`;
    if (keyword) {
      url += `+${encodeURIComponent(keyword)}`;
    }
    url += `&per_page=20&page=${page}&sort=updated`;

    fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error("Error fetching repositories");
        return response.json();
      })
      .then((data) => {
        const repos = data.items || [];
        if (repos.length === 0) {
          if (page === 1) {
            resultInfo.textContent = "No repositories found.";
          } else {
            resultInfo.textContent = "No more repositories.";
          }
          hasMore = false;
          return;
        }

        allRepos = [...allRepos, ...repos];
        resultInfo.style.display = "none";

       displayRepos(repos, keywordInput.value.trim().toLowerCase(), true);// directly display fetched repos

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

  // Search triggers
  btnSearch.onclick = () => {
    currentUser = eleInput.value.trim();
    currentPage = 1;
    allRepos = [];
    hasMore = true;
    containerData.innerHTML = "";
    userInfo.style.display = "none";
    getUserInfo(currentUser);
    getRepos(currentUser, currentPage, keywordInput.value.trim().toLowerCase());
  };

  keywordInput.addEventListener("input", () => {
    const keyword = keywordInput.value.trim().toLowerCase();

    if (keyword === "") {
      displayRepos(allRepos, "", false);
    } else {
      currentPage = 1;
      allRepos = [];
      hasMore = true;
      containerData.innerHTML = "";
      getRepos(currentUser, currentPage, keyword);
    }
  });


  // Display repos with optional filter
  function displayRepos(repos, keyword = "", append = false) {
    if (!append) {
      containerData.innerHTML = ""; 
    }

    const filtered = repos.filter((repo) =>
      repo.name.toLowerCase().includes(keyword)
    );

    if (!append && filtered.length === 0) {
      resultInfo.style.display = "block";
      resultInfo.textContent = "No repositories match your search.";
      return;
    } else {
      resultInfo.style.display = "none";
    }

    filtered.forEach((repo) => {
      const repoContainer = document.createElement("div");
      const btnContainer = document.createElement("div");
      const repoTitle = document.createElement("h3");

      repoTitle.textContent = repo.name;
      repoContainer.classList.add("container-data");
      btnContainer.classList.add("link-Container");

      // Visit
      const btnVisit = document.createElement("a");
      btnVisit.href = repo.html_url;
      btnVisit.target = "_blank";
      btnVisit.className = "btn-icon";
      btnVisit.innerHTML = `<i class="fas fa-link"></i>`;
      btnContainer.appendChild(btnVisit);

      // Copy link
      const btnCopy = document.createElement("button");
      btnCopy.className = "btn-icon";
      btnCopy.innerHTML = `<i class="fas fa-copy"></i>`;
      btnCopy.onclick = () => {
        navigator.clipboard.writeText(repo.html_url);
        btnCopy.innerHTML = `<i class="fas fa-check text-success"></i>`;
        setTimeout(
          () => (btnCopy.innerHTML = `<i class="fas fa-copy"></i>`),
          1500
        );
      };
      btnContainer.appendChild(btnCopy);

      // Download
      const btnDownload = document.createElement("a");
      btnDownload.href = `https://github.com/${currentUser}/${repo.name}/archive/refs/heads/main.zip`;
      btnDownload.download = repo.name;
      btnDownload.className = "btn-icon";
      btnDownload.innerHTML = `<i class="fas fa-download"></i>`;
      btnContainer.appendChild(btnDownload);

      // Demo button (GitHub Pages or Homepage)
      if (repo.has_pages) {
        const btnPage = document.createElement("a");
        btnPage.href = `https://${currentUser}.github.io/${repo.name}/`;
        btnPage.target = "_blank";
        btnPage.className = "btn-icon";
        btnPage.innerHTML = `<i class="fas fa-globe"></i>`;
        btnContainer.appendChild(btnPage);
      } else if (repo.homepage) {
        const btnPage = document.createElement("a");
        btnPage.href = repo.homepage;
        btnPage.target = "_blank";
        btnPage.className = "btn-icon";
        btnPage.innerHTML = `<i class="fas fa-globe"></i>`;
        btnContainer.appendChild(btnPage);
      }

      repoContainer.appendChild(repoTitle);
      repoContainer.appendChild(btnContainer);
      containerData.appendChild(repoContainer);
    });
  }
  // Infinite scroll
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
