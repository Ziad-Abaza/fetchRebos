window.onload = () => {
    // Variables
    let eleInput = document.getElementById('username-input');
    let btnSearch = document.getElementById('search-button');
    let containerData = document.getElementById('repos-container');
    let resultInfo = document.getElementById('result-info');

    // Retrieve previously used search queries from local storage
    let previousSearches = JSON.parse(localStorage.getItem('previousSearches')) || [];

    // Suggest previously used search queries
    eleInput.setAttribute('list', 'search-suggestions');
    const datalist = document.createElement('datalist');
    datalist.id = 'search-suggestions';
    previousSearches.forEach(query => {
        const option = document.createElement('option');
        option.value = query;
        datalist.appendChild(option);
    });
    document.body.appendChild(datalist);

    btnSearch.onclick = () => {
        getRepos();
    }

    // get repos function
    function getRepos() {
        // Clear the data from previous search
        containerData.innerHTML = ''; // Clear the container
        resultInfo.textContent = ''; // Clear the info message

        const username = eleInput.value.trim();
        if (username === '') {
            resultInfo.textContent = 'Please enter a GitHub username.';
            return;
        }

        // Add the search query to the previous searches
        if (!previousSearches.includes(username)) {
            previousSearches.push(username);
            localStorage.setItem('previousSearches', JSON.stringify(previousSearches));
        }

        fetch(`https://api.github.com/users/${username}/repos`)
            .then((response) => response.json())
            .then((result) => {
                if (result.length === 0) {
                    resultInfo.textContent = 'No repositories found.';
                } else {
                    resultInfo.textContent = `Repositories for ${username}:`;

                    result.forEach(repo => {
                        //create element
                        let repoContainer = document.createElement('div');
                        let btnContainer = document.createElement('div');
                        let repoTitle = document.createElement('h3');
                        let btnVisit = document.createElement('button');
                        let repoLink = document.createElement('a');
                        let btnDownload = document.createElement('button');
                        let repoDownload = document.createElement('a');
                        let downloadText = document.createTextNode('download');
                        let repoName = document.createTextNode(repo.name);
                        let repoVisit = document.createTextNode('visit');
                        
                        // add class name to element
                        repoContainer.classList.add('container-data');
                        repoTitle.classList.add('title-repo');
                        btnVisit.classList.add('btn-visit');
                        btnDownload.classList.add('btn-download');
                        btnContainer.classList.add('link-Container');

                        // add Attribute to element
                        repoDownload.setAttribute("href", `https://github.com/${eleInput.value}/${repo.name}/archive/refs/heads/main.zip`);
                        repoDownload.setAttribute("download", repo.name);
                        repoLink.setAttribute("href", `https://github.com/${eleInput.value}/${repo.name}`);
                        repoLink.setAttribute("target", "_blank");

                        // add Child to element
                        repoTitle.appendChild(repoName);
                        repoLink.appendChild(repoVisit);
                        btnVisit.appendChild(repoLink);
                        btnDownload.appendChild(repoDownload);
                        repoDownload.appendChild(downloadText);

                        // append to container
                        repoContainer.appendChild(repoTitle);
                        btnContainer.appendChild(btnVisit);
                        btnContainer.appendChild(btnDownload);
                        repoContainer.appendChild(btnContainer);

                        // GitHub Pages
                        fetch(`https://${eleInput.value}.github.io/${repo.name}/`)
                            .then(response => {
                                if (response.status === 200) {
                                    let btnPageLink = document.createElement('button');
                                    let repoPageLink = document.createElement('a');
                                    let pageLinkText = document.createTextNode('Pages');
                                    btnPageLink.classList.add('btn-PageLink')
                                    repoPageLink.appendChild(pageLinkText);
                                    btnPageLink.appendChild(repoPageLink);
                                    repoPageLink.setAttribute('href', `https://${eleInput.value}.github.io/${repo.name}/`);
                                    repoPageLink.setAttribute('target', '_blank');
                                    btnContainer.appendChild(btnPageLink);
                                    repoContainer.appendChild(btnContainer);
                                }
                            });

                        // append to page only if GitHub Pages exists
                        containerData.appendChild(repoContainer);

                    });

                    // Display the container if repositories were found
                    containerData.classList.remove('d-none');
                }
            })
            .catch((error) => {
                resultInfo.textContent = 'Error fetching repositories. Please try again.';
            });
    }
}
