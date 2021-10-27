from django.core.files.storage import FileSystemStorage
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
from django.template import loader, RequestContext
from datetime import datetime
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from gamelog.settings import MEDIA_ROOT
from .models import *
from .forms import ImgUploadForm, GameImgUploadForm
from django.db.models import Q
# Create your views here.

def search(request):
    if request.method == "GET":
        if request.is_ajax():
            game_name = request.GET.get('name')
            # temporary game list function for platform
            if game_name == 'all':
                platform = request.GET.get('platform')
                game_list = Game.objects.filter(platform=platform).values()
            # search by name
            elif game_name:
                game_list = Game.objects.filter(name=game_name).values()
            else:
            # search by plat, genre, theme, or name
                game_platform = request.GET.get('platform')
                game_genre = request.GET.get('genre')
                game_theme = request.GET.get('theme')
                game_list = Game.objects.filter(
                    Q(platform=game_platform) | Q(genre=game_genre) | Q(theme=game_theme)).values()
            if not game_list:
                return render(request, 'logapp/game_list_results.html', {'error': 'Not found.'})
            response = {
                'game_list': list(game_list),
            }
            # return JsonResponse(response)
            return render(request, 'logapp/game_list_results.html', response)
            
# 
def index(request):
    steam_games = Game.objects.filter(platform='Steam')[:4]
    nintendo_games = Game.objects.filter(platform='Nintendo')[:4]
    ps_games = Game.objects.filter(platform='PlayStation')[:4]
    xbox_games = Game.objects.filter(platform='Xbox')[:4]
    context = {
        "steam_games": steam_games,
        "nintendo_games": nintendo_games,
        "ps_games": ps_games,
        "xbox_games":xbox_games,
    }
    return render(request, 'logapp/index.html', context)

@login_required(login_url='/logapp/login')
def games(request):
    slides = Game.objects.all()[:4]
    games = Game.objects.all()
    context = {
        "slides": slides,
        "games": games,
        "form": GameImgUploadForm(),
    }
    return render(request, 'logapp/games.html', context)

@login_required(login_url='/logapp/login')
def game(request, game_plat, game_id):
    game = Game.objects.get(pk=game_id)
    context = {
        'game': game,
    }
    return render(request, 'logapp/game.html', context)

def add_game(request):
    if request.method == "POST":
        if request.is_ajax():
            form = GameImgUploadForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                response = {
                    'msg': "Game Added!"
                }
                return JsonResponse(response)

@login_required(login_url='/logapp/login')
def account(request):
    if request.user.is_authenticated:
        context = {
            'username': request.user.username,
            'region': request.user.profile.region,
            'email': request.user.email,
            'fname': request.user.first_name,
            'lname': request.user.last_name,
            'gender': request.user.profile.gender,
            'avatar': request.user.profile.avatar,
            'form': ImgUploadForm(),
        }
        return render(request, 'logapp/account.html', context)
        

def update_profile(request):
    if request.method == "POST":
        if request.is_ajax():
            region = request.POST.get('region', '')
            email = request.POST.get('email', '')
            fname = request.POST.get('fname', '')
            lname = request.POST.get('lname', '')
            response = {
                'region': region,
                'email': email,
                'fname': fname,
                'lname': lname,
            }
            user = request.user
            user.profile.region = region
            user.email = email
            user.first_name = fname
            user.last_name = lname
            user.save()
            user.profile.save()
            return JsonResponse(response)
        else:
            form = ImgUploadForm(request.POST, request.FILES)
            if form.is_valid():
                request.user.profile.avatar = form.cleaned_data['avatar']
                request.user.profile.save()
                return redirect('/logapp/account/')

@login_required(login_url='/logapp/login')
def dashboard(request):
    return render(request, 'logapp/dashboard.html')

def logout_view(request):
    logout(request)
    return redirect('/logapp/')

def login_view(request):
    username = request.POST.get('login_username', '')
    password = request.POST.get('login_password', '')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return redirect('/logapp/')
    else:
        response = {
            'msg': "Invalid Username or Password."
        }
        return render(request, 'logapp/login.html', response)

def signup(request):
    if request.user.is_authenticated:
        return redirect('/logapp/')
    if request.method == "POST":
        region = request.POST['create_region']
        gender = request.POST['create_gender']
        fname = request.POST['create_fname']
        lname = request.POST['create_lname']
        email = request.POST['create_email']
        username = request.POST['create_username']
        password = request.POST['create_password']
        user = User(username=username, email=email, first_name=fname, last_name=lname, is_staff=True, is_superuser=True)
        user.set_password(password)
        user.save()
        profile = Profile(user=user,region=region, gender=gender)
        profile.save()
        return redirect('/logapp/login/')
    else:
        return render(request, 'logapp/signup.html')