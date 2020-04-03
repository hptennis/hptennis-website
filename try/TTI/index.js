

jQuery.validator.addMethod("serialCheck", function(value, element) {
    console.log("serialcheck");
    var isUpdate = $("#isUpdate").val();
    console.log("isUpdate", isUpdate);
    if (isUpdate==="true")
        res=true;
    else if (serialArr.includes(value)) 
        res = false;
    else
        res=true;

    console.log("serialcheck res:", res);

    //res =  parseFloat(value) > 1000
    return this.optional(element) || (res);
}, "Please enter a 4 digit unique serial number");


jQuery.validator.addMethod("serialCheck2", function(value, element) {
    console.log("serial check");
    // allow any non-whitespace characters as the host part
    return this.optional( element ) || false;
  }, 'Please enter a valid an unused serial number.');


var validator = $("form[name='registerFrm']").validate({
    //   debug: true,
     rules: {
    // The key name on the left side is the name attribute
    // of an input field. Validation rules are defined
    // on the right side

    //devGrp: "required",
    versionSelect: "required",
    key:  { required: false,
            minlength: 5,
            licenseKey: false
    },
    customer: "required",  
    serial:  { required: true, 
        serialCheck : true ,
     //   serialCheck: true
        minlength: 4
    },  
    maintDate: "required",
    hcfSelect: "required",
  
    },
    // Specify validation error messages
    messages: {
        versionSelect: "Please select a version for this license",
        //devGrp: "Please select one or more Device Groups",
        key: {
            required: "Please enter a 24 digit license key",
            minlength: "The key must consist of 29 characters"
        },
        
        customer: "Please select a customer name",
        serial:  {
            required: "Please a 4 digit serial number",
            minlength: "The key must consist of 4 characters"
        },
        maintDate: "Please enter a maintenance date",
        hcfSelect: "Please select one or more HCF option"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
        // alert("submit handler");
        event.preventDefault();

        var form = $('#registerFrm');

        var data = form.serializeArray();
        console.log("license Submit form data:" , data);
        console.log("#notValidBefore", $('#notValidBefore').val());
        console.log("#notValidAfter", $('#notValidAfter').val());

        var license = new License($('#notValidBefore').val(),$('#notValidAfter').val(),$('#key').val(),$('#customer').val(),$('#serial').val(), $('#hcfSelect').val(),$('#maintDate').val(),$('#state').val(), $('#versionSelect').val(),$('#s2s').prop('checked'),$('#wrm').prop('checked'));

        if ($('#borrowed').prop('checked'))
        {
            license.setBorrowed($('#loanNotValidBefore').val(),$('#loanNotValidAfter').val());
        }
        else
        {
            license.borrowed=false
        }


        console.log ("license in JSON:", JSON.stringify(license));
        

        form[0].reset();

        // writeRegisterDate(key,customer, serial, version,s2s, wrm,  hcf, maintDate);
        writeRegisterDate(license);

        document.getElementById('id01').style.display='none'; 

        
    }

     
});

var serialArr = [];

function dateFormat(dateStr, formatStr){

    return moment(dateStr).format(formatStr)

}



function getSecondsSinceEpoch() {
    var d = new Date();
    var seconds = Math.round(d.getTime() / 1000);   
    return seconds
}


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
   
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;

}

function getKey() {
  var key =makeid();
  key =key+"-";
  key =key+getSecondsSinceEpoch();
  key =key+"-";
  key =key+makeid();
  return key
}

function writeRegisterDate(license) {
    // alert ("send to firebase");
    // firebase.database().ref('licenses/' + key).set({
        //str = str.replace(/-/g, ' ');


    firebase.database().ref('licenses/' +license.key).set({
       notValidBefore: license.notValidBefore,
       notValidAfter: license.notValidAfter,
       customer: license.customer,
       serial: license.serial,
       state: license.state,
       version: license.version,
       s2s: license.s2s,
       wrm: license.wrm,
       hcf: license.hcf,
       maintDate : license.maintDate,
       borrowed  : license.borrowed
    });

};



