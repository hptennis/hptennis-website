var newMembForm = $('#id01');
var existingMembForm = $('#id02');
var paymentForm = $('#id03');
var membershipDetails = $('#membershipDetails');


var sheet_url = "https://script.google.com/macros/s/AKfycby6wkVv9xbATIt8JVeZR71nYxnaKy3n60UJznWo5PYdPaTH2lmT/exec";

var echo_url = "http://192.168.1.16:7000/post";

var json_url = "https://script.googleusercontent.com/a/macros/hampdenparktennis.co.uk/echo?user_content_key=NyJ-xLERp5syHkQab-cD2BRZq_RpQvKLwPKvmlL3aPTmwMVs2j2Qmblxp1GXWHbZWATltTAd4olAsU9_z5N2QCL6P3dm-0TJOJmA1Yb3SEsKFZqtv3DaNYcMrmhZHmUMi80zadyHLKBNMQVoIY4u_HA_9DDdC3ckIgTKRbUcUWo1jL5rQSxcTigCYJ2iqUZiSPo39O4SX4Oidipr-HchWhxMycpYRm7bAO4ohdG-jPC_GoyoV3JYNgydwXvHOb5ik2J4XWNE-9bZQdMdYte0gq12BgTJOh8yesQjXkDBtZi_Ri_rd4DIlcWgYh8rvR6Cuw4XfZpQqeU&lib=MbpKbbfePtAVndrs259dhPT7ROjQYJ8yx";

var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1CB8LUatQhFCQ-j6SLTAqkJMSKYjncfedyXSYVMeWNho/edit?usp=sharing';


function validateId01() {
    $("#memberForm").validate;
    return $("#id01firstname").valid() &
        $("#id01lastname").valid()
        
        // & $("#id01address1").valid() 
        // & $("#id01address2").valid() 
        // & $("#id01postcode").valid() 
        // & $("#id01email").valid() 
        // & $("#id01phone").valid() 
        ;
}

function validateId03() {
    $("#memberForm").validate;
    
  
    return $("#id03membershiptype").valid() & 
            $("#id03paymenttype").valid() ;
}


function displayNext() {

    if (validateId01() == true) {
        newMembForm.css("display", "none");
        existingMembForm.css("display", "none");
        paymentForm.css("display", "block");
        window.location.href='#id03';
    }
}

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




/*$("#btnFindMember").click(function (event) {


    event.preventDefault();
    var surname = $('#id02-lastname').val();
    var name = $('#id02-firstname').val();
    
    // alert ("surname: " +surname+ " name: " +name);

    // Fire off the request to sheets

    // newMembForm.css("cusror", "wait");
    $("body").toggleClass("wait");
    $.ajax({
        url: sheet_url, //sheet_url_get,
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
            $('#myTextarea2').val(JSON.stringify(response));
            if (response == "not found") {
                $("body").toggleClass("wait");
                alert("Those names were not found please try again");
            }
            else {
                // $('#id01-serial').val(response[1]);
                $('id01firstname').val(response[2]);
                $('#id01lastname').val(response[3]);
                $('#id01address1').val(response[4]);
                $('#id01address2').val(response[5]);
                $('#id01postcode').val(response[6]);
                $('#id01phone').val(response[7]);
                $('#id01email').val(response[8]);
                $("body").toggleClass("wait");
                displayNew(response[1]);
            }



            console.log("Got something:", response);
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
});
*/


function init() {
    // Tabletop.init({
    //     key: publicSpreadsheetUrl,
    //     callback: showInfo,
    //     simpleSheet: true
    // })

    $.getJSON("http://cors.io/spreadsheets.google.com/feeds/list/1CB8LUatQhFCQ-j6SLTAqkJMSKYjncfedyXSYVMeWNho/od6/public/values?alt=json", function(data) {
        //first row "title" column
        console.log(data.feed.entry[0]['gsx$title']['$t']);
    });

    $.getJSON(json_url, function (data) {


        var j = JSON.stringify(data.Sheet1);
        console.log('data:' + j);
        //data = data;
        var items = [];
        var items2 = [];

        $("#membersTable > tbody").empty();

        var jdata = [{ "Timestamp": "2018-03-10T14:33:52.767Z", "serial": 1520692433079, "firstname": "Grant", "surname": "TF", "address1": "27 Decoy Drive", "address2": "Eastbourne", "postcode": "BN22 0AD", "phone": 7986240984, "email": "grant@tarrant-fisher.co.uk", "email_option": "yes", "membership_type": "adult", "payment_type": "online" }, { "Timestamp": "2018-03-10T16:07:55.337Z", "serial": 1520698075841, "firstname": "Hugh", "surname": "Ball", "address1": "12 the road", "address2": "EB", "postcode": "BN22", "phone": 1234, "email": "hugh@test.com", "email_option": "yes", "membership_type": "adult", "payment_type": "online" }, { "Timestamp": "2018-03-12T09:48:46.826Z", "serial": 1520848127130, "firstname": "Nigel", "surname": "Jones", "address1": "victoria drive", "address2": "undefined", "postcode": "undefined", "phone": "undefined", "email": "nig@test.com", "email_option": "undefined", "membership_type": "undefined", "payment_type": "undefined" }]
        $.each(data.Sheet1, function (key, val) {
            // console.log("key:"+key);
            //console.log("val:"+val);
            // added phone column to table
            $('#membersTable').append('<tr><td>' + val.firstname + '</td><td>' + val.surname + '</td><td>' + val.email + '</td><td>' + val.phone + '</td></tr>');

        });
        //     items.push("<li id='" + key + "'>" + val + "</li>");
        // });
        // $("<ul/>", {
        //     "class": "my-new-list",
        //     html: items.join("")
        // }).appendTo("body");


    })

}


window.addEventListener('DOMContentLoaded', init);

$("#btnSubmit").click(function (event) {

    if (validateId01() && validateId03()){

        var surname = $('#id01lastname').val();
        var name = $('#id01firstname').val();
        var serial = $('#id01-serial').val();
        var address1 = $('#id01address1').val();
        var address2 = $('#id01address2').val();
        var postcode = $('#id01postcode').val();
        var phone = $('#id01phone').val();
        var email = $('#id01email').val();
        var email_option = $('input[name=email-radio]').val();
        var membership_type = $('#id03membershiptype').val();
        var payment = $('#id03paymenttype').val();



        event.preventDefault();
        $("body").toggleClass("wait");
        $.ajax({
            url: sheet_url,
            type: "post", //send it through get method
            data: {
                ajaxid: 4,
                serial: serial,
                firstname: name,
                surname: surname,
                address1: address1,
                address2: address2,
                postcode: postcode,
                phone: phone,
                email: email,
                email_option: email_option,
                membership_type: membership_type,
                payment_type: payment
            },
            success: function (response, textStatus, jqXHR) {
                {

                    $("body").toggleClass("wait");
                    paymentForm.css("display", "block");
                    $("#memberForm")[0].reset();
                    displaydefault();
                    // alert ("success!");
                    // disaply modal
                    $('#id04-modal').css("display", "block");

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
    };

});




