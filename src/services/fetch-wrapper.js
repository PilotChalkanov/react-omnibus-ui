export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

function request(method) {
  return (url, body) => {
    const requestOptions = {
      method,
      headers: { "Content-Type": "application/json" }, // No Authorization header needed
    };
    if (body) {
      requestOptions.body = JSON.stringify(body);
    }
    return fetch(url, requestOptions).then(handleResponse);
  };
}

async function handleResponse(response) {
  const isJson = response.headers
    ?.get("content-type")
    ?.includes("application/json");
  const data = isJson ? await response.json() : null;

  // check for error response
  if (!response.ok) {
    const error = (data && data.message) || response.status;
    return Promise.reject(error);
  }

  return data;
}
