/*global $ */

$(document).ready(function () {
    "use strict";
    if (sessionStorage.length != 0) {
        window.location = "event.html";
    }
});

function sendRequest(requestURL) {
    "use strict";
    var obj, response;

    obj = $.ajax({
        url: requestURL,
        async: false
    });
    response = $.parseJSON(obj.responseText);
    return response;

}

function login() {
    "use strict";
    var username, password, url, response;

    username = $("#loginUsername").val();
    password = $("#loginPassword").val();

    url = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=0&username='" + username + "'&password='" + password + "'";

    response = sendRequest(url);

    if (response.status === 0 && response.user != false) {
        var userId = response.user['USER_ID'];
        var username = response.user['USERNAME'];
        var userFirstname = response.user['USER_FIRSTNAME'];
        var userSurname = response.user['USER_SURNAME'];
        var userEmail = response.user['USER_EMAIL'];
        var userPicture = response.user['USER_PICTURE'];

        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("userFirstname", userFirstname);
        sessionStorage.setItem("userSurname", userSurname);
        sessionStorage.setItem("userEmail", userEmail);
        sessionStorage.setItem("userPicture", userPicture);

        window.location = "event.html";

    } else {
        Materialize.toast("Password or username is incorrect.", 2000);
    }
}