function loadHcf()
{
    $('#hcfSelect').select2();

    $.get("./hcf.lis", function(data, status){
        // alert("Data: " + data + "\nStatus: " + status);
        //console.log("device groupdss data:",data);
        var vals = [];
        vals = data.split("\n");
        //$("#hcfSelect2").empty();
        $.each(vals, function(index, value) {

            var data = {
                id: value,
                text: value
            }

            var newOption = new Option(data.text, data.id, false, false);
            $('#hcfSelect').append(newOption).trigger('change');
             
        });
    });

    /*
    $('#hcfSelect2').select2({
        ajax: {
          url: './hcf.lis',
          processResults: function (data) {
            // Tranforms the top-level key of the response object from 'items' to 'results'
            var vals = [];
            vals = data.split("\n");
            return {
                results: $.map(vals, function (item) {
                  
                    return {
                        text: item,
                        id: item
                    }
                })
            };
          }
        }
      });
      */

     /*$('#hcfSelect2').select2({
        ajax: {
          url: './hcf.lis',
          processResults: function (data) {
            
            var list = data.split("\n");
            return {list};
            return {
                results: $.map(list, function (item) {
                    console.log(item);
                    return { item
                        
                    }
                })
            };
        }
        }
      });
      */
}



function loadVersion()
{

    $.getJSON( "./versions.json", function( data ) {

 
        for(var i = 0; i < data.versions.length; i++) {
            var version = data.versions[i];
            let option = document.createElement("option");
            let optText = document.createTextNode(version.text);
            option.appendChild(optText);
            // option.value=version.id;
            // option.text=version.text;
           $('#versionSelect')[0].appendChild(option);
        }
        
    });
  
       
}


$("#deactivateBtn").click( function()
{
    $("#state").val("Created");


});

$("#loanBtn").click( function()
{
    
    event.preventDefault();
   
    // var loanDiv = document.getElementById("loan");
    toggleShowHide("loan");
    if (isLoanHidden)
    {
        $('#borrowed').prop('checked', "");
    }
    else
    {
    var dateStr = moment().format('DD-MM-YYYY HH:mm');

    var endLoan = moment().add(4, 'weeks').format('DD-MM-YYYY HH:mm');

    $('#loanNotValidBefore').val(dateStr);
    $('#loanNotValidAfter').val(endLoan);
    }
 
});

function isLoanHidden()
{
    var element = document.getElementById("loan");
    if (element.className.indexOf("w3-show") == -1)
        return true
    else
        return false

}

function toggleShowHide(id) {
    var element = document.getElementById(id);
    if (element.className.indexOf("w3-show") == -1) {
        element.className += " w3-show";
    } else { 
        element.className = element.className.replace(" w3-show", "");

    }
  }


