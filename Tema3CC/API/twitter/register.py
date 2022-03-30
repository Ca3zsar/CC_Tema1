import json

import jwt
from django.views.decorators.csrf import csrf_exempt
from .models import Account
from django.http import HttpResponse

@csrf_exempt
def register(request):
    if request.method == 'POST':
        response_data = {}
        info = json.loads(request.body)
        username = info.get("username", "")
        password = info.get("password", "")
        email = info.get("email", "")

        if username == "" or password == "" or email == "":
            return HttpResponse("Fields username, password and email must exist!", status=400)

        try:
            account = Account(username=username, password=password, email=email)
            name = Account.objects.filter(username=f'{username}')
            if name:
                response_data["message"] = "There is a business rule that prevents you from creating that resource"
                response_data["reason"] = "name"
                return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)
            email = Account.objects.filter(email=f'{email}')
            if email:
                response_data["message"] = "There is a business rule that prevents you from creating that resource"
                response_data["reason"] = "email"
                return HttpResponse(json.dumps(response_data), content_type="application/json", status=409)

            account.save()
        except Exception as e:
            return HttpResponse(f"Error: {e}", status=500)

        response_data = {"message": f"Account successfully created!"}
        username = info.get("username", "")
        email = info.get("email", "")

        jwt_token = jwt.encode({'username': username, 'email' : email}, 'secret', algorithm='HS256')
        response_data["token"] = jwt_token.decode('utf-8')
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)
    else:
        return HttpResponse("Method not allowed", status=405)
