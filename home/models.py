from django.db import models
from django.contrib.auth.models import User
from .choices import SEX_CHOICES
from django.db.models.signals import post_save
from django.utils import timezone

# Create your models here.


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    website = models.URLField(default='')
    description = models.CharField(max_length=200,default='')
    phone = models.CharField(max_length=20, default='')
    sex = models.IntegerField(choices=SEX_CHOICES, default=1)
    avatar = models.ImageField(upload_to='profile_images', blank=True)
    birth_day = models.DateField(default=timezone.now(), blank=True)

    def __str__(self):
        return self.user.username

    def birth_day_pretty(self):
        return self.birth_day.strftime('%d-%m-%Y')
    birth_day_pretty.short_description = 'Birthday'

    def birth_day_pretty1(self):
        return self.birth_day.strftime('%m/%d/%Y')

    def create_profile(sender, **kwargs):
        user = kwargs["instance"]
        if kwargs["created"]:
            user_profile = UserProfile(user=user)
            user_profile.save()
    post_save.connect(create_profile, sender=User)


class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    caption = models.TextField()
    time_posted = models.DateTimeField(auto_now_add=True)

    def show_part_of_caption(self):
        return self.caption[:30]

    def __str__(self):
        return self.show_part_of_caption()


class Image(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='post/photos')


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    body = models.TextField()
    time_commented = models.DateTimeField(auto_now_add=True)

