document.addEventListener('DOMContentLoaded', function () {

    const asiaChart = document.getElementById('asia-chart').getContext('2d');
    const holidayChart = document.getElementById('holiday-chart').getContext('2d');
    const capChart = document.getElementById('cap-chart').getContext('2d');

    const dynamicContent = document.getElementById("dynamic-content")

    const barColors = ["red", "green","blue","orange","brown", "pink", "purple", "black", 'aqua', 'gold', 'peachpuff',
    'maroon', 'rosybrown', 'sandybrown', 'silver', 'crimson', 'DarkGreen', 'LightCoral', 'Olive', 'MediumAquamarine',
    'LightSalmon', 'Firebrick', 'DarkRed', 'SeaGreen', 'GreenYellow', 'Lime', 'Navy', 'SkyBlue', 'Indigo', 'Orchid',
    'SlateBlue', 'Plum', 'Lavender', 'MidnightBlue', 'HotPink', 'Tomato', 'DeepPink', 'Coral', 'PaleVioletRed',
    'DarkOrange', 'OrangeRed', "DarkCyan", 'Turquoise', 'CadetBlue', 'Khaki', 'PaleGoldenrod', 'Chocolate', 'SaddleBrown',
    'DarkMagenta', 'Fuchsia', 'RoyalBlue', 'LawnGreen', 'LightGreen'];

    const getAuthToken = () => {
        return localStorage.getItem('authToken');
    };


    let authToken = getAuthToken();

    const content = document.getElementById("content")

    const updateNavbar = () => {
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        const adminBtn = document.getElementById('adminPageBtn');

        const populationBtn = document.getElementById('populationBtn');
        const holidaysBtn = document.getElementById('holidaysBtn');
        const marketCapBtn = document.getElementById('marketCapBtn');

        if (authToken) {
            loginBtn.style.display = 'none';
            signupBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
            populationBtn.style.display = 'inline-block';
            holidaysBtn.style.display = 'inline-block';
            marketCapBtn.style.display = 'inline-block';

            const isAdmin = checkUserRole(authToken, 'ADMIN');
            adminBtn.style.display = isAdmin ? 'inline-block' : 'none';
        } else {
            loginBtn.style.display = 'inline-block';
            signupBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
            populationBtn.style.display = 'none';
            holidaysBtn.style.display = 'none';
            marketCapBtn.style.display = 'none';

            adminBtn.style.display = 'none';
        }
    };

    const storeAuthToken = (token) => {
        localStorage.setItem('authToken', token);
    };

    const clearAuthToken = () => {
        localStorage.removeItem('authToken');
    };

    const checkUserRole = (token, roleToCheck) => {
        const decodedToken = decodeJwtToken(token);
        return decodedToken.roles.includes(roleToCheck);
    };

    const decodeJwtToken = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

        return JSON.parse(jsonPayload);
    };

    updateNavbar();
    if (!authToken) {
        showHomeText();
    } else {
        loadProjects();
    }


    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', () => {
        asiaChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'none';
        holidayChart.canvas.style.display = 'none';

        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()
        showHomeText()

        clearAuthToken();
        authToken = null;
        updateNavbar();
    });

    const homeBtn = document.getElementById('homeBtn');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const adminPageBtn = document.getElementById('adminPageBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeSignupModal = document.getElementById('closeSignupModal');
    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    const signupSubmitBtn = document.getElementById('signupSubmitBtn');

    const populationBtn = document.getElementById('populationBtn');
    const holidaysBtn = document.getElementById('holidaysBtn');
    const marketCapBtn = document.getElementById('marketCapBtn');

    populationBtn.addEventListener('click', async () => {
        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()

        asiaChart.canvas.style.display = 'inline';
        holidayChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'none';

        const response = await fetch('http://localhost:3000/api/asiapopulation', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization' : `Bearer ${authToken}`
            },
        });
        const data = await response.json();
        const xValues = [];
        const yValues = [];
        for (let value of data) {
            xValues.push(value.name)
            yValues.push(value.population)
        }

        const myChart = new Chart(asiaChart, {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Asia Population"
                }
            }
        });

    })

    holidaysBtn.addEventListener('click', async () => {
        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()

        asiaChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'none';
        holidayChart.canvas.style.display = 'inline';

        const response = await fetch('http://localhost:3000/api/holidays?country=SM', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : `Bearer ${authToken}`
            },
        });
        const data = await response.json();
        // console.log(data)
        const months = Object.keys(data);
        const holidayCounts = months.map(month => data[month].count);

        const myChart2 = new Chart(holidayChart, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Number of holidays by month in San Marino',
                    data: holidayCounts,
                    backgroundColor: "LightPink",
                    borderColor: 'DeepPink',
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });

    })

    marketCapBtn.addEventListener('click', async () => {
        asiaChart.canvas.style.display = 'none';
        holidayChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'inline';

        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()

        const response = await fetch('http://localhost:3000/api/marketcap', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization' : `Bearer ${authToken}`
            },
        });
        const data = await response.json();
        const reversedData = data.reverse()

        const dates = reversedData.map(entry => entry.date);
        const marketCaps = reversedData.map(entry => entry.marketCap);

        const scatterChart = new Chart(capChart, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Market Capitalization Of Apple Corporation from 2024.01.02 to 2024.02.29',
                    backgroundColor: 'MistyRose',
                    borderColor: 'Plum',
                    data: marketCaps,
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                        }
                    },
                    y: {
                        beginAtZero: true,
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                    }
                }
            }
        })

    });

    homeBtn.addEventListener('click',  () => {
        asiaChart.canvas.style.display = 'none';
        holidayChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'none';

        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()

        if(!authToken){
            showHomeText()
        } else {
            loadProjects()
        }
    });



    function generateUpdateForm(project) {
        const form = $('<form id="updateForm">');

        Object.keys(project).forEach(field => {
            if (field !== '_id' && field !== 'createdAt' && field !== 'updatedAt' && field !== 'deletedAt' && field !== 'deleted') {
                if (field === 'images') {
                    for (let i = 0; i < 3; i++) {
                        const label = $('<label>').text(`${field}[${i}]: `);
                        const input = $('<input>').attr({
                            type: 'text',
                            name: `${field}[${i}]`,
                            value: project[field][i]
                        });
                        form.append(label, input, '<br>');
                    }
                } else {
                    const label = $('<label>').text(`${field}: `);
                    const input = $('<input>').attr({
                        type: 'text',
                        name: field,
                        value: project[field]
                    });
                    form.append(label, input, '<br>');
                }
            }
        });

        const submitBtn = $('<button type="submit">Update Project</button>');
        const returnBtn = $('<button type="button">Return</button>').on('click', function() {
            $('#dynamic-content form').remove()
            loadProjects()
        });

        form.append(submitBtn, returnBtn);

        form.on('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            delete formObject.submit;

            let url = `http://localhost:3000/project/${project._id}`
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${authToken}`
                },
                body: JSON.stringify(formObject),
            });
            $('#dynamic-content form').remove()
            loadProjects()
        });

        return form;
    }


    function generateCreateForm() {
        const form = $('<form id="createProjectForm">');

        const fields = ['name_en', 'name_ru', 'description_en', 'description_ru', 'images', 'stack'];
        const formObject = {};

        fields.forEach(field => {
            if (field === 'images') {
                const imageUrls = [];
                for (let i = 0; i < 3; i++) {
                    const label = $('<label>').text(`${field}[${i}]: `);
                    const input = $('<input>').attr({
                        type: 'text',
                        name: `${field}[${i}]`,
                        placeholder: `Enter image ${i + 1} URL`
                    });
                    form.append(label, input, '<br>');
                    imageUrls.push(input.val());  // Note: push input.val() inside the loop
                }
                formObject[field] = imageUrls;
            } else if (field === 'stack') {
                const stackOptions = ['Java', 'C++', 'Python', 'NodeJS', 'JS', 'HTML', 'CSS', 'Golang'];

                stackOptions.forEach(option => {
                    const checkbox = $('<input>').attr({
                        type: 'checkbox',
                        name: 'stack',
                        value: option,
                        id: `stack_${option}`
                    });
                    const label = $('<label>').attr('for', `stack_${option}`).text(option);
                    form.append(checkbox, label, '<br>');
                });
            } else {
                const label = $('<label>').text(`${field}: `);
                const input = $('<input>').attr({
                    type: 'text',
                    name: field,
                    placeholder: `Enter ${field}`
                });

                form.append(label, input, '<br>');
                formObject[field] = input.val();
            }
        });

        const submitBtn = $('<button type="submit">Submit</button>');

        const returnBtn = $('<button type="button">Return</button>').on('click', function() {
            $('#createProjectForm').remove();
        });

        form.append(submitBtn, returnBtn);

        form.on('submit', async function(event) {
            event.preventDefault();

            fields.forEach(field => {
                if (field !== 'images' && field !== 'stack') {
                    formObject[field] = form.find(`[name="${field}"]`).val();
                }
            });

            formObject['images'] = Array.from({ length: 3 }, (_, i) =>
                form.find(`[name="images[${i}]"]`).val()
            );

            formObject['stack'] = $('input[name="stack"]:checked').map(function() {
                return $(this).val();
            }).get();

            console.log(formObject);

            const url = 'http://localhost:3000/project';
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${authToken}`
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    alert('Project created successfully');
                    $('#dynamic-content form').remove()
                    loadProjects();
                } else {
                    alert('Failed to create project');
                }
            } catch (error) {
                console.error('Error creating project:', error);
            }
        });

        return form;
    }

    function showHomeText(){
        const homeText = `<h2>Please, authorize to see this page</h2>`
        $('#dynamic-content').append(homeText);
    }

    function loadProjects() {
        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()

        $.get('/project', (projects) => {
            projects.forEach((item) => {
                if (checkUserRole(authToken, "ADMIN")) {
                    const carouselItem = `
                <div class="carousel-wrapper">
                    <div class="owl-carousel">
                            <div class="item">
                                <img src="${item.images[0]}" alt="Image 1">
                            </div>
                            <div class="item">
                                <img src="${item.images[1]}" alt="Image 2">
                            </div>
                            <div class="item">
                                <img src="${item.images[2]}" alt="Image 3">
                            </div>               
                    </div>
                    <h2>${item.name_en}</h2>
                    <h4>Stack: ${item.stack}</h4>
                    <p>${item.description_en}</p>
                    <button class="edit-btn" data-item-id="${item._id}">Edit</button>
                    <button class="delete-btn" data-item-id="${item._id}" style="display:inline-block;">Delete</button>
                </div>
            `;

                    $('#dynamic-content').append(carouselItem);

                } else {
                    const carouselItem = `
                <div class="carousel-wrapper">
                    <div class="owl-carousel">
                            <div class="item">
                                <img src="${item.images[0]}" alt="Image 1">
                            </div>
                            <div class="item">
                                <img src="${item.images[1]}" alt="Image 2">
                            </div>
                            <div class="item">
                                <img src="${item.images[2]}" alt="Image 3">
                            </div>               
                    </div>
                    <h2>${item.name_en}</h2>
                    <h4>Stack: ${item.stack}</h4>
                    <p>${item.description_en}</p>               
                </div>
            `;

                    $('#dynamic-content').append(carouselItem);
                }
            });


            $('.edit-btn').on('click', async function() {
                const itemId = $(this).data('item-id');
                $('#dynamic-content div').remove();
                $('#dynamic-content h2').remove();
                $('#dynamic-content form').remove();
                $('#dynamic-content button').remove();

                const response = await fetch(`http://localhost:3000/project/${itemId}`);
                const project = await response.json();

                const form = generateUpdateForm(project);
                $('#dynamic-content').append(form);
            });

            $('.delete-btn').on('click', async function() {
                const itemId = $(this).data('item-id');
                if (confirm('Are you sure you want to delete this item?')) {
                    const response = await fetch(`http://localhost:3000/project/${itemId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization' : `Bearer ${authToken}`
                        },
                    });
                    loadProjects();
                }
            });

            $('.owl-carousel').owlCarousel({
                loop: true,
                margin: 10,
                nav: true,
                responsive: {
                    0: {
                        items: 1
                    },
                    600: {
                        items: 1
                    },
                    1000: {
                        items: 1
                    }
                }
            });
        });
    }




    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    signupBtn.addEventListener('click', () => {
        signupModal.style.display = 'block';
    });

    adminPageBtn.addEventListener('click', () => {
        asiaChart.canvas.style.display = 'none';
        holidayChart.canvas.style.display = 'none';
        capChart.canvas.style.display = 'none';

        $('#dynamic-content div').remove()
        $('#dynamic-content h2').remove()
        $('#dynamic-content form').remove()
        $('#dynamic-content button').remove()

        const addButton = $('<button id="addProjectBtn">Add New Project</button>').on('click', () => {
            $('#dynamic-content button').remove();
            const newProjectForm = generateCreateForm();
            $('#dynamic-content').append(newProjectForm);
        });

        $('#dynamic-content').append(addButton);
    });

    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    closeSignupModal.addEventListener('click', () => {
        signupModal.style.display = 'none';
    });

    loginSubmitBtn.addEventListener('click', async () => {
        try {
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;
            const response = await loginUser(username, password);
            if (!response.token){
                alert('Incorrect username or password. Please try again.');
            } else {
                authToken = response.token;
                storeAuthToken(authToken);
                updateNavbar();
                loginModal.style.display = 'none';

                $('#dynamic-content h2').remove()
                loadProjects()
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Incorrect username or password. Please try again.');
        }
    });

    signupSubmitBtn.addEventListener('click', async () => {
        try {
            const username = document.getElementById('signupUsername').value;
            const password = document.getElementById('signupPassword').value;
            const country = document.getElementById('signupCountry').value;
            const email = document.getElementById('signupEmail').value;
            const firstName = document.getElementById('signupFirstName').value;

            const response = await registerUser({ username, password, country, email, firstName });
            alert(response.message)
            if (response.message === "The user was successfully registered") {
                signupModal.style.display = 'none';
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please check your input and try again.');
        }
    });

    const registerUser = async (userData) => {
        const response = await fetch('http://localhost:3000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        return data;
    };

    const loginUser = async (username, password) => {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        return data;
    };
});
