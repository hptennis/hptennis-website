var sheet_url = "https://script.google.com/macros/s/AKfycbyPTZRYTSRvTS5A-3AY4ardvDbyjp4Rw1Z2ZJo9VY8h33XBYv1b/exec";


var newMembForm = $('#newMember');
var existingMembForm = $('#id02');
var paymentPanel = $('#payment');
var membershipDetails = $('#membershipDetails');
var divMain = $('#divMain');
var divLogin = $('#divLogin');
var divSignedIn = $('#signedIn');
var divSignedOut = $('#signedOut');

$( document ).ready(function() {
   
    
});

var showExisting=false;


function detailsShow() {
    membershipDetails.css("display", "block");
    $('#details').css("visibility", "hidden");
    window.location.href = '#membershipDetails';
}

function membershipRenewalBtn()
{

    var user = firebase.auth().currentUser;
    showExisting=true;
    if (user) {
        displayExisting();
        } else {
            displayLogin();
        }

    loginEnabled=true;
    //window.location.href='jnrlogin.html';
   
}


function displayLogin() 
{
    newMembForm.css("display", "none");
    divMain.css("display", "none");
    divLogin.css("display", "block");
}

function displayNew(serial) {

    if (serial === -1)
    {
        $("#jnrMemberForm")[0].reset();
    }
    $('#id01serial').val(serial);
    membershipDetails.css("display", "none");
    newMembForm.css("display", "block");
    $('#details').css("visibility", "visible");
    existingMembForm.css("display", "none");
    paymentPanel.css("display", "none");
    window.location.href = '#id01';
}

function displaydefault()
{
    divMain.css("display", "block");
    newMembForm.css("display", "none");
    existingMembForm.css("display", "none");
    membershipDetails.css("display", "block");
}

function displayExisting() {
    existingMembForm.css("display", "block");
    $('#findMember')[0].reset();
    membershipDetails.css("display", "none");
    $('#details').css("visibility", "visible");
    newMembForm.css("display", "none");
    paymentPanel.css("display", "none");
    window.location.href = '#id02';
}
function displayParent() {
    if (validateId01()) {
        newMembForm.css("display", "none");
        $('#id05Parent').css("display", "block");
    }
}
function displayBTM() {
    if (validateParent()) {
        $('#id05Parent').css("display", "none");
        $('#id06BTMNumber').css("display", "block");
    }
}

function displayPaymentDetails() {
    $('#id06BTMNumber').css("display", "none");
    paymentPanel.css("display", "block");
}


function copyPhoneNumber() {
    $('#id05emergencyPhone').val($('#id05phone').val());
}

function validateId01() {
    $("#jnrMemberForm").validate;
    return $("#id01firstname").valid() &
        $("#id01lastname").valid() &
        $("#id01dob").valid() &
        $("#id01address1").valid() &
        $("#id01address2").valid() &
        $("#id01postcode").valid() &
        $("#id01email").valid() &
        $("#id01phone").valid();
}

function validateParent() {
    $("#jnrMemberForm").validate;

    var val1 =  $("#id05pgDeclaration").valid();
    var val2 =  $("#id05pgPhotoAgree").valid();
    return $("#id05ParentorGuard").valid() &
        $("#id05phone").valid() &
        $("#id05emergencyPhone").valid() &
        $("#id05pgEmail").valid() &
        $("#id05pgMedical").valid() &
        $("#id05pgDeclaration").valid() &
        $("#id05pgPhotoAgree").valid();
}


