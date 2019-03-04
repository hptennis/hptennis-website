function submitLogin(){

    event.preventDefault();
    
    var email=document.getElementsByName("email")[0].value
    var password=document.getElementsByName("pwd")[0].value

    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log ("errorCode:", errorCode);
        console.log("errorMessage:", errorMessage);
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

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.location.href = "main.html";
        } else {
           
        }
      });

