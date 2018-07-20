from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError,ObjectDoesNotExist
import re
from .choices import SEX_CHOICES
from django.forms import modelformset_factory
from .models import UserProfile, Post, Image
import datetime

#form create user
class RegistationForm(forms.Form):
    username = forms.CharField(max_length=30,widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Username',

        }
    ))
    email = forms.EmailField(required=True,widget=forms.EmailInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Email',

        }
    ))
    first_name = forms.CharField(max_length=30,widget=forms.TextInput(
        attrs={
            'class':'form-control',
            'placeholder':'First name',

        }
    ))
    last_name = forms.CharField(max_length=30, widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Last name',

        }
    ))
    password1 = forms.CharField(widget=forms.PasswordInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Password',

        }
    ))
    password2 = forms.CharField(widget=forms.PasswordInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Confirm password',

        }
    ))

    #check password confirm equal password
    def clean_password2(self):
        if 'password1' in self.data:
            password1 = self.cleaned_data.get('password1')
            password2 = self.cleaned_data.get('password2')
            if password1 and password2 and password1 ==password2:
                return password2
        raise ValidationError('Password does not match the confirm password.')

    #check if username  existed
    def clean_username(self):
        if 'username' in self.data:
            username = self.cleaned_data.get('username')
            if not re.search(r'^\w+$',username):
                raise ValidationError('Username can not contain special characters.')
            try:
                User.objects.get(username=username)
            except ObjectDoesNotExist:
                return username
            raise ValidationError('Username have already existed.')

    #create user
    def save(self):
        User.objects.create_user(self.cleaned_data['username'],
                                 self.cleaned_data['email'],
                                 self.cleaned_data['password1'],
                                 first_name= self.cleaned_data['first_name'],
                                 last_name= self.cleaned_data['last_name'])
#form login
class LoginForm(forms.Form):
    username = forms.CharField(max_length=30, widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Username',
            'name': 'username',
        }
    ))
    password = forms.CharField(widget=forms.PasswordInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Password',
            'name': 'password',

        }
    ))


class UpdateUserProfileForm(forms.Form):
    first_name = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'name': 'first_name',
        }
    ))
    last_name = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'name': 'last_name',
        }
    ))
    email = forms.EmailField(required=True, widget=forms.EmailInput(
        attrs={
            'class': 'form-control',
            'name': 'email',
        }
    ))

    website = forms.CharField(widget=forms.URLInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Website',
            'name': 'website',

        }
    ))
    description = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Description',
            'name': 'description',
        }
    ))
    phone = forms.CharField(widget=forms.TextInput(
        attrs={
            'class': 'form-control',
            'placeholder': 'Phone',
            'name': 'phone',
        }
    ))
    sex = forms.ChoiceField(choices=SEX_CHOICES, widget=forms.Select(
        attrs={
            'class': 'form-control',
            'name': 'sex',
        }
    ))

    birth_day = forms.DateField(widget=forms.DateInput(
        attrs={
            'class': 'form-control',
            'type': 'date',
            'name': 'birth_day',
        }
    ))
    def save(self, id, user):
        User.objects.all().filter(id=id).update(first_name=self.cleaned_data['first_name'],
                                                last_name=self.cleaned_data['last_name'],
                                                email=self.cleaned_data['email'])

        if UserProfile.objects.all().filter(user=user).exists() == False:
            UserProfile.objects.create(user=user,
                                       website=self.cleaned_data['website'],
                                       description=self.cleaned_data['description'],
                                       phone=self.cleaned_data['phone'],
                                       sex=self.cleaned_data['sex'],
                                       birth_day=self.cleaned_data['birth_day'])
        else:
            UserProfile.objects.all().filter(user=user).update(website=self.cleaned_data['website'],
                                                               description=self.cleaned_data['description'],
                                                               phone=self.cleaned_data['phone'],
                                                               sex=self.cleaned_data['sex'],
                                                               birth_day=self.cleaned_data['birth_day'])


class UploadProfilePhotoForm(forms.Form):
    image = forms.ImageField()


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ('caption', )
        labels = {
            'caption': 'Caption'
        }
        widgets = {
            'caption': forms.Textarea(attrs={
                'class': 'form-control',
                'placeholder': '''What's on your mind ?''',
                'rows': 3,
                }
            )
        }


ImageFormset = modelformset_factory(
    Image,
    fields=('photo', ),
    min_num=1,
    max_num=20,
    extra=0,
    widgets={
        'photo': forms.FileInput(
            attrs={
                'class': 'form-control',
                'type': 'file',
                'name': 'photo'
            }
        )
    }
)