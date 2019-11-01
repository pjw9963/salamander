from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'chatbot/index.html')

@csrf_exempt
def sendmsg(request):
    #Reject anything that's not a POST request
    if request.method != "POST":
        errMsg = {
            "error": "bruh"
        }
        return JsonResponse(errMsg)
    #Handle message
    msg = request.POST["msg"]
    print(msg)
    data = {
        "response": "bruh"
    }
    return JsonResponse(data)