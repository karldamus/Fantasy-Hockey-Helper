var xhttp;
let allPlayers = {};

// fetch data from the given URL
async function getData(URL) {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}