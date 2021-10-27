// user alert nav bar change
$("#user-dropdown").on('click', function(e) {
    e.preventDefault();
    if ($("#alert-menu").css('display') == "block") {
        $("#alert-menu").css('display', 'none');
        $("#alert-dropdown").css('color', "#1A5276");
    }
    if ($('#user-menu').css('display') == "block") {
        $('#user-menu').css('display', 'none');
        $('#user-dropdown').css('color', '#1A5276');
    } else {
        $('#user-menu').css('display', 'block');
        $('#user-dropdown').css('color', '#ffffff');
    }
})

$("#alert-dropdown").on('click', function(e) {
    e.preventDefault();
    if ($('#user-menu').css('display') == "block") {
        $('#user-menu').css('display', 'none');
        $('#user-dropdown').css('color', '#1A5276');
    }
    if ($("#alert-menu").css('display') == "block") {
        $("#alert-menu").css('display', 'none');
        $("#alert-dropdown").css('color', "#1A5276");
    } else {
        $("#alert-menu").css('display', 'block');
        $("#alert-dropdown").css('color', "#ffffff");
    }
})

// alert functino disabled
// function addAlert() {
//     return $("<a>", { class: "alert-item" }).text("Cuihua han ni chi fan le!");
// }

// for (let i = 0; i < 5; i++) {
//     $("#alert-menu").append(addAlert());
// }


// nav bar active tag switch
$(".menu-icon").click(function() {
    if ($("#nav-bar-list").attr('class') === "nav-bar-list") {
        $("#nav-bar-list").attr('class', "nav-bar-list responsive");
    } else {
        $("#nav-bar-list").attr('class', "nav-bar-list");
    }
});