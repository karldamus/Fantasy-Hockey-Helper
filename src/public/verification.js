async function getNewAccessToken() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "https://api.login.yahoo.com/oauth2/get_token",
            type: "POST",
            data: {
                client_id: secrets.client_id,
                client_secret: secrets.client_secret,
                redirect_uri: secrets.redirect_uri,
                refresh_token: secrets.refresh_token,
                grant_type: "refresh_token"
            },
            success: function (response) {
                resolve(secrets.access_token = response.access_token);
            },
            error: function (error) {
                console.log("Error getting new access token");
                console.log(error);
            }
        });
    });
}