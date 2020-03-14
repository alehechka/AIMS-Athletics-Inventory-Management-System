import axios from "axios";

const apiUrl = "http://localhost:5000/api/v1";

async function login(email, password, remember) {
  return await axios
    .post(
      `${apiUrl}/credentials/login`,
      { email, password, remember },
      { withCredentials: true }
    )
    .then(res => {
      console.log(res);
      return res.data;
    });
}

async function signup(email, username, password) {
  return await axios
    .post(
      `${apiUrl}/credentials/signup`,
      { email, username, password },
      { withCredentials: true }
    )
    .then(res => {
      return res.data;
    });
}

async function getCredentials() {
  return await axios
    .get(`${apiUrl}/credentials/current`, { withCredentials: true })
    .then(res => {
      return res.data;
    });
}

async function logout() {
  await axios
    .get(`${apiUrl}/credentials/logout`, { withCredentials: true })
    .then(res => {
      window.location.href = "/";
    });
}

export { login, logout, signup, getCredentials };
