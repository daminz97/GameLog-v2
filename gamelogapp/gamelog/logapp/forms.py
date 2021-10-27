from django import forms
from django.db.models import fields

from .models import Game, Profile

class ImgUploadForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('avatar', )

class GameImgUploadForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = ('name', 'platform', 'publisher', 'date', 'genre', 'theme', 'image', )