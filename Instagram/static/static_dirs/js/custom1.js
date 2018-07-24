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
                var urlUpdateComment = $(this).attr("data-ajax-target1");
                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idPost,
                        'comment': comment
                    },
                    dataType: 'json',
                    success: function (data) {
                        // htmlElement = "<div class='row'>";
                        // htmlElement += "<div class='col-md-12'>";
                        // htmlElement += "<p class='bold-p-tag-opensans'>";
                        // htmlElement += "<a href='#' class='a-tag-of-home'>";
                        // htmlElement += "" + data.user_comment + " :</a>&nbsp;&nbsp;&nbsp;"
                        //     + data.body_comment + " ";
                        // htmlElement += "</p>";
                        // htmlElement += "</div>";
                        // htmlElement += "</div>";
                        htmlElement = "<div class='row each-comment'>";
                        htmlElement += "<div class='col-md-12'>";
                        htmlElement += "<p class='bold-p-tag-opensans'>";
                        htmlElement += "<a href='#' class='a-tag-of-home'>";
                        htmlElement += "" + data.user_comment + " :</a>&nbsp;&nbsp;&nbsp;" +
                            "<span class='span-contains-comment' data-id-comment='"+data.id_comment+"'>" +
                            "" + data.body_comment+ "</span>";
                        htmlElement += "<span class='btn-popup-edit-comment' style='margin-left: 10px;cursor: pointer;'>" +
                            "<i class='fas fa-pencil-alt'></i></span>";
                        htmlElement += "<div class='edit-comment-form' style='display: none;'>";
                        htmlElement += "<textarea class='form-control' id='txt-edit-comment'></textarea>";
                        htmlElement += "<span class='small-p-tag-blue-color btn-confirm-edit-comment' " +
                            "data-ajax-target='"+urlUpdateComment+"'>Edit</span>&nbsp;&nbsp;";
                        htmlElement += "<span class='small-p-tag-blue-color btn-cancel-edit-comment'>Cancel</span>";
                        htmlElement += "</div>";
                        htmlElement += "</p>";
                        htmlElement += "</div>";
                        htmlElement += "</div>";
                        self.closest(".contains-all-comment").find(".contains-comment")
                            .prepend(htmlElement).fadeIn();

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
                if (data.is_valid) {
                    self.find("span").remove();
                    newElementSpan = "<span style='color: blue;'>Liked</span>";
                    self.append(newElementSpan);
                    self.closest(".contains-all-comment")
                        .find(".contains-sum-likes").text("" + data.sum_like + " likes");

                } else {
                     self.find("span").remove();
                     self.closest(".contains-all-comment")
                        .find(".contains-sum-likes").text("" + data.sum_like + " likes");
                }
            },
        });
    });
    $("body").on("click",".btn-popup-edit-caption",function () {
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
            var idPost =  $(this).closest(".contains-caption").
            find(".span-contains-caption").attr("data-id-post");
            var self = $(this);
            if(newCaption == ""){
                alert("Caption can not be empty !");
            }else{
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
    $("body").on("click", ".btn-open-delete-post", function () {
        $(this).closest(".header-of-each-post").find("#modalDeletePost").modal("show");
        var idPost = $(this).attr("data-id-post");
        var self = $(this);
        self.closest(".header-of-each-post").find(".btn-delete-post").click(function () {
            var dataAjaxTarget = self.closest(".header-of-each-post")
                .find(".btn-delete-post").attr("data-ajax-target");
            $.ajax({
                url: dataAjaxTarget,
                type: 'POST',
                data: {
                    'id': idPost,

                },
                dataType: 'json',
                success: function (data) {
                    if(data.is_valid){
                        alert("Deleted successfully!");
                        location.reload(true);
                    }
                },
            });
        });

    });

    $("body").on("click",".btn-popup-edit-comment",function () {
        var self = $(this);

        var oldComment = self.closest("div").find(".span-contains-comment").text();
        self.hide();
        self.closest("div").find(".span-contains-comment").hide();
        self.closest("div").find(".edit-comment-form").show({
            animation: "slide",
        });
        self.closest("div").find("#txt-edit-comment").val(oldComment).focus();

        //when click to confirm edit button
        self.closest("div").find(".btn-confirm-edit-comment").click(function () {
            var newComment = self.closest("div").find("#txt-edit-comment").val();
            var idComment = self.closest("div").find(".span-contains-comment").attr("data-id-comment");
            var self1 = $(this);
            if(newComment == ""){
                alert("Caption can not be empty !");
            }else{
                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idComment,
                        'body': newComment,
                    },
                    dataType: 'json',
                    success: function (data) {
                        self1.closest(".each-comment")
                            .find(".span-contains-comment").text(data.new_comment).fadeIn("normal");
                        self1.closest("div").hide();
                        self1.closest(".each-comment").find(".span-contains-comment").show();
                        self1.closest(".each-comment").find(".btn-popup-edit-comment").show();
                    },
                });
            }
        });

        //when click to cancel edit button
        self.closest("div").find(".btn-cancel-edit-comment").click(function () {
            $(this).closest("div").hide();
            $(this).closest(".each-comment").find(".span-contains-comment").show();
            $(this).closest(".each-comment").find(".btn-popup-edit-comment").show();
        });
    });

    $("body").on("click",".btn-popup-delete-comment",function () {
       var self = $(this);
       var idComment = self.closest("div").find(".span-contains-comment").attr("data-id-comment");

        self.closest(".each-comment").find("#modalDeleteComment").modal("show");
        self.closest(".each-comment").find(".btn-delete-comment").click(function () {
            $.ajax({
                url: $(this).attr("data-ajax-target"),
                type: 'POST',
                data: {
                    'id': idComment,

                },
                dataType: 'json',
                success: function (data) {
                    if (data.is_valid) {
                        alert("Deleted successfully!");
                        location.reload(true);
                    }
                },
            });
        });
    });
});