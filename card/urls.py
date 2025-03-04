from django.urls import path
from . import views

app_name = "card"

urlpatterns = [
    path("", views.CardListView.as_view() ,name="list"),
    path("create/", views.CardCreateView.as_view(), name="create"),
    path("update/<int:pk>/", views.CardUpdateView.as_view(), name="update"),
    path('delete-selected/', views.DeleteSelectedView.as_view(), name='delete_selected'),
]