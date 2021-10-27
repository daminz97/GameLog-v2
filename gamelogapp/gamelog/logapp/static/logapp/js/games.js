// show platform game list
$('#view-more-btn').on("click", function(e) {
    e.preventDefault();
    $("#game-of-year").css("display", "none");
    $("#steam-game").css("display", "none");
    $("#steam-game-list").css("display", "block");
})