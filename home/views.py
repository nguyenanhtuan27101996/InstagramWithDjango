from django.shortcuts import render, redirect
from .forms import RegistationForm, LoginForm, UpdateUserProfileForm, UploadProfilePhotoForm,\
    PostForm, ImageFormset
from django.contrib import auth
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.decorators import login_required
from .models import User, UserProfile, Post, Image, Comment, Like, UserFollow
from el_pagination.decorators import page_template
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
# Create your views here.


def show_index_page(request):
    return render(request, 'pages/index.html')


@login_required(login_url='/accounts/login/')
@page_template('pages/home_list_page.html')
def show_home_page(request, template='pages/home.html', extra_context=None):

    #load user_profile to display in home page
    user_profile = UserProfile.objects.get(user=request.user)

    #load and solve create post and upload image of post
    if request.method == 'GET':
        post_form = PostForm(request.GET or None)
        formset = ImageFormset(queryset=Image.objects.none())
    elif request.method == 'POST':
        post_form = PostForm(request.POST)
        formset = ImageFormset(request.POST, request.FILES, queryset=Image.objects.none())

        if post_form.is_valid() and formset.is_valid():
            post = post_form.save(commit=False)
            post.user = request.user
            post.save()

            for form in formset.cleaned_data:
                photo = form['photo']
                image_book = Image(post=post, photo=photo)
                image_book.save()
            return redirect(request.path)

    #load post and image of post to home page
    list_image = []
    list_comment = []
    list_like = []
    post = Post.objects.all().order_by('-time_posted')

    for p in post:
        image = Image.objects.all().filter(post=p)
        comment = Comment.objects.all().filter(post=p).order_by('-time_commented')
        like = Like.objects.all().filter(post=p)
        list_image.append(image)
        list_comment.append(comment)
        list_like.append(like)

    users_followed_by_request_user = UserFollow.objects.filter(
        follower_user=request.user).order_by('-followed_user')
    users_following_request_user = UserFollow.objects.filter(
        followed_user=request.user)

    list_post = []
    for user_followed_by_request_user in users_followed_by_request_user:
        post = Post.objects.order_by('-time_posted').filter(user=user_followed_by_request_user.followed_user)[:1]
        list_post.append(post)

    context = {
        'user_profile': user_profile,
        'post_form': post_form,
        'formset': formset,
        'list_image': list_image,
        'list_comment': list_comment,
        'list_like': list_like,
        'users_followed_by_request_user': users_followed_by_request_user,
        'users_following_request_user': users_following_request_user,
        'list_post': list_post,
    }
    if extra_context is not None:
        context.update(extra_context)

    return render(request, template, context)



@csrf_exempt
def create_comment(request):
    id_post = request.POST.get('id', False)
    body_comment = request.POST.get('comment', False)
    post = Post.objects.get(id=id_post)
    comment = Comment(user=request.user, post=post, body=body_comment)
    comment.save()
    data = {
        'user_comment': comment.user.username,
        'body_comment': comment.body,
        'id_comment': comment.id,
    }
    return JsonResponse(data)


@csrf_exempt
def search_user_by_username(request):
    search_text = request.POST['search_text']
    if search_text != '':
        user = User.objects.filter(username__contains=search_text)
    else:
        user = None
    return render(request, 'pages/ajax_search_username.html', {'user_has_been_found': user})


@csrf_exempt
def solve_user_hit_like(request):
    id_post = request.POST.get('id', False)
    username_hit_like = request.POST.get('username_hit_like', False)
    post = Post.objects.get(id=id_post)
    user = User.objects.get(username=username_hit_like)

    data = {}
    like = Like.objects.filter(user=user, post=post)

    if like.exists():
        like.delete()
        data['is_valid'] = False
        data['sum_like'] = Like.objects.all().filter(post=post).count()
    else:
        like = Like(user=user, post=post)
        like.save()
        data['is_valid'] = True
        data['sum_like'] = Like.objects.all().filter(post=post).count()

    return JsonResponse(data)


@csrf_exempt
def follow_user(request):
    follower_username = request.POST.get('follower_username', False)
    followed_username = request.POST.get('followed_username', False)

    follower_user = User.objects.get(username=follower_username)
    followed_user = User.objects.get(username=followed_username)
    data = {}
    user_follow = UserFollow.objects.filter(follower_user=follower_user, followed_user=followed_user)

    if user_follow.exists():
        user_follow.delete()
        count_follower_of_user = UserFollow.objects.filter(followed_user=followed_user).count()
        data['is_valid'] = False
        data['count_follower_of_user'] = count_follower_of_user
    else:
        user_follow = UserFollow(follower_user=follower_user, followed_user=followed_user)
        user_follow.save()
        count_follower_of_user = UserFollow.objects.filter(followed_user=followed_user).count()
        data['is_valid'] = True
        data['count_follower_of_user'] = count_follower_of_user

    return JsonResponse(data)


@csrf_exempt
def update_caption_of_post(request):
    id_post = request.POST.get('id', False)
    new_caption = request.POST.get('caption', False)
    post = Post.objects.get(id=id_post)
    post.caption = new_caption
    post.save()

    data = {
        'new_caption': post.caption,
    }
    return JsonResponse(data)


