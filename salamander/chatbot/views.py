from django.http import HttpResponse
from django.shortcuts import render

from . import models as models


def index(request):
    print(models.Movie.objects)
    return render(request, 'chatbot/index.html')
