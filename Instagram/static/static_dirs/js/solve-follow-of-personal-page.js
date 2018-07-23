$(document).ready(function () {
    $("#btn-follow").click(function () {
        var followerUsername = $(this).attr("data-follower-user");
        var followedUsername = $(this).attr("data-followed-user");
        var self = $(this);
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
                    self.fadeOut("normal");
                    self.fadeIn("normal");
                    self.html("Following&nbsp;&nbsp;&nbsp;&nbsp;<i class='fas fa-check'></i>");
                } else {
                    self.fadeOut("normal");
                    self.fadeIn("normal");
                    self.html("Follow&nbsp;&nbsp;&nbsp;&nbsp;<i class='fas fa-user-plus'></i>");
                }


            },
        });
    });
});