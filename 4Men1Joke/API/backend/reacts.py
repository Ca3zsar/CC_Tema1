import json
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import db

@csrf_exempt
def get_reacts(request, username):
    if request.method == 'GET':
        response_data = {}
        

        ref = db.reference('/reacts')
        reacts = ref.order_by_child("username").equal_to(username).get()

        if reacts is None:
            return HttpResponse("Reacts not found", status=404)

        response_data["reacts"] = reacts
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)