import json
import logging
from time import strftime

from datetime import datetime, timedelta, timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from google.cloud import storage
from firebase_admin import db

import jwt
from .settings import STORAGE_CREDS

def save_image_to_cloud_storage(image):
    # save image to cloud storage
    if STORAGE_CREDS:
        storage_client = storage.Client.from_service_account_info(json.loads(STORAGE_CREDS))
    else:
        storage_client = storage.Client.from_service_account_json(
        'cloud-storage1.json')
    bucket = storage_client.get_bucket('jokes-images')
    blob = bucket.blob(image.name)
    blob.upload_from_file(image)


@csrf_exempt
def jokes(request):
    if request.method == 'POST':
        response_data = {}
        info = request.POST
        author = info.get("author", "")
        content = info.get("content", "")
        image = request.FILES.get("image", "")
        tags = info.get("tags", "")
        title = info.get("title", "")
        
        if author == "" or content == "" or tags == "":
            return HttpResponse("Fields author, content and keys must exist!", status=400)
        if image:
            # add current date to image name to avoid overwriting
            image.name = datetime.now().strftime("%Y%m%d%H%M%S") + image.name
            save_image_to_cloud_storage(image)

        url_image = 'https://storage.googleapis.com/jokes-images/'
        image_url = url_image + image.name if image else ""
        my_json = {
            "author": author,
            "createdAt": str((datetime.utcnow() + timedelta(hours=3)).strftime("%Y-%m-%d %H:%M")),
            "content": content,
            "photo_url": image_url,
            "catOk_count": 0,
            "laugh_count": 0,
            "dislike_count": 0,
            "keys": tags.split(","),
            "title":title
        }

        ref = db.reference('/jokes')
        ref.push().set(my_json)

        response_data = {"message": f"Joke successfully created!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=201)     
    elif request.method == 'GET':
        response_data = {}
        ref = db.reference('/jokes')
        jokes = ref.get()
        response_data["jokes"] = jokes
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def get_jokes_by_username(request, username):
    if request.method == 'GET':
        response_data = {}
        ref = db.reference('/jokes')
        jokes = ref.order_by_child('author').equal_to(username).get()
        response_data["jokes"] = jokes
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def get_jokes_by_key(request, key):
    if request.method == 'GET':
        response_data = {}
        ref = db.reference('/jokes')
        jokes = ref.get()

        jsonArray = []
        for id in jokes:
            if key in jokes[id]["keys"]:
                jsonArray.append({ id : jokes[id] })

        response_data["jokes"] = jsonArray
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)

def update_vote(request, joke_id):
    if request.method == 'PUT':
        info = json.loads(request.body)
        vote = info.get("type", "")
        token = info.get("token", "")
        if vote == "" or token == "":
            return HttpResponse("Fields vote and token must exist!", status=400)
        
        try:
            user = jwt.decode(token, 'secret', algorithms=['HS256'])["username"]
        except jwt.exceptions.InvalidSignatureError:
            return HttpResponse("Invalid token", status=401)
        except jwt.exceptions.DecodeError:
            return HttpResponse("Invalid token", status=401)
        except jwt.exceptions.ExpiredSignatureError:
            return HttpResponse("Token expired", status=401)

        react_ref = db.reference('/reacts/')
        reactions = react_ref.order_by_child('username').equal_to(user).get()
        found = False

        for key,reaction in reactions.items():
            if reaction["post-id"] == joke_id:
                if vote == reaction["reaction"]:
                    react_ref = db.reference('/reacts/' + key)
                    react_ref.delete()
                    found = True

                    #decrement vote count from joke
                    joke_ref = db.reference('/jokes/' + joke_id)
                    joke_ref.update({
                        f"{vote}_count": joke_ref.get()[f"{vote}_count"] - 1
                    })
                    break
        
        if not found:
            react_ref = db.reference('/reacts/')
            react_ref.push().set({
                "username": user,
                "post-id": joke_id,
                "reaction": vote,
                "date" : strftime("%Y-%m-%d")
            })
            
            joke_ref = db.reference('/jokes/' + joke_id)
            joke_ref.update({
                f"{vote}_count": joke_ref.get()[f"{vote}_count"] + 1
            })

        response_data = {"message": f"Vote successfully updated!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    

@csrf_exempt
def delete_toxic_posts(request):
    if request.method == 'DELETE':
        response_data = {}
        ref = db.reference('/jokes')
        jokes = ref.get()

        for id in jokes:
            if jokes[id]["dislike_count"] > 2 * jokes[id]["laugh_count"]:
                ref.child(id).delete()
        
        response_data = {"message": f"Toxic posts successfully deleted!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    else:
        return HttpResponse("Method not allowed", status=405)


@csrf_exempt
def handle_joke(request, joke_id):
    if request.method == 'DELETE':
        response_data = {}
        ref = db.reference('/jokes/' + joke_id)
        ref.delete()

        response_data = {"message": f"Joke successfully deleted!"}
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    elif request.method == 'GET':
        response_data = {}
        ref = db.reference('/jokes/' + joke_id)
        joke = ref.get()

        if joke is None:
            return HttpResponse("Joke not found", status=404)

        response_data["joke"] = joke
        return HttpResponse(json.dumps(response_data), content_type="application/json", status=200)
    elif request.method == 'PUT':
        return update_vote(request, joke_id)
    else:
        return HttpResponse("Method not allowed", status=405)

