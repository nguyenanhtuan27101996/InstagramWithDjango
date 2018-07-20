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
                alert(idPost);
                // $.ajax({
                //     url: $(this).attr("data-ajax-target"),
                //     type: 'POST',
                //     data: {
                //         'id': idPost,
                //         'comment': comment
                //     },
                //     dataType: 'json',
                //     success: function (data) {
                //         htmlElement = "<div class='row'>";
                //         htmlElement += "<div class='col-md-12'>";
                //         htmlElement += "<p class='bold-p-tag-opensans'>";
                //         htmlElement += "<a href='#' class='a-tag-of-home'>";
                //         htmlElement += "" + data.user_comment + " :</a>&nbsp;&nbsp;&nbsp;"
                //             + data.body_comment + " ";
                //         htmlElement += "</p>";
                //         htmlElement += "</div>";
                //         htmlElement += "</div>";
                //         self.closest(".contains-all-comment").find(".contains-comment").prepend(htmlElement);
                //     },
                // });
            }
            //Enable the textbox again if needed.
            $(this).removeAttr("disabled");
            $(this).val("");
        }
    });
})