
var submit_button = document.getElementById("submit_button");
submit_button.onclick = function(){if(validate_fields(event)){submitToAPI(event)}else{$("#submit_button").text("Please fix info formatting!")}};

function validate_fields() {
    'use strict';
    var validated = true;
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      if (form.checkValidity() === false) {
          validated = false;
      }
      form.classList.add('was-validated');
    });
    return validated;
}

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
