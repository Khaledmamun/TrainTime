$(document).ready(function() {
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAPeF-YXTSvTgneWjiiuGdOyZ9nLnNC48Y",
    authDomain: "traintime-a8b1a.firebaseapp.com",
    databaseURL: "https://traintime-a8b1a.firebaseio.com",
    projectId: "traintime-a8b1a",
    storageBucket: "traintime-a8b1a.appspot.com",
    messagingSenderId: "59688427007"
  };

  firebase.initializeApp(config);

  // Creating database variable
  var database = firebase.database();

  // Creating time variable
  var currentTime = moment();

  // Global variables
  //*********************** */

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;
  var nextTrain = "";
  var minutesAway = "";
  var tConverted = "";
  var tDifference = "";
  var tRemainder = "";
  var removeData = "";
  // var postKey = "";
  // var updates = {};

  //*********************** */

  // Get input from user(s) and set-up the "Submit" button with onClick function
  $("#add-train").on("click", function(event) {
    
    // prevent page from refreshing
    event.preventDefault();

    //ensures that each input has a value
    trainName = $("#name-input").val().trim();
    if (trainName == "") {
      alert("Please Enter a Train Name.");
      return false;
    }

    destination = $("#destination-input").val().trim();
    if (destination == "") {
      alert("Please Enter Your Destination.");
      return false;
    }

    firstTrainTime = $("#firstTrainTime-input").val().trim();
    if (firstTrainTime == "") {
      alert("Please Enter The First Train Time of The Day.");
      return false;
    }

    frequency = $("#frequency-input").val().trim();
    if (frequency == "") {
      alert("Please Enter The Frequency of The Train in Minutes.");
      return false;
    }

    // Calculation for train schadule

     //*********************** */

    //subtracts the first train time back a year to ensure it's before current time
    tConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

    // the time difference between current time and the first train
    tDifference = currentTime.diff(moment(tConverted), "minutes");

    // reminding time
    tRemainder = tDifference % frequency;

    minutesAway = frequency - tRemainder;

    nextTrain = moment().add(minutesAway, "minutes").format("hh:mm");

      //*********************** */

      var newTrain = {
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
        nextTrain: nextTrain,
        minutesAway: minutesAway
      };

      console.log(newTrain);
      console.log(database.path.u[0]);

      // Code for the push
      database.ref().push(newTrain); // Previously working code

      // // Get a key for a new Post.
      // postkey = database.ref().child('posts').push().key;
      // console.log(postKey);

      // // Write the new post's data simultaneously in the posts list and the user's post list.
      // updates['/posts/' + postKey] = newTrain;

      // database.ref().update(updates);
      

      // reset the information
      $("#name-input").val("");
      $("#destination-input").val("");
      $("#firstTrainTime-input").val("");
      $("#frequency-input").val("");

      // return false;

  }); // Closes onClick function

  // Add user input to display table
  database.ref().on("child_added", function(childSnapshot) {

      $(".train-schedule").append("<tr class='table-row' id=" + "'" + childSnapshot.val() + "'" + ">" +
        
      "<td class='col-xs-3'>" + childSnapshot.val().trainName + "</td>" +

      "<td class='col-xs-2'>" + childSnapshot.val().destination + "</td>" +
      
      "<td class='col-xs-2'>" + childSnapshot.val().frequency + "</td>" +
        
      "<td class='col-xs-2'>" + childSnapshot.val().nextTrain +  "</td>" +
      
      "<td class='col-xs-2'>" + childSnapshot.val().minutesAway +  "</td>" +

      "<td class='col-xs-1'>" + 
      "<input type='submit' value='Remove Train' class='remove-train btn btn-primary btn-sm'>" +
       "</td>" +
    
       "</tr>")},
       
    // Handle the errors
    function(errorObject) {

      //console.log("Errors handled: " + errorObject.code)

    });

    // Remove the information from table
    $("body").on("click", ".remove-train", function() {

      $(this).closest('tr').remove();
      removeData = $(this).parent().parent().attr('id');
      // database.child(removeData).remove();
      dataRef.child(removeData).remove();

    //   database.ref().delete(removeData).then(function() {
    //     console.log("Document successfully deleted!");
    // }).catch(function(error) {
    //     console.error("Error removing document: ", error);
    // });
    
    });

}); // Closes jQuery wrapper
