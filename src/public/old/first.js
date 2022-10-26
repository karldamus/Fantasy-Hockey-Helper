var xhttp;
let allPlayers = {};

// fetch data from the given URL
async function getData(URL) {
    let response = await fetch(URL);
    let data = await response.json();
    return data;
}


async function getDayOfWeekAsWord(date) {
    let dayOfWeek = new Date(date).getDay();

    switch (dayOfWeek) {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
        default:
            return "Error";
    }
}