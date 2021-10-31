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
from .forms import *
import json
from django.db.models import Q
from django.conf.urls.static import static
import requests
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

@login_required(login_url='login')
def games(request):
    slides = Game.objects.all()[:4]
    games = Game.objects.all()
    context = {
        "slides": slides,
        "games": games,
        "search_by_other_form": SearchByOtherForm(),
        "search_by_name_form": SearchByNameForm(),
        "add_form": GameAddForm(),
    }
    return render(request, 'logapp/games.html', context)

@login_required(login_url='login')
def game(request, game_plat, game_id):
    game = Game.objects.get(pk=game_id)
    platform_icon = 'steam.svg'
    if game_plat == "PlayStation":
        platform_icon = 'playstation.svg'
    elif game_plat == "Xbox":
        platform_icon = 'xbox.svg'
    elif game_plat == "Nintendo":
        platform_icon = 'nintendo.svg'
    else:
        pass
    context = {
        'game': game,
        'game_id': game_id,
        'game_platform': game_plat,
        'game_name': game.name,
        'game_image': game.image,
        'platform_icon': platform_icon,
        # 'external': external,
    }
    return render(request, 'logapp/game.html', context)

def external_steam(request, game_plat, game_id):
    if request.method == 'GET':
        r = requests.get('https://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=2E393A2FEFED36E35872374C96C2D418&format=json')
        if r.status_code == 200:
            data = r.json()
            app_list = data['applist']['apps']
            price = 0
            steam_id= 0
            image_url = ''
            return JsonResponse(app_list[0]['name'], safe=False)
            for i in range(len(app_list)):
                if app_list[i]['name'] == request.GET.get('game_name'):
                    steam_id = app_list[i]['appid']
                    break
            game_info = requests.get('https://store.steampowered.com/api/appdetails?appids='+steam_id+'&cc=us&l=en').json()
            return JsonResponse(game_info, safe=False)
            if game_info.status_code == 200:
                price = game_info.json()[steam_id]['data']['price_overview']['final_formatted']
                image_url = game_info.json()[steam_id]['data']['header_image']
            
            game_url = 'https://store.steampowered.com/app/'+steam_id
            return JsonResponse({'game_url': game_url, 'price': price, 'image': image_url})


def new_game(request):
    if request.method == "POST":
        if request.is_ajax():
            form = GameAddForm(request.POST, request.FILES)
            if form.is_valid():
                form.save()
                response = {
                    'msg': "Game Added!"
                }
                return JsonResponse(response)

@login_required(login_url='login')
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
        

def new_profile(request):
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
                return redirect('account')

@login_required(login_url='login')
def dashboard(request):
    logs = Log.objects.filter(user=request.user)
    budget = Budget.objects.get(user=request.user)
    total_expenses = budget.expense
    steam_cost, xbox_cost, ps_cost, nin_cost = 0.0, 0.0, 0.0, 0.0
    month_time = {}
    for log in logs:
        if log.game.platform == 'Steam':
            steam_cost += log.cost
        elif log.game.platform == 'Xbox':
            xbox_cost += log.cost
        elif log.game.platform == 'PlayStation':
            ps_cost += log.cost
        else:
            nin_cost += log.cost
        month = log.log_time.strftime('%B')
        if month in month_time:
            month_time[month] += log.time
        else:
            month_time[month] = log.time
    exceed_budget = True if budget.expense>budget.budget else False
    exceed_time = True if budget.played_time>budget.time_budget else False
    context = {
        'costs': [
            {'platform': 'Steam', 'num': steam_cost, 'perct': round(100*steam_cost/total_expenses, 2)},
            {'platform': 'Xbox', 'num': xbox_cost, 'perct': round(100*xbox_cost/total_expenses, 2)},
            {'platform': 'PlayStation', 'num': ps_cost, 'perct': round(100*ps_cost/total_expenses, 2)},
            {'platform': 'Nintendo', 'num': nin_cost, 'perct': round(100*nin_cost/total_expenses, 2)},
        ],
        'total_cost': budget.expense,
        'for_time': True,
        'for_budget': True,
        'time_budget': budget.time_budget,
        'budget': budget.budget,
        'exceed_time': exceed_time,
        'exceed_budget': exceed_budget,
        'times': month_time,
    }
    return render(request, 'logapp/dashboard.html', context)

def update_time_budget(request):
    if request.method == 'POST' and request.is_ajax():
        time_budget = request.POST.get('new_time_budget')
        user_budget = Budget.objects.get(user=request.user)
        user_budget.time_budget = time_budget
        user_budget.save()
        exceed = True if user_budget.played_time>float(user_budget.time_budget) else False
        return render(request, 'logapp/exceed_update.html', {'for_time': True, 'exceed_time': exceed, 'time_budget': time_budget})

def update_budget(request):
    if request.method == 'POST' and request.is_ajax():
        budget = request.POST.get('new_budget')
        user_budget = request.user.budget
        user_budget.budget = budget
        user_budget.save()
        exceed = True if user_budget.expense>float(user_budget.budget) else False
        return render(request, 'logapp/exceed_update.html', {'for_budget': True, 'exceed_budget': exceed, 'budget': budget})

def logout_view(request):
    logout(request)
    return redirect('index')

def login_view(request):
    username = request.POST.get('login_username', '')
    password = request.POST.get('login_password', '')
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return redirect('index')
    else:
        response = {
            'msg': "Invalid Username or Password."
        }
        return render(request, 'logapp/login.html', response)

def signup(request):
    if request.user.is_authenticated:
        return redirect('index')
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
        return redirect('login')
    else:
        return render(request, 'logapp/signup.html')

def if_exists(request):
    if request.method == 'GET' and request.is_ajax():
        username = request.GET.get('keyin_username')
        if username != '':
            user = User.objects.filter(username=username).exists()
            if user:
                return JsonResponse({'msg': 'User exists.'})
            else:
                return JsonResponse({'msg': 'User not exists.'})
        return JsonResponse({'msg': ''})

def not_old_password(request):
    if request.method == 'GET' and request.is_ajax():
        keyin_username = request.GET.get('keyin_username')
        user = User.objects.get(username=keyin_username)
        keyin_password = request.GET.get('keyin_password')
        if user.check_password(keyin_password):
            return JsonResponse({'msg': 'Cannot be the old password.'})
        else:
            return JsonResponse({'msg':''})

def if_match(request):
    if request.method == 'GET' and request.is_ajax():
        password = request.GET.get('password')
        verify_pass = request.GET.get('verify_pass')
        if password != verify_pass:
            return JsonResponse({'msg': 'Passwords do not match.'})
        else:
            return JsonResponse({'msg': ''})

def change_password(request):
    if request.method == 'POST' and request.is_ajax():
        username = request.POST.get('username')
        password = request.POST.get('new_password')
        user = User.objects.get(username=username)
        if user.check_password(password):
            return JsonResponse({'msg': 'Cannot use the old password.'})
        else:
            user.set_password(password)
            user.save()
            return JsonResponse({'msg': 'Password Updated.'})


# def external_steam(request):
#     if request.method == 'POST':
#         url = 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
#         payload = {''}
