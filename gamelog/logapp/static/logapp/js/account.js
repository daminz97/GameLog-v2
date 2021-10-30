$(document).on('click', function(e){
    if (!$(e.target).closest("#img-box, #form-wrapper, #confirm-box").length) {
        $('body').find("#img-box, #form-wrapper, #confirm-box").hide();
    }
});