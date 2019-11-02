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
                "Select *, sum / total as 'result' From chatbot_movie WHERE result = " + str(request.GET["stress"]) + " LIMIT 8"):
            results[m.id] = m.name
    return JsonResponse(results)


def newMessage(request):
    return JsonResponse(request.GET["message"])


def updateModel(request):
    movie_id = str(request.GET["id"])
    vote = int(request.GET["value"])
    the_movie = movie.objects.get(id=movie_id)
    current_sum = int(the_movie.sum)
    current_sum += vote
    the_movie.sum = current_sum
    the_movie.total += 1
    the_movie.save()
    return JsonResponse({'id' : movie_id, 'value': vote})


@csrf_exempt
def sendmsg(request):
    # Reject anything that's not a POST request
    if request.method != "POST":
        errMsg = {
            "error": "Invalid method used."
        }
        return JsonResponse(errMsg)
    # Handle message
    msg = request.POST["msg"]
    print(msg)
    data = {
        "response": f"echo: {msg}"
    }
    return JsonResponse(data)