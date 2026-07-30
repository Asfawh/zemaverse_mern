import axios from 'axios';
const baseURL = `${import.meta.env.VITE_API_BASE_URL || ''}/api/users/`;

const http = axios.create({ baseURL });

async function callLoginReg(path, formData) {
  try {
    const response = await http.post(path, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
}

export { callLoginReg };