$("#btnSubmit").click(function (event) {

    event.preventDefault();
    $("#jnrMemberForm").validate;
    // var v = $("#id01firstname").valid();
    // var v1 = $('#id03paymenttype').valid();
    var v2 = $('#id03membershiptype').valid();
    if (validateId01() & validateParent() &
        $('#id03paymenttype').valid() & v2
       ) {

        var surname = $('#id01lastname').val();
        var name = $('#id01firstname').val();
        var serial = $('#id01serial').val();
        var dob = $('#id01dob').val();
        var address1 = $('#id01address1').val();
        var address2 = $('#id01address2').val();
        var postcode = $('#id01postcode').val();
        var phone = $('#id01phone').val();
        var email = $('#id01email').val();
        var parentGuard = $('#id05ParentorGuard').val();
        var pgPhone = $('#id05phone').val();
        var pgEmergencyPhone = $('#id05emergencyPhone').val();
        var pgEmail = $('#id05pgEmail').val();
        var medical = $('#id05pgMedical').val();
        var declaration = $('#id05pgDeclaration').is(':checked') ? 'agree' : 'disagree';
        var photoConsent = $('#id05pgPhotoAgree').val();
        var membershipType = $('#id03membershiptype').val();
        var paymentType = $('#id03paymenttype').val();

        event.preventDefault();
        $("body").toggleClass("wait");
        $.ajax({
            url: sheet_url,
            type: "post", //send it through post method
            data: {
                ajaxid: 4,
                serial: serial,
                FirstName: name,
                Surname: surname,
                DateOfBirth: dob,
                Address1: address1,
                Address2: address2,
                Postcode: postcode,
                PhoneNumber: phone,
                EmailAddress: email,
                ParentorGuardianName: parentGuard,
                ParentorGuardianPhonenumber: pgPhone,
                EmergencyContactNumber: pgEmergencyPhone,
                PGEmailAddress: pgEmail,
                MedicalOrOtherSpecialConditions: medical,
                ParentGuardianDeclaration: declaration,
                PHOTOGRAPHYCONSENT: photoConsent,
                MembershipType: membershipType,
                PaymentType: paymentType
            },
            success: function (response, textStatus, jqXHR) {
                {

                    $("body").toggleClass("wait");
                    paymentPanel.css("display", "none");
                    $("#jnrMemberForm")[0].reset();
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
    // };

});

$("#addSibling").click(function (event) {
    event.preventDefault();

    displayExisting();

});

$( document ).ready(function() {
    displaydefault();
});


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
                    $('#id01dob').val(response[4].slice(0, 10));
                    $('#id01address1').val(response[5]);
                    $('#id01address2').val(response[6]);
                    $('#id01postcode').val(response[7]);
                    $('#id01phone').val(response[8]);
                    $('#id01email').val(response[9]);
                    $('#id05ParentorGuard').val(response[10]);
                    $('#id05phone').val(response[11]);
                    $('#id05emergencyPhone').val(response[12]);
                    $('#id05pgEmail').val(response[13]);
                    $('#id05pgMedical').val(response[14]);




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


var validator = $("form[name='jnrloginFrm']").validate({
    //   debug: true,
     rules: {
    // The key name on the left side is the name attribute
    // of an input field. Validation rules are defined
    // on the right side

    //devGrp: "required",
    email: {
      required: true,
      email: true
    },
    pwd:  { required: true, 
       
        minlength: 6
    },  
    },
    // Specify validation error messages
    messages: {
        email: "Please enter a valid email address",
        //devGrp: "Please select one or more Device Groups",
       
        
        pwd: "Please a password with at leat 6 characters",
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
        
        event.preventDefault();

        if (clicked==="login")
           login();
        else if (clicked==="signup")
            signUp();
        else
            alert ("Error should not get here");

        
    }
    });

    function login(){

        event.preventDefault();
        
        var email=document.getElementsByName("email")[0].value;
        var password=document.getElementsByName("pwd")[0].value;
    
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log ("errorCode:", errorCode);
            console.log("errorMessage:", errorMessage);
    
            alert (errorMessage);
          });
    
    
    
        }
    
        function signUp(){
    
            event.preventDefault();
            
            var email=document.getElementsByName("email")[0].value
            var password=document.getElementsByName("pwd")[0].value
        
            firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log ("errorCode:", errorCode);
                console.log("errorMessage:", errorMessage);
              });
        
        
        
            }
    
            function reset(emailAddress)
            {
                var auth = firebase.auth();
                auth.sendPasswordResetEmail(emailAddress).then(function() {
                    alert ("Please check your email for a reset link");
                    displayLogin();
                   
    
                  }).catch(function(error) {
                    // An error happened.
                    console.log("an error has occured sending reset email");
                  });
                  
            }

            firebase.auth().onAuthStateChanged(function(user) {
                console.log("auth changed :", user);
                if (user) {

                    // showHide(false, "signedOut");
                    // showHide(true, "signedIn");

                    // divSignedOut.css("visibility", "none");
                    // divSignedIn.css("visibility", "block");
                    var template = $('#template').html();
                    Mustache.parse(template);
                    var rendered = Mustache.render(template, {email: user.email});
                    $('#userEmail').html(rendered);
                   signOutShow();

                    divLogin.css("display", "none");
                    if (showExisting)
                    {
                        displayExisting();
                        showExisting=false;
                    }
                    else
                    {
                        
                        displaydefault();
                    }
                } else {
                    
                    
                    // divSignedIn.css("visibility", "none");
                    // divSignedOut.css("visibility", "block");
                    signInShow();
                    displaydefault();
                }
              });

            //   function showHide(show, elemId) {
            //     var element = document.getElementById(elemId);
            //     if (show)
            //         // element.className += " w3-show";
            //         element.className = element.className.replace("w3-hide", "w3-show");
        
            //     else
            //         element.className = element.className.replace("w3-show", "w3-hide");
            //     } 
                
                function signOut() {
                    // Sign out of Firebase.
                    firebase.auth().signOut().then(function() {
                        console.log('Signed Out');
                        displaydefault();
                        //signedOut();
                      }, function(error) {
                        console.error('Sign Out Error', error);
                      });
                    }  
                 $("#signOut").bind("click",signOut);
                    
                $("#signIn").bind("click",signIn);
            
                
                function signIn() {
                        // Sign into Firebase using popup auth & Google as the identity provider.
                        // var provider = new firebase.auth.GoogleAuthProvider();
                        // firebase.auth().signInWithPopup(provider);
                        displayLogin();

                    }

                    function signInShow(){
                        $("#signIn").show();
                        $("#signOut").hide();
                    }
                    
                    function signOutShow(){
                        $("#signOut").show();
                        $("#signIn").hide();
                    }

