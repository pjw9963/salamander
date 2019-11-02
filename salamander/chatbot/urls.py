from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('sendmsg', views.sendmsg, name='sendmsg'),
    path('get_movies', views.get_movies, name="get_movies")
]