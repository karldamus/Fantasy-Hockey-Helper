async function getData(link, type) {
    // get the access token, it will be updated in the secrets file
    await getNewAccessToken();
    // time delay to allow for the access token to be updated
    // await new Promise(r => setTimeout(r, 1000));

    return new Promise(function (resolve, reject) {
        $.ajax({
            url: link,
            type: type,
            headers: {
                "Authorization": "Bearer " + secrets.access_token,
                "Access-Control-Allow-Origin": "*"
            },
            success: function (data) {
                var json = xml2json(data, "  ");
                resolve(JSON.parse(json));
            },
            error: function (error) {
                console.log("Error getting data via AJAX request with link: " + link + " and type: " + type);
                console.log(error);
            }
        });
    });
}