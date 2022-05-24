from datetime import datetime, timezone, timedelta
import json
import jwt
import bcrypt

from django.views.decorators.csrf import csrf_exempt
from .models import Account
from django.http import HttpResponse


from firebase_admin import db

@csrf_exempt
def login(request):
    if request.method == 'POST':
        response_data = {}
        info = json.loads(request.body)
        username = info.get("username", "")
        password = info.get("password", "")

        if username == "" or password == "":
            return HttpResponse("Fields username and password must exist!", status=400)

        ref = db.reference('/users')

        entry = ref.order_by_child('username').equal_to(username).get()

        dict_entry = dict(entry)

        if len(dict_entry.keys()) == 0:
            response_data["message"] = "Credentials are not valid"
            response_data["reason"] = "name"
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)

        key = list(dict_entry.keys())[0]

        # print(password.encode('utf-8'), dict_entry[key]['password'].encode('utf-8'), bcrypt.checkpw(password.encode('utf-8'), dict_entry[key]['password'].encode('utf-8')), sep='\n')

        if not bcrypt.checkpw(password.encode(), dict_entry[key]['password'].encode()):
            response_data["message"] = "Credentials are not valid"
            response_data["reason"] = "password"
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=401)

        if dict_entry[key]['isVerified'] != 1:
            response_data["message"] = "Account is not verified"
            return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)

        email = dict_entry[key]['email']

        expiry_date = datetime.now(timezone(timedelta(hours=+9))) + timedelta(days=1) 
        jwt_token = jwt.encode({'username': username, 'email' : email, "exp" : expiry_date}, 'secret', algorithm='HS256')
        
        response_data["token"] = jwt_token.decode('utf-8')

        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)     
    else:
        return HttpResponse("Method not allowed", status=405)