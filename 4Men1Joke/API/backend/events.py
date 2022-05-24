from datetime import datetime, timezone, timedelta
import json
from time import strftime
import jwt
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from firebase_admin import db
from . import utils


@csrf_exempt
def event(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        name = info.get("name", "")
        topic = info.get("topic", "")

        ref = db.reference('/events')
        jsonForEvents ={
            "name": name,
            "topic": topic,
            "entries": [],
            "onGoing": 1,
            "date": strftime("%Y-%m-%d %H:%M")
        }
        ref.push().set(jsonForEvents)
        entry = ref.order_by_child('name').equal_to(name).get()
        dict_entry = dict(entry)
        key = list(dict_entry.keys())[0]

        response_data = {"event_id": key}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)

@csrf_exempt
def endEvent(request):
    if request.method == 'PUT':

        ref = db.reference('/events')
        events = ref.get()
        for event in events:
            if events[event]['onGoing'] == 1:
                ref = db.reference('/events/'+event)
                ref.update({'onGoing': 0})
                response_data = {"message": f"Event successfully ended!"}
                return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

        response_data = {"message": f"There is not active event!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)

    else:
        return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def getEventById(request,event_id):
    if request.method == 'GET':

        ref = db.reference('/events')
        events = ref.get()

        if events == None:
            response_data = {"message": "This event does not exists"}
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=404)

        for event in events:
            if event == event_id:
                response_data = events[event]
                return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)


        response_data = {"message" : "This event does not exists"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=404)


@csrf_exempt
def getActiveEvents(request):
    if request.method == 'GET':

        ref = db.reference('/events')
        events = ref.get()

        for event in events:
            if events[event]['onGoing'] == 1:
                response_data = {"events": events[event]}
                return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)

        response_data = {"message" : "No active events at the moment", "events": []}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=404)
    else:
        return HttpResponse("Method not allowed", status=405)

@csrf_exempt
def postEntry(request):
    if request.method == 'POST':
        info = json.loads(request.body)
        name = info.get("name", "")
        comment = info.get("comment", "")

        if name == "" or comment == '':
            response_data = {"message": "Name and comment are required"}
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)

        ref = db.reference('/events')
        event = ref.order_by_child("name").equal_to(name).get()
        ref_entry = db.reference('/events/'+list(event.keys())[0])
        print(ref_entry.get())
        ref_entry.update(
            {
                "entries" : ref_entry.get().get("entries",[]) + [comment]
            }
        )

        if event == None:
            response_data = {"message": "This event does not exists"}
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=400)
        
        response_data = {"message":"entry successfully posted"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)


