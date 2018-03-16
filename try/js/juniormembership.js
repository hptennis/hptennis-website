var sheet_url = "https://script.google.com/macros/s/AKfycbyPTZRYTSRvTS5A-3AY4ardvDbyjp4Rw1Z2ZJo9VY8h33XBYv1b/exec";

var newMembForm = $('#id01');
var existingMembForm = $('#id02');
var paymentForm = $('#id03');
var membershipDetails = $('#membershipDetails');


function detailsShow() {
    membershipDetails.css("display", "block");
    $('#details').css("visibility", "hidden");
    window.location.href='#membershipDetails';
}

function displaydefault() {
    detailsShow();
    newMembForm.css("display", "none");
    existingMembForm.css("display", "none");
    paymentForm.css("display", "none");
}


function displayNew(serial) {

    $('#id01-serial').val(serial);
    membershipDetails.css("display", "none");
    newMembForm.css("display", "block");
    $('#details').css("visibility", "visible");
    existingMembForm.css("display", "none");
    paymentForm.css("display", "none");
    window.location.href='#id01';
}

function displayExisting() {
    existingMembForm.css("display", "block");
    membershipDetails.css("display", "none");
    $('#details').css("visibility", "visible");
    newMembForm.css("display", "none");
    paymentForm.css("display", "none");
    window.location.href='#id02';
}
function displayParent() {
    newMembForm.css("display", "none");
    $('#id05Parent').css("display", "block");
}
function displayBTM() {
    $('#id05Parent').css("display", "none");
    $('#id06BTMNumber').css("display", "block");
}

function displayPaymentDetails() {
    $('#id06BTMNumber').css("display", "none");
    paymentForm.css("display", "block");
}


function copyPhoneNumber(){
    $('#id05emergencyPhone').val($('#id05phone').val() );
}


$("#btnFindMember").click(function (event) {

    event.preventDefault();
    if ($("#id02firstname").valid() & $('#id02lastname').valid()
        // & $('#jungle').valid()
        // & $('#id03membershiptype').valid()
    ) {

        var surname = $('#id02lastname').val();
        var name = $('#id02firstname').val();


        // alert ("surname: " +surname+ " name: " +name);

        // Fire off the request to sheets

        // newMembForm.css("cusror", "wait");
        $("body").toggleClass("wait");
        $.ajax({
            url: sheet_url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            type: "get", //send it through get method
            data: {
                ajaxid: 4,
                surname: surname,
                firstname: name
            },
            success: function (response, textStatus, jqXHR) {

                if (response == "not found") {
                    $("body").toggleClass("wait");
                    alert("Those names were not found please try again");
                }
                else {
                    // $('#id01-serial').val(response[1]);
                    console.log(response[2] + "-" + response[3]);
                    $('#id01firstname').val(response[2]);
                    $('#id01lastname').val(response[3]);
                    $('#id01address1').val(response[4]);
                    $('#id01address2').val(response[5]);
                    $('#id01postcode').val(response[6]);
                    $('#id01phone').val(response[7]);
                    $('#id01email').val(response[8]);
                    $("body").toggleClass("wait");
                    displayNew(response[1]);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("error:", textStatus);

                //Do Something to handle error
                // console.error(
                //     "The following error occurred: " +
                //     textStatus, errorThrown
                // );
            }
        });
    }

});