@csrf_exempt
def update_comment_of_post(request):
    id_comment = request.POST.get('id', False)
    new_body_comment = request.POST.get('body', False)
    comment = Comment.objects.get(id=id_comment)
    comment.body = new_body_comment
    comment.save()

    data = {
        'new_comment': comment.body
    }
    return JsonResponse(data)


@csrf_exempt
def delete_comment_of_post(request):
    id_comment = request.POST.get('id', False)
    comment = Comment.objects.get(id=id_comment)
    data = {}
    if comment.delete():
        data['is_valid'] = True
    else:
        data['is_valid'] = False

    return JsonResponse(data)


@csrf_exempt
def delete_post(request):
    id_post = request.POST.get('id', False)
    post = Post.objects.get(id=id_post)
    data = {}
    if post.delete():
        data['is_valid'] = True
    else:
        data['is_valid'] = False

    return JsonResponse(data)


def signup_account(request):
    form = RegistationForm()
    if request.method == 'POST':
        form = RegistationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('/accounts/login/')
    return render(request, 'pages/sign_up.html', {'form': form})


def login_account(request):
    form = LoginForm()
    if request.method == 'POST':
        user = auth.authenticate(username=request.POST['username'],
                                 password=request.POST['password'])
        if user is not None:
            auth.login(request, user)
            return redirect('/home/')
        else:
            return render(request, 'pages/login.html',
                          {'errors': 'Sorry, your password was incorrect.Please double-check your password.',
                           'form': form})
    return render(request, 'pages/login.html', {'form': form})


@login_required(login_url='/accounts/login/')
@page_template('pages/personal_list_page.html')
def show_personal_page(request, username, template='pages/personal_page.html', extra_context=None):
    user = User.objects.get(username=username)
    user_profile = UserProfile.objects.all().filter(user=user).first()

    if request.method == 'POST':
        form_change_avatar = UploadProfilePhotoForm(request.POST, request.FILES)
        if form_change_avatar.is_valid():
            user_profile = UserProfile.objects.get(user=request.user)
            user_profile.avatar = form_change_avatar.cleaned_data['image']
            user_profile.save()
            redirect(request.path)


    #load post of this user to personal page
    post = Post.objects.all().filter(user=user).order_by('-time_posted')
    list_image = []
    count_post_of_user = Post.objects.all().filter(user=user).count();
    user_follow = UserFollow.objects.filter(follower_user=request.user, followed_user=user).first()

    #comment bang tieng viet vi kho
    #count_follower la dem so nguoi dang theo doi user nay
    #dem xem userfollow nay co was followed by others user bao nhieu lan
    count_follower = UserFollow.objects.filter(followed_user=user).count()
    #cout_following la dem so nguoi user nay dang theo doi
    #dem xem user nay la nguoi di follow (follower) bao nhieu lan
    count_following = UserFollow.objects.filter(follower_user=user).count()
    for p in post:
        image = Image.objects.all().filter(post=p)
        list_image.append(image)
    context = {
        'user_profile': user_profile,
        'list_image': list_image,
        'count_post_of_user': count_post_of_user,
        'user_follow': user_follow,
        'count_follower': count_follower,
        'count_following': count_following,
    }
    if extra_context is not None:
        context.update(extra_context)

    return render(request, template, context)


@login_required(login_url='/accounts/login/')
def show_post_by_id(request, id):
    post = Post.objects.get(id=id)
    user = User.objects.get(id=post.user.id)
    user_profile = UserProfile.objects.get(user=user)
    images = Image.objects.all().filter(post=post)
    comments = Comment.objects.all().filter(post=post).order_by('-time_commented')
    likes = Like.objects.all().filter(post=post)
    return render(request, 'pages/post_detail.html', {'post': post,
                                                      'images': images,
                                                      'comments': comments,
                                                      'user_profile': user_profile,
                                                      'likes': likes,
                                                      })


@login_required(login_url='/accounts/login/')
def show_personal_setting(request, username):
    user = User.objects.get(username=username)
    user_profile = UserProfile.objects.all().filter(user=user).first()

    form = UpdateUserProfileForm()
    if request.method == 'POST':
        form = UpdateUserProfileForm(request.POST)
        if form.is_valid():
            form.save(request.user.id, request.user)
            return redirect(request.path)

    if request.method == 'POST':
        form_change_password = PasswordChangeForm(data=request.POST, user=request.user)
        if form_change_password.is_valid():
            user = form_change_password.save()
            update_session_auth_hash(request, user)
            return redirect(request.path)
        else:
            return render(request, 'pages/personal_setting.html', {'user_profile': user_profile,
                                                                   'form': form,
                                                                   'form_change_password': form_change_password,
                                                                   'errors': 'errors now'})
    else:
        form_change_password = PasswordChangeForm(user=request.user)

    return render(request, 'pages/personal_setting.html', {'user_profile': user_profile,
                                                           'form': form,
                                                           'form_change_password': form_change_password})



