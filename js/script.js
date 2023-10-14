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
                                            // ... (Rest of your existing code to display repositories)
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
                    // Display the container if repositories were found
                    containerData.classList.remove('d-none');
                }
            })
            .catch((error) => {
                resultInfo.textContent = 'Error fetching repositories. Please try again.';
            });
    }
}
