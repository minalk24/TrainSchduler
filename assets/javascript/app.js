
// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCtrqAjjqqvfjr6iCUcs2UEOAJh8jnd1Lw",
    authDomain: "trainscheduler-23bb0.firebaseapp.com",
    databaseURL: "https://trainscheduler-23bb0.firebaseio.com",
    projectId: "trainscheduler-23bb0",
    storageBucket: "trainscheduler-23bb0.appspot.com",
    messagingSenderId: "244361025167",
    appId: "1:244361025167:web:e7bcddd898b3454c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

//variable to store firebase database to refer
var database = firebase.database();
console.log(database);

var minutesAway = 0;
var nextTrainArrival;

function nextTrainArrivalMinutesAway(firstTrainTime, frequency){
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    var timeDifference = moment().diff(moment(firstTimeConverted), "minutes");
    var timeRemain = timeDifference % frequency;
    minutesAway = frequency - timeRemain;
    var next = moment().add(minutesAway, "minutes");
    nextTrainArrival = moment(next).format("hh:mm A"); 
}

//store user data after click on submit button
$("#train-form").on("submit", function (event) {
    //prevent page from refreshing
    event.preventDefault();

    //store user input data to variable
    var trainName = $("#nameInput").val().trim();
    console.log(trainName);
    var trainDestination = $("#destinationInput").val().trim();
    console.log(trainDestination);
    var firstTrainTime = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    console.log(firstTrainTime);
    var freq = $("#frequencyInput").val().trim();
    console.log(freq);

    //send input data(whose value store in variables) to database 
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: firstTrainTime,
        frequency: freq
    });

    // empty the textbox after submit button clicked
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#timeInput").val("");
    $("#frequencyInput").val("");

});

//data which is added to the database grab it and render on the web page
database.ref().on("child_added", function(childSnapshot){
    console.log("child-added: " + childSnapshot.val());

    //grab data from firebase database
    var trainName = childSnapshot.val().name;
    console.log(trainName);
    var trainDestination = childSnapshot.val().destination;
    console.log(trainDestination);
    var firstTrainTime = childSnapshot.val().time;
    console.log(firstTrainTime);
    var freq = childSnapshot.val().frequency;
    console.log(freq);

    nextTrainArrivalMinutesAway(firstTrainTime, parseInt(freq));

    //create row for table
    var row = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(freq),
        $("<td>").text(nextTrainArrival),
        $("<td>").text(minutesAway),
    );

    //append new row in body
    $("#table-body").append(row);

    //if error occurs, log them to console
}, function(errorObject) {
    console.log("Errors: " + errorObject.code);
})