from django.urls import path
from . import views
from django.views.generic.base import TemplateView
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.index, name='index'),
    # path('view/', views.login_view, name='login_view'),
    path('account/', views.account, name='account'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('login/', views.login_view, name='login'),
    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout_view, name='logout'),
    path('games/', views.games, name='games'),
    path('games/search_results', views.search, name='search_results'),
    path('games/<str:game_plat>/<int:game_id>', views.game, name='game_detail'),
    path('account/update_profile', views.update_profile, name='update_profile'),
    path('games/add_game', views.add_game, name='add_game'),
]
