// 


// var firebaseConfig = {
//   apiKey: "AIzaSyACL7vD3at2aFbtj985_3wSphYvW-rIG3E",
//   authDomain: "membershipdb.firebaseapp.com",
//   databaseURL: "https://membershipdb.firebaseio.com",
//   projectId: "membershipdb",
//   storageBucket: "membershipdb.appspot.com",
//   messagingSenderId: "831601336894",
//   appId: "1:831601336894:web:6c82a92adaa5fff1"
//};


var firebaseConfig = {
	apiKey: "AIzaSyAon8MXKY0n6PPbf3-emYLRFuqUk9SUKyo",
	authDomain: "authtry-45433.firebaseapp.com",
	databaseURL: "https://authtry-45433.firebaseio.com",
	projectId: "authtry-45433",
	storageBucket: "authtry-45433.appspot.com",
	messagingSenderId: "933586310402",
	appId: "1:933586310402:web:6678a4f774bf3d1cbb5e1b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');

// Firebase Variables
var auth = firebase.auth();


  readUserData(); 
  

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
function readUserData() {

	const userListUI = document.getElementById("user-list");

	usersRef.on("value", snap => {

		userListUI.innerHTML = ""

		snap.forEach(childSnap => {

			let key = childSnap.key,
				value = childSnap.val()
  			
			let $li = document.createElement("li");

			// edit icon
			let editIconUI = document.createElement("span");
			editIconUI.class = "edit-user";
			editIconUI.innerHTML = " ✎";
			editIconUI.setAttribute("userid", key);
			editIconUI.addEventListener("click", editButtonClicked)

			// delete icon
			let deleteIconUI = document.createElement("span");
			deleteIconUI.class = "delete-user";
			deleteIconUI.innerHTML = " ☓";
			deleteIconUI.setAttribute("userid", key);
			deleteIconUI.addEventListener("click", deleteButtonClicked)
			
			$li.innerHTML = value.name;
			$li.append(editIconUI);
			$li.append(deleteIconUI);

			$li.setAttribute("user-key", key);
			$li.addEventListener("click", userClicked)
			userListUI.append($li);

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

const addUserBtnUI = document.getElementById("add-user-btn");
addUserBtnUI.addEventListener("click", addUserBtnClicked)



function addUserBtnClicked() {

	const usersRef = dbRef.child('users');

	const addUserInputsUI = document.getElementsByClassName("user-input");

 	// this object will hold the new user information
    let newUser = {};

    // loop through View to get the data for the model 
    for (let i = 0, len = addUserInputsUI.length; i < len; i++) {

        let key = addUserInputsUI[i].getAttribute('data-key');
        let value = addUserInputsUI[i].value;
        newUser[key] = value;
    }

	usersRef.push(newUser)

    
  //  console.log(myPro)
   


}


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