window.onload = function () { 
    var user = firebase.auth().currentUser;
    console.log(user);
 }

 function signOut()
 {
    firebase.auth().signOut();
 }

 firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        
    } else {
        window.location = "login.html"
    }
  });

