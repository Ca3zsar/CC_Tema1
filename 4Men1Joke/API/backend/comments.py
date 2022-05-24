import json

import jwt
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from firebase_admin import db

from datetime import date

@csrf_exempt
def comment(request, joke_id):
    if request.method == 'POST':
        response_data = {}
        info = json.loads(request.body)

        username = info.get("username", "")
        comment = info.get("comment", "")

        if joke_id == "" or comment == "" or username == "":
            return HttpResponse("Fields joke_id, comment and username must exist!", status=400)

        my_json = {
            "joke_id": joke_id,
            "username": username,
            "comment": comment,
            "createdAt": str(date.today()),
        }

        ref = db.reference('/comments')
        ref.push().set(my_json)

        response_data = {"message": f"Comment successfully created!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)

    elif request.method == 'GET':
        response_data = {}
        ref = db.reference('/comments')
        comments = ref.get()

        #iterate through all comments and check if joke_id matches
        for comment in comments:
            if comments[comment]['joke_id'] == joke_id:
                response_data[comment] = comments[comment]
        
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def comments_by_username(request, username):
    # get comments by username along with joke
    if request.method == 'GET':
        response_data = {}
        ref = db.reference('/comments')
        comments = ref.get()

        #iterate through all comments and check if username matches
        for comment in comments:
            if comments[comment]['username'] == username:
                joke_content = db.reference('/jokes/' + comments[comment]['joke_id']).get()
                comments[comment]['joke'] = joke_content
                response_data[comment] = comments[comment]
        
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)