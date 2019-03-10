
var app_fireBase = {};
(function() { 
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCWcUsVds1qGFrj-o0VvrFtQFOtd4wgoY8",
    authDomain: "jnrauth.firebaseapp.com",
    databaseURL: "https://jnrauth.firebaseio.com",
    projectId: "jnrauth",
    storageBucket: "jnrauth.appspot.com",
    messagingSenderId: "320548118229"
  };
  firebase.initializeApp(config);

  app_fireBase = firebase;
})()