function showLicenseModal(isUpdate, license)
{
    console.log("showLicenseModal");

    

    showHide(!isUpdate, "createBtnRow");
    showHide(isUpdate, "updateBtnRow");

    // ensure loan is hidden
    showHide(false, "loan" );
   
   
   
    document.getElementById('id01').style.display='block'; 
    $('#hcfSelect').select2();
    var form = $('#registerFrm');
    form[0].reset();
    validator.resetForm();

    enableDateTimePickers();


    if (isUpdate)
    {
        $("#key").val(license.key);
        $("#customer").val(license.customer);
        $("#notValidBefore").val(dateFormat(license.notValidBefore,'DD-MM-YYYY'));
        $("#notValidAfter").val(dateFormat(license.notValidAfter, 'DD-MM-YYYY'));
        $("#state").val(license.state);
        $("#serial").val(license.serial);
        $("#version").val(license.version);
        $('#s2s').prop('checked', license.s2s);
        $("#wrm").prop('checked',license.wrm);
        $("#maintDate").val(dateFormat(license.maintDate, 'DD-MM-YYYY'));
        $("#versionSelect").val(license.version);
        $('#hcfSelect').val(license.hcf);
        $('#hcfSelect').trigger('change');

        $('#serial').prop('readonly', true);
        $("#isUpdate").val("true");
       
        }
        else
        {

            // jQuery('#notValidBefore').datetimepicker();
    
            var key = getKey();
            // var today = moment().format('DD-MM-YYYY');
            // $('#notValidBefore').val(today) ;
                var dateStr = moment().format('DD-MM-YYYY');
                var enddateStr = moment().add(5, 'years').format('DD-MM-YYYY');
                var maintDateStr = moment().add(1, 'years').format('DD-MM-YYYY');
              
                $('#notValidBefore').val(dateStr);
                $('#notValidAfter').val(enddateStr);
                $('#maintDate').val(maintDateStr);

            $('#state').val("Created");
            $('#key').val(key);
            // clear version selector todo check needed
            $('#versionSelect').val("standard").trigger('change');

            $("#isUpdate").val("false");
        }

    function enableDateTimePickers() {
        jQuery('#notValidBefore').datetimepicker({
            timepicker:false,
            format: 'd-m-Y'
        });
        jQuery('#notValidAfter').datetimepicker({
            timepicker:false,
            format: 'd-m-Y',
        });
        jQuery('#maintDate').datetimepicker({
            timepicker:false,
            format: 'd-m-Y',
        });
        jQuery('#loanNotValidBefore').datetimepicker({
            timepicker:false,
            format: 'd-m-Y',
        });
        jQuery('#loanNotValidAfter').datetimepicker({
            timepicker:false,
            format: 'd-m-Y',
        });
    }
}

$.validator.addMethod("licenseKey", function(value, element){
return this.optional(element) || isLicenseKey(value);
},  "Please enter a correct license key");

function isLicenseKey(value)
{
    
    //var x =/^#([A-Fa-f0-9]{6}/.test( value );
    var x = value.match("^[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}-[A-Fa-f0-9]{4}$");

    // alert (value + " validation ste is: " + x);
    
    return x;
}

$("#deleteBtn").click( function()
{

    event.preventDefault();
    var key = $("#key").val();
    var serial =  $("#serial").val();

    var mytable = $('#example').DataTable();
    var row  = mytable.row('.selected');

    

    console.log("got table");

    
    var conf = confirm("Confirm you wish to delete the entry for key:" +key);
    if (conf){
        row.remove().draw( false );
        var index = serialArr.indexOf(serial);
        if (index > -1) {
            serialArr.splice(index, 1);
        }
        
        deleteEntry(key);
        document.getElementById('id01').style.display='none';
        // row.remove().draw(true);
    };
});

function deleteEntry(key){
    console.log("deleting:" +key);
    var ref = firebase.database().ref('licenses/' + key);
    ref.once('value', function (snapshot) {
        if (snapshot === null) {
            console.log("does not exist")
        } else {
         snapshot.ref.remove();
        //  $('#example').DataTable().ajax.reload();
         console.log("removed")
        //  row.remove().draw(false);
        }
    });
}

function writeRegisterData(key, customer, serial, hcfs, date) {
    firebase.database().ref('licenses/' + key).set({
       customer: customer,
       serial: serial,
       hcf: hcfs,
       maintDate : date
})
};

function tryClick (){
    console.log("delete 5B48-99C1-A294-B60D-0FF6-8E86");
    //deleteEntry("5B48-99C1-A294-B60D-0FF6-8E86");

    var mytable = $('#example').DataTable();
    var row  = mytable.row('.selected');
    var data = row.data();
    row.remove().draw( false );
    deleteEntry(data.key)
    // mytable.row('.selected').remove().draw( false );

}

