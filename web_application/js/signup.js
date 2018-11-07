
var submit_button = document.getElementById("submit_button");
//submit_button.onclick = function(){submitToAPI(event)};

function submitToAPI(event) {
    var URL = "https://oqyg995p43.execute-api.us-east-1.amazonaws.com/beta/contact-us";

       var firstName = $("#firstName").val();
       var lastName = $("#lastName").val();
       var email = $("#email").val();
       var tel = $("#tel").val();
       var address = $("#address").val();
       var address2 = $("#address2").val();
       var country = $("#country").val();
       var state = $("#state").val();
       var zip = $("#zip").val();
       var consumer = $("#consumer").val();
       var restaurant = $("#restaurant").val();
       var data = {
          firstName : firstName,
          lastName: lastName,
          email : email,
          tel : tel,
          address : address,
          address2 : address2,
          country : country,
          state : state,
          zip : zip,
          consumer : consumer,
          restaurant : restaurant
};

       $.ajax({
         type: "POST",
         url : URL,
         dataType: "json",
         crossDomain: "true",
         contentType: "application/json",
         data: JSON.stringify(data),


         success: function () {
           $("#submit_button").text("Data Sent!");
           $("#submit_button").attr("disabled", true);
         },
         error: function () {
           // show an error message
         }});
     }
