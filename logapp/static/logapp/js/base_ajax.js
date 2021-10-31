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
    $('#edit').click(function(event) {
        $('#form-wrapper').show();
        $('#edit').hide();
    });
    
    $('#edit_profile_submit').click(function(event) {
        event.preventDefault();
        $('#form-wrapper').hide();
        $('#confirm-box').show();
        $('span').css('color', 'green');
    });
    
    $('#close-confirm').click(function(event) {
        $('#confirm-box').hide();
        $('#edit').show();
    })
    
    $("#img-selector").click(function(event) {
        $("#img-box").show();
    
    });
    
    $('#close-img').click(function(event) {
        $('#img-box').hide();
    })
    
    // update profile
    $('#edit_profile_submit').click(function(e){
        e.preventDefault();
        console.log("form submitted");
        $.ajax({
            type: "POST",
            url: "{% url 'new_profile' %}",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                region: $('#new_region').val(),
                email: $('#new_email').val().trim(),
                fname: $('#new_fname').val().trim(),
                lname: $('#new_lname').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#region').html(data.region);
                $('#email').html(data.email);
                $('#fname').html(data.fname);
                $('#lname').text(data.lname);
            },
        });
    });

    // add game ajax form
    $('#add_game_submit').click(function(e){
        e.preventDefault();
        console.log("form submitted");
        var formData = new FormData(document.getElementById('add_game_form'));
        $.ajax({
            type: "POST",
            url: "{% url new_game %}",
            headers: {'X-CSRFToken': csrftoken},
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                $('#add_game_msg').html(data.msg);
            },
        });
        $('#add_game_form')[0].reset();
    });

    // search games
    $('#search_submit').click(function(e){
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "{% url search_results %}",
            headers: {'X-CSRFToken': csrftoken},
            data: {
                platform: $('#id_search_platform').val(),
                genre: $('#id_search_genre').val(),
                theme: $('#id_search_theme').val(),
                name: $('#id_search_name').val().trim(),
            },
            success: function(data) {
                console.log(data)
                $("#game-of-year").css("display", "none");
                $("#steam-game").css("display", "none");
                $("#steam-game-list").html(data);
                $("#steam-game-list").css("display", "block");
            },
        });
        $('#search_form')[0].reset();
    });

    // view more games
    $('#view-more-btn').click(function(e) {
        e.preventDefault();
        $.ajax({
            type: "GET",
            url: "{% url search_results %}",
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
        
    });

    // ajax reset password
    // check if user exist
    $('#reset_username').keyup(function() {
        $.ajax({
            type: "GET",
            url: '{% url if_exists %}',
            data: {
                keyin_username: $('#reset_username').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#user_exist_msg').text(data.msg);
            }
        })
    });

    // check if old password
    $('#reset_password').keyup(function() {
        $.ajax({
            type: 'GET',
            url: '{% url not_old_password %}',
            data: {
                keyin_username: $('#reset_username').val().trim(),
                keyin_password: $('#reset_password').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#not_old_password_msg').text(data.msg);
            }
        })
    });

    // check if passwords match
    $('#verify_reset_password').keyup(function() {
        $.ajax({
            type: 'GET',
            url: '{% url if_match %}',
            data: {
                password: $('#reset_password').val().trim(),
                verify_pass: $('#verify_reset_password').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#password_match_msg').text(data.msg);
            }
        })
    });

    // show reset password form
    $('#reset_password_trigger').click(function(e) {
        e.preventDefault();
        $('#reset_password_form').toggle();
        $('#reset_msg').hide();
    });

    // submit reset request
    $('#reset_password_btn').click(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '{% url new_password %}',
            headers: {'X-CSRFToken': csrftoken},
            data: {
                username: $('#reset_username').val().trim(),
                new_password: $('#verify_reset_password').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#reset_password_form').hide();
                $('#reset_msg').text(data.msg);
                $('#reset_msg').show();
            }
        })
    });

    // submit new time budget
    $('#time_budget_submit').click(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '{% url new_time_budget %}',
            headers: {'X-CSRFToken': csrftoken},
            data: {
                new_time_budget: $('#new_time_budget').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#exceed_time').html(data);
            }
        });
        $('#new_time_budget').val('');
    });

    // submit new budget
    $('#budget_submit').click(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '{% url new_budget %}',
            headers: {'X-CSRFToken': csrftoken},
            data: {
                new_budget: $('#new_budget').val().trim(),
                dataType: 'json',
            },
            success: function(data) {
                $('#exceed_budget').html(data);
            }
        });
        $('#new_budget').val('');
    });
});