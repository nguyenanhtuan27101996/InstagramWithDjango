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
        var self = $(this);
        if (e.which === 13) {
            var comment = $(this).val();

            //Disable textbox to prevent multiple submit
            $(this).attr("disabled", "disabled");
            if(comment != ""){
                var idPost = $(this).attr("data-id-post");
                var urlUpdateComment = $(this).attr("data-ajax-target1");
                var urlDeleteComment = $(this).attr("data-ajax-target2");
                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idPost,
                        'comment': comment
                    },
                    dataType: 'json',
                    success: function (data) {
                        // htmlElement = "<div class='col-md-12'>";
                        // htmlElement += "<p class='bold-p-tag-opensans'>";
                        // htmlElement += "<a href='#' class='a-tag-of-home'>";
                        // htmlElement += "" + data.user_comment + ":</a>&nbsp;&nbsp;&nbsp;"
                        //     + data.body_comment + " ";
                        // htmlElement += "</p>";
                        // htmlElement += "</div>";

                        htmlElement = "<div class='col-md-12'>";
                        htmlElement += "<p class='bold-p-tag-opensans'>";
                        htmlElement += "<a href='#' class='a-tag-of-home'>";
                        htmlElement += "" + data.user_comment + " :</a>&nbsp;&nbsp;&nbsp;" +
                            "<span class='span-contains-comment' data-id-comment='"+data.id_comment+"'>" +
                            "" + data.body_comment+ "</span>";

                        htmlElement += "<span class='btn-popup-edit-comment' style='margin-left: 10px;cursor: pointer;'>" +
                            "<i class='fas fa-pencil-alt'></i></span>";
                        htmlElement += "<span class='btn-popup-delete-comment' style='margin-left: 10px;cursor: pointer'>" +
                            "<i class='fas fa-trash-alt'></i></span>";

                        htmlElement += "<div class='modal fade' id='modalDeleteComment' tabindex='-1' " +
                            "role='dialog' aria-labelledby='exampleModalCenterTitle' aria-hidden='true'>";
                        htmlElement += "<div class='modal-dialog modal-dialog-centered' role='document'>";
                        htmlElement += "<div class='modal-content'>";

                        htmlElement += "<div class='modal-header'>";
                        htmlElement += "<h6 class='modal-title' id='exampleModalLongTitle'>Delete Comment</h6>";
                        htmlElement += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>";
                        htmlElement += "<span aria-hidden='true'>&times;</span>";
                        htmlElement += "</button>";
                        htmlElement += "</div>";

                        htmlElement += "<div class='modal-body'>";
                        htmlElement += "<span>Are you sure that you want to delete this comment?</span>";
                        htmlElement += "</div>";

                        htmlElement += "<div class='modal-footer'>";
                        htmlElement += "<button type='button' class='btn btn-outline-secondary' data-dismiss='modal'>Close</button>";
                        htmlElement += "<button type='button' class='btn btn-danger btn-delete-comment' data-ajax-target='"+urlDeleteComment+"'>Delete</button>";
                        htmlElement += "</div>";

                        htmlElement += "</div>";
                        htmlElement += "</div>";
                        htmlElement += "</div>";

                        htmlElement += "<div class='edit-comment-form' style='display: none;'>";
                        htmlElement += "<textarea class='form-control' id='txt-edit-comment'></textarea>";
                        htmlElement += "<span class='small-p-tag-blue-color btn-confirm-edit-comment' " +
                            "data-ajax-target='"+urlUpdateComment+"'>Edit</span>&nbsp;&nbsp;";
                        htmlElement += "<span class='small-p-tag-blue-color btn-cancel-edit-comment'>Cancel</span>";
                        htmlElement += "</div>";

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

    $("body").on("click",".btn-like-post",function () {
        var idPost = $(this).attr("data-id-post");
        var usernameHitLike = $(this).attr("data-user-like");
        var self = $(this);
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
                    self.closest(".display-like-post")
                        .find(".contains-sum-likes").text("" + data.sum_like + " likes");
                } else {
                     self.find("span").remove();
                     self.closest(".display-like-post")
                        .find(".contains-sum-likes").text("" + data.sum_like + " likes");
                }
            },
        });
    });

    $("body").on("click", ".btn-popup-edit-comment", function () {
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
            if (newComment == "") {
                alert("Caption can not be empty !");
            } else {
                $.ajax({
                    url: $(this).attr("data-ajax-target"),
                    type: 'POST',
                    data: {
                        'id': idComment,
                        'body': newComment,
                    },
                    dataType: 'json',
                    success: function (data) {
                        location.reload(true);
                    },
                });
            }
        });
        //when click to cancel edit button
        self.closest("div").find(".btn-cancel-edit-comment").click(function () {
            $(this).closest("div").hide();
            $(this).closest(".contains-comment").find(".span-contains-comment").show();
            $(this).closest(".contains-comment").find(".btn-popup-edit-comment").show();
        });
    });

    $("body").on("click",".btn-popup-delete-comment",function () {
       var self = $(this);
       var idComment = self.closest("div").find(".span-contains-comment").attr("data-id-comment");

        self.closest(".contains-comment").find("#modalDeleteComment").modal("show");
        self.closest(".contains-comment").find(".btn-delete-comment").click(function () {
            $.ajax({
                url: $(this).attr("data-ajax-target"),
                type: 'POST',
                data: {
                    'id': idComment,

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
});