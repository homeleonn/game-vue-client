import {apiHost, tokenUrl} from "@/../.env.js";
const apiVersion = 1;
let _apiHost = apiHost;
if (!apiHost) {
  _apiHost = new URL(tokenUrl).origin;
}
const api = _apiHost + '/api/v' + apiVersion;
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
