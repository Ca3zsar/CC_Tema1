import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from . import tweet_aux
@csrf_exempt
def tweet(request):
    if request.method == 'POST':
        info = json.loads(request.body)

        hashtag = info.get("hashtag", "")
        if hashtag == "":
            return HttpResponse("hashtag empty", status=400)

        print(hashtag)

        tweets = tweet_aux.getTweetsByHashtag(hashtag)

        return HttpResponse(json.dumps(tweets), content_type="application/json")
    else:
        return HttpResponse("Method not allowed", status=405)