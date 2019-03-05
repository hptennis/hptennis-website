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

                    var user = firebase.auth().currentUser;
                    if (user.email!==response[8])
                    {
                        alert ("Members email address does not match signed in email - is this correct?")
                    }

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