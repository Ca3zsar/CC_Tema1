import json
import firebase_admin as fba

def initialize_firebase(str_json_payload=None):
    if str_json_payload is None:
        cred = fba.credentials.Certificate('firestore_credentials.json')
        fba.initialize_app(cred, {
            'databaseURL': 'https://man1joke-default-rtdb.europe-west1.firebasedatabase.app/'
        })
    else:
        dict = json.loads(str_json_payload)
        cred = fba.credentials.Certificate(dict)
        fba.initialize_app(cred, {
            'databaseURL': 'https://man1joke-default-rtdb.europe-west1.firebasedatabase.app/'
        })
