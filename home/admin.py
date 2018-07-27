from django.contrib import admin
from .models import UserProfile, Post, Image, Comment, UserFollow
# Register your models here.


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'phone', 'website', 'sex', 'birth_day_pretty']
    list_filter = ['user__username']
    search_fields = ['user__username']
    list_per_page = 5


class ImageInline(admin.TabularInline):
    model = Image


class CommentInline(admin.TabularInline):
    model = Comment


class PostAdmin(admin.ModelAdmin):
    list_display = ['id', 'show_part_of_caption', 'user', 'time_posted']
    list_display_links = ['id','show_part_of_caption']
    list_filter = ['user__username']
    search_fields = ['caption']
    list_per_page = 5
    inlines = [ImageInline, CommentInline]


class UserFollowAdmin(admin.ModelAdmin):
    list_display = ['id', 'follower_user', 'followed_user']
    list_per_page = 5
    list_filter =  ['follower_user']
    search_fields = ['follower_user']


admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(UserFollow, UserFollowAdmin)

