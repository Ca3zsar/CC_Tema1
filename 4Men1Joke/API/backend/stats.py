from datetime import timedelta
from datetime import datetime
import json
from time import strftime
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from firebase_admin import db

@csrf_exempt
def most_liked(request):
    if request.method == 'GET':
        response_data = {}
        ref = db.reference('/reacts')
        today = str((datetime.utcnow() + timedelta(hours=3)).strftime("%Y-%m-%d"))
        reacts = ref.order_by_child('date').equal_to(today).get()

        laughs = {}
        
        for react in list(reacts.values()):
            if react["reaction"] == 'laugh':
                if laughs.get(react['post-id'],''):
                    laughs[react['post-id']] += 1
                else:
                    laughs[react['post-id']] = 1
        top_posts = sorted(list(laughs.keys()), key=lambda x: laughs[x], reverse=True)[:5]
        top_posts_contents = []
        for post in top_posts:
            joke = db.reference('/jokes/' + post).get()
            top_posts_contents.append({
                "author" : joke["author"],
                "content" : joke["content"],
                "photo_url" : joke["photo_url"],
            })

        response_data["posts"] = top_posts_contents
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)