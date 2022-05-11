from cgitb import reset
import logging, os

import azure.functions as func
import requests, uuid, json

def main(req: func.HttpRequest) -> func.HttpResponse:
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '3600'
    }
    if req.method == 'OPTIONS':
        return func.HttpResponse('Options set',status_code=204,headers=headers)

    #add headers to func.httpResponse headers
    
    logging.info('Python HTTP trigger function processed a request.')
    try:
        info = req.get_json()
    except ValueError:
        return func.HttpResponse(json.dumps({'error': 'No data in request'}), status_code=400,mimetype='application/json', headers=headers)

    texts = info.get("messages",[])
    target = info.get("target", "")

    if not texts or not target:
        return func.HttpResponse(json.dumps({'error': 'Target or messages not specified!'}), 
                                status_code=400,mimetype='application/json', headers=headers)

    translated_texts = []
    for text in texts:
        translated_texts.append(translate(text, target))
    
    return func.HttpResponse(json.dumps({"translated_texts":translated_texts}), status_code=200,mimetype='application/json', headers=headers)


def translate(message : str, target : str) -> str:
    # Add your key and endpoint
    key = os.environ['TRANSLATE_KEY']
    endpoint = "https://api.cognitive.microsofttranslator.com"

    location = "westeurope"

    path = '/translate'
    constructed_url = endpoint + path

    params = {
        'api-version': '3.0',
        'from': 'en',
        'to': [target]
    }

    headers = {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': location,
        'Content-type': 'application/json',
        'X-ClientTraceId': str(uuid.uuid4())
    }

    # You can pass more than one object in body.
    body = [{
        'text': message
    }]

    request = requests.post(constructed_url, params=params, headers=headers, json=body)
    response = request.json()

    return response[0]['translations'][0]['text']