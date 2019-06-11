
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

//store user data after click on submit button
$("#train-form").on("submit", function (event) {
    //prevent page from refreshing
    event.preventDefault();

    //store user input data to variable
    var trainName = $("#nameInput").val().trim();
    console.log(trainName);
    var trainDestination = $("#destinationInput").val().trim();
    console.log(trainDestination);
    var trainTime = moment($("#timeInput").val().trim(), "HH:mm").format("HH:mm");
    console.log(trainName);
    var trainFrequency = $("#frequencyInput").val().trim();
    console.log(trainFrequency);

    //send input data(whose value store in variables) to database 
    database.ref().push({
        name: trainName,
        destination: trainDestination,
        time: trainTime,
        frequency: trainFrequency
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
    var trainTime = childSnapshot.val().time;
    console.log(trainTime);
    var trainFrequency = childSnapshot.val().frequency;
    console.log(trainFrequency);

    //create row for table
    var row = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainTime),
        $("<td>").text(trainFrequency)
    );

    //append new row in body
    $("#table-body").append(row);

    //if error occurs, log them to console
}, function(errorObject) {
    console.log("Errors: " + errorObject.code);
})