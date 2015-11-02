/* Run initializations on sidebar load.*/
var google_token = "";
$(document).ready(function() {
    initBtnLinks()
})

function initBtnLinks() {
    console.log("hi ")
    initGoogleDFA();
    initLogos();
    $('.resetBtn').click(function() {
        reset_auth($(this).attr('id'))
    })
}

function initGoogleDFA() {
    google.script.run.withSuccessHandler(function(res) {
        if (res.res == -1) {
            google_token = res.auth_link
            console.log(google_token)
            $('#googleDFA button').attr("disabled", "disabled");
            //show buttons!
            $.get('https://www.googleapis.com/dfareporting/v2.2/userprofiles?access_token=' + google_token, function(data) {
                console.log(data)
            }, 'json')
            google.script.run.withSuccessHandler(function(res) {
                console.log
            }).getProfiles('dcm')
        } else {
            $('#googleDFA').attr('href', res.auth_link)
        }


    }).authenticate('init', 'dfa');
    $('#googleDFA').click(function() {
        initGoogleDFA()
    })
}

function reset_auth(app) {
    google.script.run.withSuccessHandler(function(res) {
        if (res.res == 1) {
            $('#' + res.btn).removeAttr('disabled')
        }
    }).resetService(app)
}

function initLogos() {


    google.script.run.withSuccessHandler(function(res) {
        console.log(res)
        $.each(res, function(k, v) {

            $('<img src="' + v + '" />').appendTo($('#' + k))
        })

    }).getImgFile()

}
