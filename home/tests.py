from django.test import TestCase
from .models import UserProfile, User, Post
# Create your tests here.


class UserTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='DSK',
                            email='dsk@gmail.com',
                            first_name='Nguyen Binh',
                            last_name='Minh')
        self.user.set_password('123456789')
        self.user.save()

        self.post = Post.objects.create(user=self.user,caption='Hello world')
        self.post.save()

    def test_string(self):
        user = User(username='DSK')
        self.assertEqual(str(user), user.username)

    def test_show_index_page(self):
        response = self.client.get('')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/index.html')

    def test_signup_page(self):
        response = self.client.get('/accounts/signup/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/sign_up.html')

    def test_login_page(self):
        response = self.client.get('/accounts/login/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/login.html')

    def test_show_home_page(self):
        self.client.force_login(self.user)
        response = self.client.get('/home/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/home.html')

    def test_show_personal_page(self):
        self.client.force_login(self.user)
        response = self.client.get('/'+self.user.username+'/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/personal_page.html')

    def test_show_personal_setting_page(self):
        self.client.force_login(self.user)
        response = self.client.get('/accounts/setting/' + self.user.username + '/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'pages/personal_setting.html')

