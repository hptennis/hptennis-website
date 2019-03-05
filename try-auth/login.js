var clicked;
    var validator = $("form[name='loginFrm']").validate({
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


    var validator = $("form[name='resetFrm']").validate({
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
        },
        // Specify validation error messages
        messages: {
            email: "Please enter a valid email address",
            //devGrp: "Please select one or more Device Groups",
           
        },
        // Make sure the form is submitted to the destination defined
        // in the "action" attribute of the form when valid
        submitHandler: function(form) {
            
            event.preventDefault();

            var email = $("#email").val();
    
           reset(email);
    
            
        }
        });



function login(){

    event.preventDefault();
    
    var email=document.getElementsByName("email")[0].value
    var password=document.getElementsByName("pwd")[0].value

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
                window.location.href = "login.html";

              }).catch(function(error) {
                // An error happened.
                console.log("an error has occured sending reset email");
              });
              
        }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "main.html";
        } else {
           
        }
      });

