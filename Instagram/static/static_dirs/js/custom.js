$(document).ready(function () {
    $('#txt-comment').on('keypress', function (e) {
        if (e.which === 13) {
            var comment = $(this).val();

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            alert(comment);
            //Do Stuff, submit, etc..

            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
            $(this).val("");
        }
    });

    $(".btn-jump-to-comment").click(function () {
        $('html, body').animate({
            scrollTop: $("#txt-comment").offset().top
        }, 1000);
        $(".txt-comment").focus();
    });

    $("#btn-edit-profile-setting").click(function () {
        $(this).addClass("active-p-bold");
        $("#btn-change-password-setting").removeClass("active-p-bold");
        $("#div-edit-profile").show();
        $("#div-change-password").hide();

    });
    $("#btn-change-password-setting").click(function () {
        $(this).addClass("active-p-bold");
        $("#btn-edit-profile-setting").removeClass("active-p-bold");
        $("#div-change-password").show();
        $("#div-edit-profile").hide();
    });

    $('.individual-form').formset();

    $('.flexslider').flexslider({
        animation: "fade"
    });
    $.endlessPaginate({
        paginateOnScroll: true,
        paginateOnScrollMargin: 20
    });
    $("body").on("click", ".img-show-detail-post", function () {
        alert("abc");
    });
    $("#abc").click(function () {
        alert("abcc");
    });

    $("#search-input").on("keyup", function () {

        var searchText = $(this).val();
        $.ajax({
            url: $(this).attr("data-ajax-target"),
            type: 'POST',
            data: {
                'search_text': searchText,

            },
            dataType: 'html',
            success: function (data) {
                $("#search-results").html(data);
            },
        });


    })


});

