export const BASE_URL = "/api";

export const getUserInfo = (token) => {
  return fetch(`${BASE_URL}/user/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => {
    return res.ok ? res.json() : Promise.reject(`Error: ${res.status}`);
  });
};
