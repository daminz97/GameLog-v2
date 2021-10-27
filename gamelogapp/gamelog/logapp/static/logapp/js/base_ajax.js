function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie!=='') {
        const cookies = document.cookie.split(';');
        for (let i=0; i<cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length+1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length+1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

if (!csrftoken || csrftoken == "") {
    alert("Cookie disabled");
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToekn", csrftoken);
        }
    }
});

// close pop click other areas
$(document).mousedown(function(e) {
    const pop = $('#confirm-box');
    if (!pop.is(e.target) && pop.has(e.target).length === 0) {
        $('#confirm-box').hide();
    }
})

$(document).mousedown(function(e) {
    const pop = $('#img-box');
    if (!pop.is(e.target) && pop.has(e.target).length === 0) {
        $('#img-box').hide();
    } 
})

$(document).mousedown(function(e) {
    const pop = $('#form-wrapper');
    if (!pop.is(e.target) && pop.has(e.target).length === 0) {
        $('#form-wrapper').hide();
        $('#edit').show();
    }
})

$(document).ready(function(){
    // account information ajax update
    $('#edit').on("click", function(event) {
        $('#form-wrapper').show();
        $('#edit').hide();
    });
    
    $('#submit').on("click", function(event) {
        event.preventDefault();
        $('#form-wrapper').hide();
        $('#confirm-box').show();
        $('span').css('color', 'green');
    });
    
    $('#close-confirm').on("click", function(event) {
        $('#confirm-box').hide();
        $('#edit').show();
    })
    
    $("#img-selector").on("click", function(event) {
        $("#img-box").show();
    
    });
    
    $('#close-img').on("click", function(event) {
        $('#img-box').hide();
    })
    
    $('#submit').click(function(e){
        e.preventDefault();
        console.log("form submitted");
        $.ajax({
            type: "POST",
            url: "update_profile",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                region: $('#new_region').val(),
                email: $('#new_email').val(),
                fname: $('#new_fname').val(),
                lname: $('#new_lname').val(),
                dataType: 'json',
            },
            success: function(data) {
                $('#region').html(data.region);
                $('#email').html(data.email);
                $('#fname').html(data.fname);
                $('#lname').text(data.lname);
            },
            error: function(xhr, errmsg, err) {
                
            }
        });
    });

    // add game ajax form
    $('#add_game_submit').click(function(e){
        e.preventDefault();
        console.log("form submitted");
        var formData = new FormData(document.getElementById('add_game_form'));
        $.ajax({
            type: "POST",
            url: "add_game",
            headers: {'X-CSRFToken': csrftoken},
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                $('#add_game_msg').html(data.msg);
            },
            error: function(xhr, errmsg, err) {

            }
        });
    });

    // ajax update game search results
    $('#search_submit').click(function(e){
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "search_results",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                platform: $('#search_platform').val(),
                genre: $('#search_genre').val(),
                theme: $('#search_theme').val(),
                name: $('#search_by_name').val(),
            },
            success: function(data) {
                console.log(data)
                $("#game-of-year").css("display", "none");
                $("#steam-game").css("display", "none");
                $("#steam-game-list").html(data);
                $("#steam-game-list").css("display", "block");
            },
            error: function(xhr, errmsg, err) {
                
            }
        });
        $('#search_form')[0].reset();
    });

    // ajax update games view more
    $('#view-more-btn').click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "search_results",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                name: 'all',
                platform: 'Steam',
            },
            success: function(data) {
                $("#game-of-year").css("display", "none");
                $("#steam-game").css("display", "none");
                $("#steam-game-list").html(data);
                $("#steam-game-list").css("display", "block");
            }
        })
        
    })
});