from django.db import models
from django import forms
from django.contrib.auth.models import User
from django.db.models.fields.related import OneToOneField

# Create your models here.


class Game(models.Model):
    GENRES = [
        ('Action', 'Action'),
        ('Role-Playing', 'Role-Playing'),
        ('Strategy', 'Strategy'),
        ('Adventure', 'Adventure'),
        ('Causal', 'Causal'),
        ('Simulation', 'Simulation'),
        ('Sports', 'Sports'),
    ]
    PLATFORMS = [
        ('Steam', 'Steam'),
        ('PlayStation', 'PlayStation'),
        ('Xbox', 'Xbox'),
        ('Nintendo', 'Nintendo'),
    ]
    THEMES = [
        ('Anime', 'Anime'),
        ('Horror', 'Horror'),
        ('Mystery', 'Mystery'),
        ('Open World', 'Open World'),
        ('Sci-Fi', 'Sci-Fi'),
        ('Space', 'Space'),
        ('Survival', 'Survival'),
    ]
    name = models.CharField(max_length=50)
    platform = models.CharField(max_length=50, choices=PLATFORMS)
    publisher = models.CharField(max_length=50)
    date = models.DateField()
    genre = models.CharField(max_length=50, choices=GENRES)
    theme = models.CharField(max_length=50, choices=THEMES)
    image = models.ImageField(upload_to='game_images/', default='game_images/IMG_2337.JPG', blank=True)

    REQUIRED_FIELDS = ['name','platform','model','publisher','date', 'genre', 'theme']


class Profile(models.Model):
    REGION_CHOICES = [
        ('Asia', 'Asia'),
        ('North America', 'North America'),
        ('Europe', 'Europe'),
        ('Africa', 'Africa'),
    ]
    user = OneToOneField(User, on_delete=models.CASCADE)
    region = models.CharField(max_length=50, choices=REGION_CHOICES)
    gender = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to='user_images/', default='user_images/image0.jpg', blank=True)

    REQUIRED_FIELDS = ['region', 'gender']
    # last_modified = models.DateTimeField(auto_now=True)
    # xbox_link = models.BooleanField()
    # ps_link = models.BooleanField()
    # nin_link = models.BooleanField()
    # steam_link = models.BooleanField()

# class GameLog(models.Model):
#     user = models.ForeignKey(User, on_delete=models.PROTECT)
#     game = models.ForeignKey(Game, on_delete=models.PROTECT)
#     hour = models.FloatField()
#     cost = models.FloatField()


# class CustomizeUserCreationForm(UserCreationForm):
#     region = forms.CharField(max_length=50)
#     gender = forms.CharField(max_length=50)
#     fname = forms.CharField(max_length=50)
#     lname = forms.CharField(max_length=50)
#     email = forms.CharField(max_length=100)

#     class Meta(UserCreationForm.Meta):
#         model = GameUser
    
#     def save(self, commit=True):
#         if not commit:
#             raise NotImplementedError("Can't create profile")
#         user = super(UserCreationForm, self).save(commit=True)
#         game_user = GameUser(user=user, region=self.cleaned_data['region'], gender=self.cleaned_data['gender'])
#         game_user.save()
#         return user, game_user