

// var firebaseConfig = {
//   apiKey: "AIzaSyACL7vD3at2aFbtj985_3wSphYvW-rIG3E",
//   authDomain: "membershipdb.firebaseapp.com",
//   databaseURL: "https://membershipdb.firebaseio.com",
//   projectId: "membershipdb",
//   storageBucket: "membershipdb.appspot.com",
//   messagingSenderId: "831601336894",
//   appId: "1:831601336894:web:6c82a92adaa5fff1"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

// // Firebase Database Reference and the child
// const dbRef = firebase.database().ref();
// const membersRef = dbRef.child('members');

// // Firebase Variables
// var auth = firebase.auth();


var app_fireBase = {};
var dbRef = {};
var membersRef = {};
(function() { 
  // Initialize Firebase
  // var config = {
  //   apiKey: "AIzaSyAon8MXKY0n6PPbf3-emYLRFuqUk9SUKyo",
  //   authDomain: "authtry-45433.firebaseapp.com",
  //   databaseURL: "https://authtry-45433.firebaseio.com",
  //   projectId: "authtry-45433",
  //   storageBucket: "",
  //   messagingSenderId: "933586310402"
  // };

  var firebaseConfig = {
    apiKey: "AIzaSyAon8MXKY0n6PPbf3-emYLRFuqUk9SUKyo",
    authDomain: "authtry-45433.firebaseapp.com",
    databaseURL: "https://authtry-45433.firebaseio.com",
    projectId: "authtry-45433",
    storageBucket: "authtry-45433.appspot.com",
    messagingSenderId: "933586310402",
    appId: "1:933586310402:web:6678a4f774bf3d1cbb5e1b"
  };
  firebase.initializeApp(firebaseConfig);

  app_fireBase = firebase;

   dbRef = app_fireBase.database().ref();
   membersRef = dbRef.child('members');


})()


readMembersData(); 
  

  function showHide(show, elemId) {
    var element = document.getElementById(elemId);
    if (show)
        // element.className += " w3-show";
        element.className = element.className.replace("w3-hide", "w3-show");

    else
        element.className = element.className.replace("w3-show", "w3-hide");
    }   
	

// --------------------------
// READ
// --------------------------
function readMembersData() {

	membersRef.on("value", snap => {

	

		snap.forEach(childSnap => {

	
 		});


	})

}



function userClicked(e) {


		var userID = e.target.getAttribute("user-key");

		const userRef = dbRef.child('users/' + userID);
		const userDetailUI = document.getElementById("user-detail");

		userRef.on("value", snap => {

			userDetailUI.innerHTML = ""

			snap.forEach(childSnap => {
				var $p = document.createElement("p");
				$p.innerHTML = childSnap.key  + " - " +  childSnap.val();
				userDetailUI.append($p);
			})

		});
	

}





// --------------------------
// ADD
// --------------------------

const addMemberBtnUI = document.getElementById("addMemberBtn");
addMemberBtnUI.addEventListener("click", addMemberClicked)



function addMemberClicked() {

	console.log("addMemberClicked");

	// const membersRef = dbRef.child('members');

	const addUserInputsUI = document.getElementsByClassName("user-input");

	var form = $('#memberform');

	var formData = form.serializeArray();

	var membership = new Membership($('#id01firstname').val(),
									$('#id01lastname').val(),
									$('#id01address1').val(),
									$('#id01address2').val(),
									$('#id01postcode').val(),
									$('#id01email').val(),
									$('#id01phone').val(),
									$('#id01mtype').val(),
									$('#id01endDate').val());

	console.log ("wrtie member to db:", JSON.stringify (membership));
 
	membersRef.push(membership, function () {
    console.log("data has been inserted");
});

}


var callbackAdded = function(snap) {
    
	console.log("callbackAdded");

	var row = snap.val();

	console.log("row from db:", snap.key);
	console.log("row from db:", row);

	//var dataRow = buildLicenseRow(snap.key, snap.val());
//	var license = new License(row.notValidBefore,row.notValidAfter ,snap.key,row.customer,row.serial, row.hcf,row.maintDate,row.state, row.version,row.s2s,row.wrm);

	//var table = $('#example').DataTable ();
	//table.rows.add([license]).draw();

};






// --------------------------
// DELETE
// --------------------------
function deleteButtonClicked(e) {

		e.stopPropagation();

		var userID = e.target.getAttribute("userid");

		const userRef = dbRef.child('users/' + userID);
		
		userRef.remove();

}


// --------------------------
// EDIT
// --------------------------
function editButtonClicked(e) {
	
	document.getElementById('edit-user-module').style.display = "block";

	//set user id to the hidden input field
	document.querySelector(".edit-userid").value = e.target.getAttribute("userid");

	const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));

	// set data to the user field
	const editUserInputsUI = document.querySelectorAll(".edit-user-input");


	userRef.on("value", snap => {

		for(var i = 0, len = editUserInputsUI.length; i < len; i++) {

			var key = editUserInputsUI[i].getAttribute("data-key");
					editUserInputsUI[i].value = snap.val()[key];
		}

	});




	const saveBtn = document.querySelector("#edit-user-btn");
	saveBtn.addEventListener("click", saveUserBtnClicked)
}


function saveUserBtnClicked(e) {
 
	const userID = document.querySelector(".edit-userid").value;
	const userRef = dbRef.child('users/' + userID);

	var editedUserObject = {}

	const editUserInputsUI = document.querySelectorAll(".edit-user-input");

	editUserInputsUI.forEach(function(textField) {
		let key = textField.getAttribute("data-key");
		let value = textField.value;
  		editedUserObject[textField.getAttribute("data-key")] = textField.value
	});



	userRef.update(editedUserObject);

	document.getElementById('edit-user-module').style.display = "none";


}