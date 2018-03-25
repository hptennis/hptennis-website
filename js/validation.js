$().ready(function () {
    // validate the comment form when it is submitted
    // validate signup form on keyup and submit
    $("#memberForm").validate({
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            id01firstname: {
                required: true,
                minlength: 2,
                lettersonly: true
            },
            id01lastname: {
                required: true,
                minlength: 3,
                letterhyphensonly: true
            },
            id01address1 : {
                required: true,
                minlength: 8,
                letterswithbasicpunc: true
            },
            id01address2 : {
                required: false,
                minlength: 8,
                letterswithbasicpunc: true
            },
            id01postcode: {
                required: true,
                postcodeUK: true
            },
            id01email: {
                required: true,
                email: true
            },
            id01phone: {
                required: true,
                phoneUK: true
            }
        },
        messages: {
            id01firstname: {
                required: "Please enter a firstname",
                minlength: "Your first name must consist of at least 2 characters"
            },
            id01lastname: {
                required: "Please enter a lastname",
                minlength: "Your last name must consist of at least 3 characters"
            },
            email: "Please enter a valid email address",
        }
    });


    // $("#findMember").validate({
    //     errorPlacement: function (error, element) {
    //         // Append error within linked label
    //         $(element)
    //             .closest("form")
    //             .find("label[for='" + element.attr("id") + "']")
    //             .append(error);
    //     },
    //     errorElement: "span",
    //     rules: {
    //         id02firstname: {
    //             required: true,
    //             minlength: 3,
    //             lettersonly: true
    //         },
    //         id02lastname: {
    //             required: true,
    //             minlength: 3,
    //             letterhyphensonly: true
    //         }
    //     },
    //     messages: {
    //         id02firstname: {
    //             required: "Please enter a firstname",
    //             minlength: "Your first name must consist of at least 3 characters"
    //         },
    //         id02lastname: {
    //             required: "Please enter a lastname",
    //             minlength: "Your last name must consist of at least 3 characters"
    //         }
    //     }
    // });


   

    

});

$().ready(function () {
    $("#findMember").validate({
        errorPlacement: function (error, element) {
            // Append error within linked label
            $(element)
                .closest("form")
                .find("label[for='" + element.attr("id") + "']")
                .append(error);
        },
        errorElement: "span",
        rules: {
            id02firstname: {
                required: true,
                minlength: 2,
                lettersonly: true
            },
            id02lastname: {
                required: true,
                minlength: 3,
                letterhyphensonly: true
            }
        },
        messages: {
            id02firstname: {
                required: "Please enter a firstname",
                minlength: "Your first name must consist of at least 2 characters"
            },
            id02lastname: {
                required: "Please enter a lastname",
                minlength: "Your last name must consist of at least 3 characters"
            }
        }
    });
});

$.validator.addMethod("lettersonly", function (value, element) {
    return this.optional(element) || /^[a-z]+$/i.test(value);
}, "Letters only please");
$.validator.addMethod("letterhyphensonly", function (value, element) {
    return this.optional(element) || /^[a-z\-]+$/i.test(value);
}, "Letters only please");
$.validator.addMethod( "letterswithbasicpunc", function( value, element ) {
	return this.optional( element ) || /^[A-Za-z0-9\-.,()'"\s]+$/i.test( value );
}, "Letters or punctuation only please" );
$.validator.addMethod( "postcodeUK", function( value, element ) {
	return this.optional( element ) || /^((([A-PR-UWYZ][0-9])|([A-PR-UWYZ][0-9][0-9])|([A-PR-UWYZ][A-HK-Y][0-9])|([A-PR-UWYZ][A-HK-Y][0-9][0-9])|([A-PR-UWYZ][0-9][A-HJKSTUW])|([A-PR-UWYZ][A-HK-Y][0-9][ABEHMNPRVWXY]))\s?([0-9][ABD-HJLNP-UW-Z]{2})|(GIR)\s?(0AA))$/i.test( value );
}, "Please specify a valid UK postcode" );
/* For UK phone functions, do the following server side processing:
    * Compare original input with this RegEx pattern:
    * ^\(?(?:(?:00\)?[\s\-]?\(?|\+)(44)\)?[\s\-]?\(?(?:0\)?[\s\-]?\(?)?|0)([1-9]\d{1,4}\)?[\s\d\-]+)$
    * Extract $1 and set $prefix to '+44<space>' if $1 is '44', otherwise set $prefix to '0'
    * Extract $2 and remove hyphens, spaces and parentheses. Phone number is combined $prefix and $2.
    * A number of very detailed GB telephone number RegEx patterns can also be found at:
    * http://www.aa-asterisk.org.uk/index.php/Regular_Expressions_for_Validating_and_Formatting_GB_Telephone_Numbers
*/
$.validator.addMethod("phoneUK", function (phone_number, element) {
    phone_number = phone_number.replace(/\(|\)|\s+|-/g, "");
    return this.optional(element) || phone_number.length > 9 &&
        phone_number.match(/^(?:(?:(?:00\s?|\+)44\s?)|(?:\(?0))(?:\d{2}\)?\s?\d{4}\s?\d{4}|\d{3}\)?\s?\d{3}\s?\d{3,4}|\d{4}\)?\s?(?:\d{5}|\d{3}\s?\d{3})|\d{5}\)?\s?\d{4,5})$/);
}, "Please specify a valid phone number");