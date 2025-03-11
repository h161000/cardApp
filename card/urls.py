from django.urls import path

from . import api_views, views

app_name = "card"

urlpatterns = [
    # HTMLビュー
    path("", views.CardListView.as_view(), name="list"),
    path("create/", views.CardCreateView.as_view(), name="create"),
    path("update/<int:pk>/", views.CardUpdateView.as_view(), name="update"),
    path(
        "delete-selected/", views.DeleteSelectedView.as_view(), name="delete_selected"
    ),
    # APIエンドポイント
    path("api/", api_views.CardListCreateAPIView.as_view(), name="api_list_create"),
    path("api/<int:pk>/", api_views.CardDetailAPIView.as_view(), name="api_detail"),
    path(
        "api/delete-selected/",
        api_views.DeleteSelectedCardsAPIView.as_view(),
        name="api_delete_selected",
    ),
]
