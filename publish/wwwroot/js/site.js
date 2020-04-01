// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(document).ready(function () {
    if ($('#pass').length) {
        $("#pass").keyup(function() {
            check_pass();
        });
    };

    Game.Reversi.buildBoard();
});

function check_pass() {
    var val = document.getElementById("pass").value;
    var meter = document.getElementById("meter");
    var no = 0;
    if (val != "") {
        // If the password length is less than or equal to 6
        if (val.length <= 12) no = 1;

        // If the password length is greater than 6 and contain any lowercase alphabet or any number or any special character
        if (val.length > 12 && (val.match(/[a-z]/) || val.match(/\d+/) || val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/))) no = 2;

        // If the password length is greater than 6 and contain alphabet,number,special character respectively
        if (val.length > 12 && ((val.match(/[a-z]/) && val.match(/\d+/)) || (val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) || (val.match(/[a-z]/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)))) no = 3;

        // If the password length is greater than 6 and must contain alphabets,numbers and special characters
        if (val.length > 12 && val.match(/[a-z]/) && val.match(/\d+/) && val.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/)) no = 4;

        if (no == 1) {
            $("#meter").animate({ width: '50px' }, 300);
            meter.style.backgroundColor = "red";
            document.getElementById("pass_type").innerHTML = "Very Weak";
        }

        if (no == 2) {
            $("#meter").animate({ width: '100px' }, 300);
            meter.style.backgroundColor = "#F5BCA9";
            document.getElementById("pass_type").innerHTML = "Weak";
        }

        if (no == 3) {
            $("#meter").animate({ width: '150px' }, 300);
            meter.style.backgroundColor = "#FF8000";
            document.getElementById("pass_type").innerHTML = "Good";
        }

        if (no == 4) {
            $("#meter").animate({ width: '200px' }, 300);
            meter.style.backgroundColor = "#00FF40";
            document.getElementById("pass_type").innerHTML = "Strong";
        }
    }

    else {
        meter.style.backgroundColor = "white";
        document.getElementById("pass_type").innerHTML = "";
    }
}