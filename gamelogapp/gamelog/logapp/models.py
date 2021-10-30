from django.db import models
from django import forms
from django.contrib.auth.models import User
from django.db.models.fields.related import OneToOneField
import datetime

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

    def __str__(self):
        return self.name + ' on ' + self.platform


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

    def __str__(self):
        return 'Profile: ' + self.user.username

class Budget(models.Model):
    user = OneToOneField(User, on_delete=models.CASCADE)
    budget = models.FloatField(default=0.0)
    expense = models.FloatField(default=0.0)
    time_budget = models.FloatField(default=0.0)
    played_time = models.FloatField(default=0.0)

    REQUIRED_FIELDS = ['budget', 'expense', 'time_budget', 'played_time']

    def __str__(self):
        return 'Budget: ' + self.user.username

class Log(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    time = models.FloatField(default=0.0)
    cost = models.FloatField(default=0.0)
    log_time = models.DateField(default=datetime.date.today)

    REQUIRED_FIELDS = ['user', 'game', 'time', 'cost', 'log_time']

    def __str__(self):
        return 'Log: ' + self.user.username + ' on ' + self.game.name
