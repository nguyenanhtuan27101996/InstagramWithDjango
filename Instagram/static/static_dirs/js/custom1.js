$(document).ready(function () {
    $('.flexslider').flexslider({
        animation: "fade"
    });
    $.endlessPaginate({
        paginateOnScroll: true,
        paginateOnScrollMargin: 20
    });
    $("body").on("keypress", ".txt-comment", function (e) {
        var self = $(this)
        if (e.which === 13) {
            var comment = $(this).val();

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            if (comment != "") {
                var idPost = $(this).closest(".contains-all-comment")
                    .find(".contains-comment").attr("data-id-post");

                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idPost,
                        'comment': comment
                    },
                    dataType: 'json',
                    success: function (data) {
                        htmlElement = "<div class='row'>";
                        htmlElement += "<div class='col-md-12'>";
                        htmlElement += "<p class='bold-p-tag-opensans'>";
                        htmlElement += "<a href='#' class='a-tag-of-home'>";
                        htmlElement += "" + data.user_comment + " :</a>&nbsp;&nbsp;&nbsp;"
                            + data.body_comment + " ";
                        htmlElement += "</p>";
                        htmlElement += "</div>";
                        htmlElement += "</div>";
                        self.closest(".contains-all-comment").find(".contains-comment").prepend(htmlElement);
                    },
                });
            }
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
            $(this).val("");
        }
    });

    $("body").on("click", ".btn-like-post", function () {
        var usernameHitLike = $(this).closest("div").attr("data-user-like");
        var idPost = $(this).closest("div").attr("data-id-post");
        var self = $(this)
        $.ajax({
            url: $(this).attr("data-ajax-target"),
            type: 'POST',
            data: {
                'id': idPost,
                'username_hit_like': usernameHitLike
            },
            dataType: 'json',
            success: function (data) {
                if(data.is_valid){
                    self.find("span").css({
                        'color': 'blue',
                    });
                    self.find("i").removeClass("far fa-thumbs-up");
                    self.find("i").addClass("fas fa-thumbs-up");
                    self.closest(".contains-all-comment")
                        .find(".contains-sum-likes").text(""+data.sum_like+" likes");

                }else{
                     self.find("span").css({
                        'color': 'black',
                    });
                    self.find("i").removeClass("fas fa-thumbs-up");
                    self.find("i").addClass("far fa-thumbs-up");
                    self.closest(".contains-all-comment")
                        .find(".contains-sum-likes").text(""+data.sum_like+" likes");
                }

            },
        });


    })

});