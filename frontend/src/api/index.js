import axios from 'axios';

const apiUrl = "http://localhost:5000/api/v1";

async function login(email, password) {
    await axios.post(`${apiUrl}/credentials/login`, 
        { email, password },
    ).then(res => {
        console.log(res)
        return res.data ;
    })
}

export { login, apiUrl }