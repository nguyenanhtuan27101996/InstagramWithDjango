$(document).ready(function () {

    $("body").on("click",".open-popup",function () {
        var dataURL = $(this).attr('data-href');

        // $('.modal-body').load(dataURL,function(){
        //     $('#modal-show-detail-post').modal('show');
        // });
        $('#modeliframe').attr("src", dataURL );
        $('#modal-show-detail-post').modal('show');
    });

    $("body").on("keypress",".txt-comment",function (e) {
        var self = $(this)
        if (e.which === 13) {
            var comment = $(this).val();

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            if(comment != ""){
                var idPost = $(this).attr("data-id-post");

                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idPost,
                        'comment': comment
                    },
                    dataType: 'json',
                    success: function (data) {
                        htmlElement = "<div class='col-md-12'>";
                        htmlElement += "<p class='bold-p-tag-opensans'>";
                        htmlElement += "<a href='#' class='a-tag-of-home'>";
                        htmlElement += "" + data.user_comment + ":</a>&nbsp;&nbsp;&nbsp;"
                            + data.body_comment + " ";
                        htmlElement += "</p>";
                        htmlElement += "</div>";

                        self.closest(".contains-all-about-post").find(".contains-comment").prepend(htmlElement);
                    },
                });
            }
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
            $(this).val("");
        }
    });

    //edit the caption of post
    $("body").on("click", ".btn-popup-edit-caption", function () {
        var oldCaption = $(this).closest("p").find(".span-contains-caption").text();
        $(this).hide();
        $(this).closest("p").find(".span-contains-caption").hide();
        $(this).closest("div").find(".edit-caption-form").show({
            animation: "slide",
        });
        $(this).closest("div").find("#txt-caption").val(oldCaption).focus();

        //when click to confirm edit button
        $(this).closest("div").find(".btn-confirm-edit").click(function () {
            var newCaption = $(this).closest("div").find("#txt-caption").val();
            var idPost = $(this).closest(".contains-caption").find(".span-contains-caption")
                .attr("data-id-post");
            var self = $(this);
            if (newCaption == "") {
                alert("Caption can not be empty !");
            } else {
                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idPost,
                        'caption': newCaption
                    },
                    dataType: 'json',
                    success: function (data) {
                        self.closest(".contains-caption")
                            .find(".span-contains-caption").text(data.new_caption).fadeIn("normal");
                        self.closest("div").hide();
                        self.closest(".contains-caption").find(".span-contains-caption").show();
                        self.closest(".contains-caption").find(".btn-popup-edit-caption").show();
                    },
                });

            }
        });

        //when click to cancel edit button
        $(this).closest("div").find(".btn-cancel-edit").click(function () {
            $(this).closest("div").hide();
            $(this).closest(".contains-caption").find(".span-contains-caption").show();
            $(this).closest(".contains-caption").find(".btn-popup-edit-caption").show();
        });


    });
    $("body").on("click", ".btn-open-delete-post",function () {
        var idPost = $(this).attr("data-id-post");
        $(this).closest(".h-100").find("#modalDeletePost").modal("show");
        var self = $(this);
        self.closest(".h-100").find(".btn-delete-post").click(function () {
            var dataAjaxTarget = self.closest(".h-100").find(".btn-delete-post")
                .attr("data-ajax-target");
            $.ajax({
                url: dataAjaxTarget,
                type: 'POST',
                data: {
                    'id': idPost,
                },
                dataType: 'json',
                success: function (data) {
                    if (data.is_valid) {
                         location.reload(true);
                    }
                },
            });
        });
    });

    $("#btn-follow").click(function () {
        var followerUsername = $(this).attr("data-follower-user");
        var followedUsername = $(this).attr("data-followed-user");
        $.ajax({
            url: $(this).attr("data-ajax-target"),
            type: 'POST',
            data: {
                'follower_username': followerUsername,
                'followed_username': followedUsername
            },
            dataType: 'json',
            success: function (data) {
                if (data.is_valid) {
                    alert("followed");
                }else{
                    alert("unfollowed");
                }


            },
        });
    });

})