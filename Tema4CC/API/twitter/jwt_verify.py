import jwt
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
import json


@csrf_exempt
def check_jwt(request):
    if request.method == 'POST':
        try:
            info = json.loads(request.body)
            token = info.get('token', "")
        except:
            return HttpResponse(json.dumps({'status': 'error', 'message': 'Invalid json'}), content_type='application/json', status=400)

        if not token:
            return HttpResponse(json.dumps({'error': 'No token'}), content_type="application/json", status=400)

        try:
            decoded = jwt.decode(token, 'secret', algorithms=['HS256'])
            return HttpResponse(json.dumps(decoded), content_type='application/json', status=200)
        except jwt.ExpiredSignatureError:
            return HttpResponse(json.dumps({'error': 'token_expired'}), content_type='application/json', status=401)
        except jwt.InvalidTokenError:
            return HttpResponse(json.dumps({'error': 'invalid_token'}), content_type='application/json', status=401)
