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
                minlength: 3,
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
                minlength: "Your first name must consist of at least 3 characters!!!!!!"
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
