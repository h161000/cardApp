from django.urls import path

from . import api_views

urlpatterns = [
    path("", api_views.CardListCreateAPIView.as_view(), name="list_create"),
    path("<int:pk>/", api_views.CardDetailAPIView.as_view(), name="detail"),
    path(
        "delete-selected/",
        api_views.DeleteSelectedCardsAPIView.as_view(),
        name="delete_selected",
    ),
]
