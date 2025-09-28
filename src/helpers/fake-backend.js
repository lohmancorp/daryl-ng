// In a real application, this file would be used to mock API calls for development.
// For now, we'll just export a function to satisfy the import in index.js.

export { fakeBackend };

// array in local storage for registered users
const usersKey = 'vue-3-pinia-registration-login-example-users';
let users = JSON.parse(localStorage.getItem(usersKey)) || [];

// ensure admin and user accounts exist
if (!users.find(x => x.username === 'admin')) {
    users.push({ id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: 'Admin' });
}
if (!users.find(x => x.username === 'user')) {
    users.push({ id: 2, username: 'user', password: 'user', firstName: 'Normal', lastName: 'User', role: 'User' });
}
// Persist the changes to local storage
localStorage.setItem(usersKey, JSON.stringify(users));


function fakeBackend() {
    const { fetch: originalFetch } = window;
    window.fetch = async function(url, config) {
        // wrap in timeout to simulate server api call
        return new Promise((resolve, reject) => {
            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = config;
                switch (true) {
                    case url.endsWith('/users/authenticate') && method === 'POST':
                        return authenticate();
                    case url.endsWith('/users/register') && method === 'POST':
                        return register();
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && method === 'GET':
                        return getUserById();
                    case url.match(/\/users\/\d+$/) && method === 'PUT':
                        return updateUser();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser();
                    default:
                        // pass through any requests not handled above
                        return originalFetch(url, config)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function register() {
                const user = body();

                if (users.find(x => x.username === user.username)) {
                    return error(`Username "${user.username}" is already taken`);
                }

                // ensure new registrations get 'User' role by default
                user.role = 'User';
                user.id = users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
                users.push(user);
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }

            function authenticate() {
                const { username, password } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Invalid username or password');

                return ok({
                    ...basicDetails(user),
                    token: 'fake-jwt-token'
                });
            }

            function getUsers() {
                return ok(users.map(x => basicDetails(x)));
            }

            function getUserById() {
                const user = users.find(x => x.id === idFromUrl());
                return ok(basicDetails(user));
            }

            function updateUser() {
                let params = body();
                let user = users.find(x => x.id === idFromUrl());

                // only update password if entered
                if (!params.password) {
                    delete params.password;
                }

                // update and save user
                Object.assign(user, params);
                localStorage.setItem(usersKey, JSON.stringify(users));

                return ok();
            }



            function deleteUser() {
                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem(usersKey, JSON.stringify(users));
                return ok();
            }

            // helper functions

            function ok(body) {
                resolve({ ok: true, ...headers(), text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, ...headers(), text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function basicDetails(user) {
                const { id, username, firstName, lastName, role } = user;
                return { id, username, firstName, lastName, role };
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return JSON.parse(config.body);
            }

            function headers() {
                return {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            }
        });
    }
}