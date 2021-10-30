from django import forms
from django.db.models import fields
from django.db.models.base import Model

from .models import Game, Profile

class ImgUploadForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ('avatar', )

class GameAddForm(forms.ModelForm):
    class Meta:
        model = Game
        fields = ('name', 'platform', 'publisher', 'date', 'genre', 'theme', 'image', )

class SearchByNameForm(forms.Form):
    search_name = forms.CharField(max_length=50, label='Name', required=False)

PLATFORMS = (
    ('', ''),
    ('Steam', 'Steam'),
    ('PlayStation', 'PlayStation'),
    ('Xbox', 'Xbox'),
    ('Nintendo', 'Nintendo'),
)

GENRES = (
    ('', ''),
    ('Action', 'Action'),
    ('Role-Playing', 'Role-Playing'),
    ('Strategy', 'Strategy'),
    ('Adventure', 'Adventure'),
    ('Causal', 'Causal'),
    ('Simulation', 'Simulation'),
    ('Sports', 'Sports'),
)

THEMES = (
    ('', ''),
    ('Anime', 'Anime'),
    ('Horror', 'Horror'),
    ('Mystery', 'Mystery'),
    ('Open World', 'Open World'),
    ('Sci-Fi', 'Sci-Fi'),
    ('Space', 'Space'),
    ('Survival', 'Survival'),
)

class SearchByOtherForm(forms.Form):
    search_platform = forms.ChoiceField(choices=PLATFORMS, label='Platform', required=False)
    search_genre = forms.ChoiceField(choices=GENRES, label='Genre', required=False)
    search_theme = forms.ChoiceField(choices=THEMES, label='Theme', required=False)