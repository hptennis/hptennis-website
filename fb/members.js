

var dbRef
var membersRef
var count = 0;


var callbackAdded = function(snap) {
    
	// console.log("callbackAdded");

	var row = snap.val();
	row.key = snap.key

	// console.log("row from db:", snap.key);
	// console.log("row from db:", row);
	row.key = snap.key
	// console.log("row from db:", row);
	var table = $('#example').DataTable();
	
	// table.row.add(row).draw();
	table.row.add(row);

	


	//var dataRow = buildLicenseRow(snap.key, snap.val());
	// var license = new License(row.notValidBefore,row.notValidAfter ,snap.key,row.customer,row.serial, row.hcf,row.maintDate,row.state, row.version,row.s2s,row.wrm);

	//  var table = $('#example').DataTable ();
	//  table.rows.add([row]).draw();

};

var callbackChanged = function(snap) {
	console.log("callbackChanged");
	
	// var dataRow = buildLicenseRow(snap.key, snap.val());
	// var table = $('#example').DataTable ();
	// table.draw();
	// location.reload();
	// table.rows.add([dataRow]).draw();

};

function firebase_init(){

try {
            
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyACL7vD3at2aFbtj985_3wSphYvW-rIG3E",
        authDomain: "membershipdb.firebaseapp.com",
        databaseURL: "https://membershipdb.firebaseio.com",
        projectId: "membershipdb",
        storageBucket: "membershipdb.appspot.com",
        messagingSenderId: "831601336894",
        appId: "1:831601336894:web:6c82a92adaa5fff1"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    // firebase.analytics();

	var database = firebase.database();

    dbRef = firebase.database().ref();
	membersRef = dbRef.child('members');

	firebase.database().ref('/members/').once('value').then(function(snapshot) {

		  snapshot.forEach(function(doc){
			  console.log(doc.val())
			  var row = doc.val();
			  row.key = doc.key
			  var table = $('#example').DataTable();
	
			  // table.row.add(row).draw();
			  table.row.add(row);

			
		   });
		
		   table.draw();
		   membersRef.on('child_added', callbackAdded);
    	   membersRef.on('child_changed', callbackChanged);
	});

	// database.collection("members")
    // .get()
    // .then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // })
    // .catch(function(error) {
    //     console.log("Error getting documents: ", error);
    // });


	
	// membersRef.on('child_added', callbackAdded);
    // membersRef.on('child_changed', callbackChanged);

    // readMembersData();


//   let app = firebase.app();
//   let features = ['auth', 'database', 'messaging', 'storage'].filter(feature => typeof app[feature] === 'function');
//   document.getElementById('load').innerHTML = `Firebase SDK loaded with ${features.join(', ')}`;

    
} catch (e) {
  console.error("firebase load error",e);
//   document.getElementById('load').innerHTML = 'Error loading the Firebase SDK, check the console.';
}

}

  
function writeEntry(key, data)
{
	
	firebase.database().ref('members/' +key).set({
		data
	  }, function(error) {
		if (error) {
		 return "update failed";

		} else {
		 return "ok";
		  
		}
	  });
}

// readMembersData(); 
  

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

	console.log("readMembersData");
	membersRef.on("value", snap => {

	 	console.log("got value");
	 	

		 var row = snap.val();
		 
		 snap.forEach(childSnap => {

			let key = childSnap.key,
			value = childSnap.val();
			
  			
		 });
		 

    //     console.log("row from db:", snap.key);
    //     console.log("row from db:", row);

    //     //var dataRow = buildLicenseRow(snap.key, snap.val());
    //     // var license = new License(row.notValidBefore,row.notValidAfter ,snap.key,row.customer,row.serial, row.hcf,row.maintDate,row.state, row.version,row.s2s,row.wrm);
	// 	var member = new Membership(row.firstName,row.lastName);
    //     var table = $('#example').DataTable ();
    //     table.rows.add([member]).draw();

	

		// snap.forEach(childSnap => {

	
 		// });


	 });

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

// const addMemberBtnUI = document.getElementById("addMemberBtn");
// addMemberBtnUI.addEventListener("click", addMemberClicked)



function tempAddMemberBtn()
{
	console.log("tempAddMemberBtn");
	// gtf = {"2019-03-29T17:30:47.927Z","1104","Grant,Tarrant-Fisher","27 Decoy Drive","","BN22 0AD","07986-240984","grant@tarrant-fisher.co.uk","yes","adult","online",null}
	var x = {
		"id": "3",
		"name": "Ashton Cox",
		"position": "Junior Technical Author",
		"salary": "$86,000",
		"start_date": "2009/01/12",
		"office": "San Francisco",
		"extn": "1562"
	  };

	var table2 = $('#example2').DataTable();  
	var d  = table2.data();
    console.log( 'There are'+d.length+' row(s) of data in this table' ); 

	// d.push(x);
	//table2.row.add(x).draw();

	var rowInd = -1;
	for(var i = 0; i < d.length; i++) {
		if (d[i].id == '3') {
			rowInd = i;
			break;
		}
	}

	if (rowInd >0) {
		d[rowInd].name = "Fred";
		table2.rows().invalidate();
	}
	else
	{
		table2.row.add(x).draw();	
	}

    console.log( 'There are'+table2.data().length+' row(s) of data in this table' ); 


	// var t = $('#example2').DataTable();
	// t.draw( true );
	// location.reload();
	// Invalidate all rows and redraw
	// table2.rows().invalidate().draw();

}

function importData()
{
	alert ("importData")
	var myList;
	$.getJSON('members-20200419.json')
		.done(function (data) {
		myList = data;

		myList.forEach(importItem);



	});

}

function importItem(item, index)
{
	writeMemberData(item)

}

function writeMemberData(data) {
    // alert ("send to firebase");
    // firebase.database().ref('licenses/' + key).set({
        //str = str.replace(/-/g, ' ');
    // A post entry.
    
    console.log("writeMemberData", JSON.stringify(data))
	// Get a key for a new Post.
	
	var newMemberKey = dbRef.child('members').push().key;
	

	// db.collection("members").add({
	// 	data
	// })
	// .then(function(docRef) {
	// 	console.log("Document written with ID: ", docRef.id);
	// })
	// .catch(function(error) {
	// 	console.error("Error adding document: ", error);
	// });

    dbRef.child('members/' + newMemberKey).update({
		timestamp: data.timestamp,
		serial: data.serial,
		firstname: data.firstname,
		surname: data.surname,
		address1: data.address1,
		address2: data.address2,
		postcode: data.postcode,
		phone: data.phone,
		email: data.email,
		emailoption: data.emailoption,
		membershiptype: data.membershiptype,
		paymenttype: data.paymenttype,
		trailEndDate: data.trailEndDate
   	}).then(function(docRef) {
		console.log("Document written");
	})
	.catch(function(error) {
		console.error("Error adding document: ", error);
	});
}



function addMemberToFB(member) {

	console.log("addMemberToFB");

	

	const timestamp = firebase.firestore.FieldValue.serverTimestamp();
	member.updateTime(timestamp)

	console.log ("wrtie member to db:", JSON.stringify (member));
 
	membersRef.push(membership, function () {
    console.log("data has been inserted");
});

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