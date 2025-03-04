from .models import Card
from django import forms


class CardCreateForm(forms.ModelForm):
    class Meta:
        model = Card
        fields = ["title", "description"]