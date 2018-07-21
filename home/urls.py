from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
urlpatterns = [
    path('', views.show_index_page, name='index'),
    path('home/', views.show_home_page, name='home'),
    path('accounts/signup/', views.signup_account, name='sign_up'),
    path('accounts/login/', views.login_account, name='login'),
    path('logout/', auth_views.logout, {'next_page': '/'}, name='logout'),
    path('<str:username>/', views.show_personal_page, name='personal_page'),
    path('accounts/setting/<str:username>/', views.show_personal_setting, name='personal_setting'),
    path('ajax/create-comment/', views.create_comment, name='create_comment'),
    path('post/<str:username>/<int:id>/', views.show_post_by_id, name='show_detail_post'),
    path('ajax/search-username/', views.search_user_by_username, name='search_by_username'),
    path('ajax/hit-like/', views.solve_user_hit_like, name='solve_user_hit_like'),
]
