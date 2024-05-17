import {apiHost} from "@/../.env.js";

const apiVersion = 1;
const api = apiHost + '/api/v' + apiVersion;
export async function login(captcha, id = 1) {
  // console.log(apiHost + '/forced-login');return;
  let response = await fetch(api + '/forced-login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      // 'Accept': 'application/json',
    },
    body: JSON.stringify({
      'g-recaptcha-response': captcha,
      'id': id
    })
  });

  return response;
}

export async function logout() {
  sessionStorage.removeItem('jwt');
  window.location.reload();
}
