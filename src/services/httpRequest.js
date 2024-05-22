const get = async (path, option = {}) => {
  option = {
    method: "GET", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    ...option,
  }
  return fetch(`https://nhmhdemo.click/api${path}`, option).then(res => res.json()).then(data => data);
}

const post = async (path, data = {}, option = {}) => {
  option = {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...option
  }

  return fetch(`https://nhmhdemo.click/api${path}`, option).then(res => res.json()).then(data => data);
}

const remove = async (path, data = {}, option = {}) => {
  option = {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache",
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    ...option
  }

  return fetch(`https://nhmhdemo.click/api${path}`, option).then(res => res.json()).then(data => data);
}


export { get, post, remove }
