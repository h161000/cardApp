from django.urls import path
from django.views.generic import TemplateView

app_name = "card"

urlpatterns = [
    # HTMLビュー
    path("", TemplateView.as_view(template_name="card/list.html"), name="list"),
    path(
        "update/<int:id>/",
        TemplateView.as_view(template_name="card/edit.html"),
        name="edit",
    ),
    path(
        "accounts/login/",
        TemplateView.as_view(template_name="accounts/login.html"),
        name="login",
    ),
]
