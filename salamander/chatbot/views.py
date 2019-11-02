import json

from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Movie as movie


def index(request):
    return render(request, 'chatbot/index.html')


def get_movies(request):
    results = {}
    if request.method == "GET":
        for m in movie.objects.raw(
                "Select *, sum / total as 'result' From chatbot_movie WHERE result = " + str(request.GET["stress"]) + " LIMIT 5"):
            results[m.id] = m.name
    return JsonResponse(results)

@csrf_exempt
def sendmsg(request):
    #Reject anything that's not a POST request
    if request.method != "POST":
        errMsg = {
            "error": "Invalid method used."
        }
        return JsonResponse(errMsg)
    #Handle message
    msg = request.POST["msg"]
    print(msg)
    data = {
        "response": f"echo: {msg}"
    }
    return JsonResponse(data)