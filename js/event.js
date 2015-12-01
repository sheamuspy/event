/*global $, jQuery, document, sendRequest, alert, sessionStorage, window, getEvents */


$(document).ready(function () {
    "use strict";


    $(document).ready(function () {
        $('select').material_select();
    });


    var userId = sessionStorage.getItem("userId");
    getEvents();

});

$(function () {
    "use strict";
    $("#addEventBtn").click(function () {
        var eventOwner, eventName, eventDescription, eventDate, eventTime, eventVenue, URL, response;
        eventOwner = sessionStorage.getItem("userId");
        eventName = $("#eventName").val();
        eventDescription = $("#eventDescription").val();
        eventDate = $("#eventDate").val();
        eventTime = $("#eventTime").val();
        eventVenue = $("#eventVenue").val();

        URL = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=1&event_owner=" + eventOwner + "&event_name='" + eventName + "'&event_description='" + eventDescription + "'&event_date='" + eventDate + "'&event_time='" + eventTime + "'&event_venue=" + eventVenue;
        response = sendRequest(URL);

        if (response.status === 0) {
            $("#eventName").val("");
            $("#eventDescription").val("");
            $("#eventDate").val("");
            $("#eventTime").val("");
            $("#eventVenue").val("");
            alert("Added");
        } else if (response.status === 2) {
            alert("Please again try later");
        } else {
            alert("Please check your feilds.");
        }
    });
});

function getEvents() {
    "use strict";
    var userId, URL, URL2, response, response2, events, feedback, commented, i, j;

    userId = sessionStorage.getItem("userId");

    URL = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=4&user_id=" + userId;
    URL2 = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=8&user_id=" + userId;

    response = sendRequest(URL);
    response2 = sendRequest(URL2);
    events = response.events;
    feedback = response2.feedback;
    j = 0;


    for (i = 0; i < events.length; i = i + 1) {

        commented = false;

        $("#event-list").append("<div class='card-panel'>" +
            "<ul>" +
            "<li>" + events[i].EVENT_NAME + "</li>" +
            "<li>" + events[i].EVENT_OWNER + "</li>" +
            "<li>" + events[i].EVENT_DESCRIPTION + "</li>" +
            "</ul>" +
            "</div>");

        for (j; j < feedback.length; j = j + 1) {
            if (events[i].EVENT_ID !== feedback[j].SUBSCRIPTION_EVENT_ID) {
                break;
            } else if (feedback[j].SUBSCRIPTION_USER_ID === userId) {
                commented = true;
            }
            $("#event-list").append("<div class='card-panel'>" +
                "<td>" + feedback[j].FEEDBACK_COMMENT + "</td>" +
                "<td>" + feedback[j].EVENT_OWNER + "</td>" +
                "</tr>" +
                "</div>");
        }

        if (commented === false) {
            $("#event-list").append("<div class='card-panel'>" +
                "<h4>Feedback</h4>" +
                "<div class='divider'></div>" +
                "<div class='input-field'>" +
                "<input placeholder='Comment' id='commentforevent" + i + "' type='text' class='validate'>" +
                "<label for='commentforevent" + i + "'>Comment</label>" +
                "</div>" +
                "<div class='input-field col s12'>" +
                "<select id='ratingforevent" + i + "'>" +
                "<option value='' disabled selected>Choose your rating</option>" +
                "<option value='1'>1 Star</option>" +
                "<option value='2'>2 Stars</option>" +
                "<option value='3'>3 Stars</option>" +
                "<option value='4'>4 Stars</option>" +
                "<option value='5'>5 Stars</option>" +
                "</select>" +
                "<label>Rating</label>" +
                "</div>" +
                "<a class='waves-effect waves-teal btn-flat' onclick='sendFeedback(" + i + ", " + events[i].SUBSCRIPTION_ID + ")'>Add Comment</a>" +
                "</div>");
        }
    }

}

function sendFeedback(event, subscriptionId) {
    var comment, rating, URL, response;
    comment = $("#commentforevent" + event).val();
    rating = $("#ratingforevent" + event).val();

    if (comment === "" || rating === "") {
        return;
    }

    URL = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=5&subscription_id=" + subscriptionId + "&comment='" + comment + "'&rating=" + rating;
    alert(URL);
    response = sendRequest(URL);

    if (response.status === 0) {
        $("#event-list").empty();
        getEvents();
        Materialize.toast(response.message, 2000);
    } else {
        Materialize.toast(response.message, 2000);
    }

}


//$(function () {
//    "use strict";
//    $("#addEvent").click(function () {
//        cordova.plugins.barcodeScanner.scan(
//            function (result) {
//                addEventH(result.text);
//            },
//            function (error) {
//                $("#result").val(error);
//            }
//        );
//    });
//});

function addEvent() {
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            addEventH(result.text);
        },
        function (error) {
            $("#result").val(error);
        }
    );
}

function addEventH(eventCode) {
    var userId, URL, response;

    userId = sessionStorage.getItem("userId");

    URL = "http://cs.ashesi.edu.gh/~csashesi/class2016/sheamus-yebisi/mobile_web/Event/php/android_ajax.php?cmd=4&user_id=" + userId + "&event_code=" + eventCode;

    response = sendRequest(URL);

    if (response.status == 0) {
        $("#event-list").empty();
        getEvents();
        Materialize.toast(response.message, 2000);
    } else {
        Materialize.toast(response.message, 2000);
    }

}

function logout() {
    "use strict";
    sessionStorage.clear();
    window.location = "index.html";
}

function sendRequest(u) {
    "use strict";
    var obj, result;
    obj = $.ajax({
        url: u,
        async: false
    });
    result = $.parseJSON(obj.responseText);
    return result;
}