// triggerred on firebase authentication state changes
function authStateObserver(user) {
    if (user) { // User is signed in!

       if (user.email.indexOf("@tensiontech.com") > 0)
       {
        
        loadLicenses();
        showHide(false, "signedOut");
        showHide(false, "welcome");
        showHide(true, "signedIn");
        showHide(true, "licenseGrid");

        var userName = getUserName();

        var profilePicUrl = getProfilePicUrl();

        // Set the user's profile pic and name.
        // userPicElement.style.backgroundImage = 'url(' + profilePicUrl + ')';

        document.getElementById('user-name').textContent = userName;
       }
       else
       {
           alert ("Please sign in with a tension tech account");
           firebase.auth().signOut();
       }

        

        } else { // User is signed out!

        showHide(true, "signedOut");
        showHide(true, "welcome");
        showHide(false, "signedIn");
        showHide(false, "licenseGrid");

    }
}

function shortDateWithToolTip(date){
    return "<div title='"+date+"'>"+shortDate(date)+"</div>"
}

function shortDate(date){
    // console.log ("shortdate: " , date); 
    
    var dateStr = moment(date).format("DD-MM-YYYY");
    // console.log ("shortdate: " , dateStr); 
    return dateStr;
}

function addSerialToArray(serial)
{
    if (serialArr.includes(serial))
    {
        alert ("duplicate serial: " +serial);
    }
    else
    {
    serialArr.push(serial);
    }
}

function loadLicenses() {

    console.log("loadLicenses");

        
    var callbackAdded = function(snap) {
    
        console.log("callbackAdded");

        var row = snap.val();
        addSerialToArray(row.serial);

        console.log("row from db:", snap.key);
        console.log("row from db:", row);

        //var dataRow = buildLicenseRow(snap.key, snap.val());
        var license = new License(row.notValidBefore,row.notValidAfter ,snap.key,row.customer,row.serial, row.hcf,row.maintDate,row.state, row.version,row.s2s,row.wrm);

        var table = $('#example').DataTable ();
        table.rows.add([license]).draw();
    
    };

    var callbackChanged = function(snap) {
        console.log("callbackChanged");
        
        // var dataRow = buildLicenseRow(snap.key, snap.val());
        // var table = $('#example').DataTable ();
        // table.draw();
        location.reload();
        // table.rows.add([dataRow]).draw();
    
    };

    var licensesRef= firebase.database().ref('/licenses/');

    licensesRef.on('child_added', callbackAdded);
    licensesRef.on('child_changed', callbackChanged);


    licensesRef.on('child_removed', (data) => {
        console.log ("on child removed data.key:" +data.key);


        //var licensedNode = document.getElementById(data.key);
        //licensedNode.parentNode.removeChild(licensedNode);
      });

    }

    // loadLicenses();

    function initFirebaseAuth() {
        // Listen to auth state changes.
        firebase.auth().onAuthStateChanged(authStateObserver);
    }

    // initialize Firebase authentication
    // initFirebaseAuth();

    function buildLicenseRow(key, data)
    {
        console.log("buildLicenseRow key:" +key+ " data:" +data )
        var row = { "key" : key, "customer" : data.customer, "serial" : data.serial, "hcfList" : data.hcf, "maintDate" : data.maintDate}
        return row
    }

    function showHide(show, elemId) {
        var element = document.getElementById(elemId);
        if (show)
            // element.className += " w3-show";
            element.className = element.className.replace("w3-hide", "w3-show");

        else
            element.className = element.className.replace("w3-show", "w3-hide");
        }   

        function signOut() {
        // Sign out of Firebase.
        firebase.auth().signOut();
        }  
        $("#signOut").bind("click",signOut);
        
        $("#signIn").bind("click",signIn);

        function signIn() {
            // Sign into Firebase using popup auth & Google as the identity provider.
            var provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider);
        }

        // Returns the signed-in user's display name.
        function getUserName() {
            return firebase.auth().currentUser.displayName;
        }

        // Returns the signed-in user's profile Pic URL.
        function getProfilePicUrl() {
        var cu = firebase.auth().currentUser; 
        var url = cu.photoURL;
        return firebase.auth().currentUser.photoURL || "/images/profile_placeholder.png";
        // return "/images/profile_placeholder.png";
        }

