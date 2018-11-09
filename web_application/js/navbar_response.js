/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function navbar_response() {
    var x = document.getElementById("topnav");
    if (x.className === "site-header sticky-top py-1") {
        x.className = "site-header sticky-top responsive py-1";
    } else {
        x.className = "site-header sticky-top py-1";
    }
    var y = document.getElementById("bootstrap-format");
    if (y.className === "container d-flex flex-md-row justify-content-between") {
        y.className = "container";
    } else {
        y.className = "container d-flex flex-md-row justify-content-between";
    }

}
