import json

from django.views.decorators.csrf import csrf_exempt
from .models import Account
from django.http import HttpResponse

from firebase_admin import db

@csrf_exempt
def codeVerification(request):

    if request.method == 'POST':
        response_data = {}
        info = json.loads(request.body)
        verification_code = info.get("verification_code", "")
        username = info.get("username","")
        if verification_code == "" or username == "":
            return HttpResponse("Fields verification_code and jwt_token must exist!", status=400)


        ref = db.reference('/users')
        ref1 = db.reference('/verification')

        #find user_id
        entry = ref.order_by_child('username').equal_to(username).get()
        dict_entry = dict(entry)
        user_id = list(dict_entry.keys())[0]

        #find verification_code id
        entry = ref1.order_by_child('username').equal_to(username).get()
        dict_entry = dict(entry)
        key = list(dict_entry.keys())[0]

        if len(dict_entry.keys()) == 0:
            response_data["message"] = "Credentials are not valid"
            response_data["reason"] = "username"
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)

        if dict_entry[key]['verification_code'] != verification_code:
            response_data["message"] = "Credentials are not valid"
            response_data["reason"] = "verification_code"
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)

        #update verified
        ref = db.reference('/users/' + user_id)
        ref.update({'isVerified': 1})

        #delete verification code
        ref1 = db.reference('/verification/' + key)
        ref1.delete()

        response_data["response"] = "Verification code is correct. You can now access your account!"
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)
    else:
        return HttpResponse("Method not allowed", status=405)