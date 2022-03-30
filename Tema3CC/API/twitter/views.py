from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import psycopg2
from .models import Account

from django.http import HttpResponse


def index(request):
    return HttpResponse("Hello, world. You're at the Twitter API index.", status=200)

