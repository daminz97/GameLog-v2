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
    path('account/new_profile/', views.new_profile, name='new_profile'),

    path('dashboard/', views.dashboard, name='dashboard'),
    path('dashboard/new_budget/', views.update_budget, name='new_budget'),
    path('dashboard/new_time_budget/', views.update_time_budget, name='new_time_budget'),
    
    path('login/', views.login_view, name='login'),
    path('login/if_exists/', views.if_exists, name='if_exists'),
    path('login/if_match/', views.if_match, name='if_match'),
    path('login/not_old_password/', views.not_old_password, name='not_old_password'),
    path('login/new_password/', views.change_password, name='new_password'),

    path('signup/', views.signup, name='signup'),
    path('logout/', views.logout_view, name='logout'),

    path('games/', views.games, name='games'),
    path('games/new_game/', views.new_game, name='new_game'),
    path('games/<str:game_plat>/<int:game_id>/', views.game, name='game_detail'),
    path('games/<str:game_plat>/<int:game_id>/steam_price/', views.external_steam, name='steam_price'),
    path('search_results/', views.search, name='search_results'),
]
