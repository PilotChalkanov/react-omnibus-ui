export { fakeBackend };

// array in local storage for registered users
const usersKey = "users";
const connectionsKey = "connections";
const pairsKey = "pairs";
let users = JSON.parse(localStorage.getItem(usersKey)) || [];
let allConnections = JSON.parse(localStorage.getItem(connectionsKey)) || [];
let pairedConnections = JSON.parse(localStorage.getItem(pairsKey)) || [];

function fakeBackend() {
  let realFetch = window.fetch;
  window.fetch = function (url, opts) {
    return new Promise((resolve, reject) => {
      // wrap in timeout to simulate server api call
      setTimeout(handleRoute, 500);

      function handleRoute() {
        switch (true) {
          case url.endsWith("/users/authenticate") && opts.method === "POST":
            return authenticate();
          case url.endsWith("/auth/me") && opts.method === "GET":
            return getAuthenticatedUser();
          case url.endsWith("/users/logout") && opts.method === "POST":
            return logout();
          case url.endsWith("/users/register") && opts.method === "POST":
            return register();
          case url.endsWith("/users") && opts.method === "GET":
            return getUsers();
          case url.match(/\/users\/\d+$/) && opts.method === "GET":
            return getUserById();
          case url.match(/\/users\/\d+$/) && opts.method === "PUT":
            return updateUser();
          case url.match(/\/users\/\d+$/) && opts.method === "DELETE":
            return deleteUser();
          case url.endsWith("/connections/add") && opts.method === "POST":
            return addConnection();
          case url.endsWith("/connections") && opts.method === "GET":
            return getConnections();
          case url.match(/\/connections\/\d+$/) && opts.method === "GET":
            return getConnectionById();
          case url.match(/\/connections\/\d+$/) && opts.method === "PUT":
            return updateConnection();
          case url.match(/\/connections\/\d+$/) && opts.method === "DELETE":
            return deleteConnection();
          case url.endsWith("/pairs/add") && opts.method === "POST":
            return addPair();
          case url.endsWith("/pairs") && opts.method === "GET":
            return getPairs();
          case url.match("pairs/unpair") && opts.method === "DELETE":
            return deletePair();
          case url.match(/\/pairs\/\d+$/) && opts.method === "DELETE":
            return deleteAllPairs();
          default:
            // pass through any requests not handled above
            return realFetch(url, opts)
              .then((response) => resolve(response))
              .catch((error) => reject(error));
        }
      }

      // route functions

      // User & Auth

      function authenticate() {
        const { username, password } = body();
        const user = users.find(
          (x) => x.username === username && x.password === password
        );

        if (!user) return error("Username or password is incorrect");

        // Create a fake JWT token with user ID in it
        const token = `fake-jwt-token.${user.id}`;

        // Set the token in a cookie
        document.cookie = `authToken=${token}; path=/; max-age=86400;  `;

        return ok({
          ...basicDetails(user),
        });
      }

      function logout() {
        // Clear the authToken cookie
        document.cookie = "authToken=; Max-Age=0; path=/";
        return ok({ message: "Logged out successfully" });
      }

      function getAuthenticatedUser() {
        const authToken = getCookie("authToken");

        // Retrieve user ID from the fake JWT token
        const userId = authToken?.split(".")[1]; // Extract user ID from the token
        if (!userId || authToken.split(".")[0] !== "fake-jwt-token") {
          return unauthorized(); // If token is invalid, return unauthorized
        }

        // Find the user based on the user ID from the token
        const user = users.find((u) => u.id === parseInt(userId));
        if (!user) return unauthorized();

        return ok(basicDetails(user));
      }

      function register() {
        const user = body();

        if (users.find((x) => x.email === user.email)) {
          return error("A user is already registered with this email");
        }
        if (users.find((x) => x.username === user.username)) {
          return error('Username "' + user.username + '" is already taken');
        }

        user.id = users.length ? Math.max(...users.map((x) => x.id)) + 1 : 1;
        users.push(user);
        localStorage.setItem(usersKey, JSON.stringify(users));
        return ok();
      }

      function getUsers() {
        if (!isAuthenticated()) return unauthorized();
        return ok(users.map((x) => basicDetails(x)));
      }

      function getUserById() {
        if (!isAuthenticated()) return unauthorized();

        const user = users.find((x) => x.id === idFromUrl());
        return ok(basicDetails(user));
      }

      function updateUser() {
        if (!isAuthenticated()) return unauthorized();
        let params = body();
        let user = users.find((x) => x.id === idFromUrl());

        // only update password if entered
        if (!params.password) {
          delete params.password;
        }
        // if username changed check if taken
        if (
          params.username !== user.username &&
          users.find((x) => x.username === params.username)
        ) {
          return error('Username "' + params.username + '" is already taken');
        }
        // update and save user
        Object.assign(user, params);
        localStorage.setItem(usersKey, JSON.stringify(users));

        return ok();
      }

      function deleteUser() {
        if (!isAuthenticated()) return unauthorized();

        users = users.filter((user) => user.id !== idFromUrl());
        localStorage.setItem(usersKey, JSON.stringify(users));
        return ok();
      }

      // Connection Functions

      function addConnection() {
        const newConnection = body();
        if (
          allConnections.find(
            (connection) => connection.id === newConnection.id
          )
        ) {
          return error(`A ${newConnection.name} connection is already added`);
        }
        allConnections.push(newConnection);
        localStorage.setItem(connectionsKey, JSON.stringify(allConnections));
        return ok();
      }

      function getConnections() {
        return ok(
          allConnections.map((connection) => {
            return { ...connection };
          })
        );
      }

      function getConnectionById() {
        const connection = allConnections.find((x) => x.id === idFromUrl());

        return ok(connection);
      }

      function updateConnection() {
        let params = body();

        let connectionIndex = allConnections.findIndex(
          (x) => x.id === idFromUrl()
        );
        if (connectionIndex === -1) return error("Connection not found");
        // Create a new updated object
        const updatedConnection = {
          ...allConnections[connectionIndex], // existing values
          ...params, // updated values
        };
        // Update the array
        allConnections[connectionIndex] = updatedConnection;

        localStorage.setItem(connectionsKey, JSON.stringify(allConnections));
        return ok();
      }

      function deleteConnection() {
        allConnections = allConnections.filter((x) => x.id !== idFromUrl());
        localStorage.setItem(connectionsKey, JSON.stringify(allConnections));
        return ok();
      }

      // Connection Pairs Functions

      function getPairs() {
        return ok(pairedConnections.map((pair) => [...pair]));
      }

      function addPair() {
        const pair = body(); // the connection pair to be added; array with two IDs
        if (
          pairedConnections.some(
            (existingPair) =>
              (existingPair[0] === pair[0] && existingPair[1] === pair[1]) ||
              (existingPair[0] === pair[1] && existingPair[1] === pair[0])
          )
        ) {
          return error(`Connections are already paired`);
        }

        pairedConnections.push(pair);
        localStorage.setItem(pairsKey, JSON.stringify(pairedConnections));
        return ok();
      }

      function deletePair() {
        let pairToDelete = body();

        pairedConnections = pairedConnections.filter(
          (existingPair) =>
            !(
              (existingPair[0] === pairToDelete[0] &&
                existingPair[1] === pairToDelete[1]) ||
              (existingPair[0] === pairToDelete[1] &&
                existingPair[1] === pairToDelete[0])
            )
        );
        localStorage.setItem(pairsKey, JSON.stringify(pairedConnections));
        return ok();
      }

      function deleteAllPairs() {
        const id = idFromUrl();

        pairedConnections = pairedConnections.filter(
          (pair) => !pair.includes(id)
        );
        localStorage.setItem(pairsKey, JSON.stringify(pairedConnections));
        return ok();
      }

      // helper functions

      function ok(body) {
        resolve({ ok: true, ...headers(), json: () => Promise.resolve(body) });
      }

      function unauthorized() {
        resolve({
          status: 401,
          ...headers(),
          json: () => Promise.resolve({ message: "Unauthorized" }),
        });
      }

      function error(message) {
        resolve({
          status: 400,
          ...headers(),
          json: () => Promise.resolve({ message }),
        });
      }

      function basicDetails(user) {
        const { id, username, firstName, lastName, email } = user;
        return { id, username, firstName, lastName, email };
      }

      // Check cookie for authentication
      function isAuthenticated() {
        // Retrieve the authToken from cookies
        const authToken = getCookie("authToken");

        // Ensure the token starts with "fake-jwt-token." and extract the user ID
        if (!authToken || !authToken.startsWith("fake-jwt-token.")) {
          return false; // Token is invalid or doesn't exist
        }

        // Extract the user ID from the token (e.g., fake-jwt-token.1 -> 1)
        const userId = authToken.split(".")[1];

        // Check if the user ID exists and is valid
        const user = users.find((u) => u.id === parseInt(userId));

        // If no user is found, return false
        if (!user) return false;

        // The user is authenticated
        return true;
      }

      // Helper function to read cookie by name
      function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
      }

      function body() {
        return opts.body && JSON.parse(opts.body);
      }

      function idFromUrl() {
        const urlParts = url.split("/");
        return parseInt(urlParts[urlParts.length - 1]);
      }

      function headers() {
        return {
          headers: {
            get(key) {
              return ["application/json"];
            },
          },
        };
      }
    });
  };
}
