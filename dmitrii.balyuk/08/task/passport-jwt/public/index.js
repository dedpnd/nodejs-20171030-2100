document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  form.onsubmit = function(event) {
    event.preventDefault();

    fetch("/login", {
      method: "POST",
      body: new FormData(this)
    })
    .then(response => response.json())
    .then(response => {
      if (response.error)
        throw response.error;

      return response.token;
    })
    .then(token => {
      alert("Auth success, fetching private information...");

      return fetch("/private", {
        headers: { "Authorization": token }
      });
    })
    .then(res => res.json())
    .then(response => {
      alert(JSON.stringify(response));
    })
    .catch(function(err) {
      alert("Error: " + err.message);
    });
  }
})
