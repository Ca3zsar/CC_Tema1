from flask import Flask, request, make_response, jsonify
import google.auth

app = Flask(__name__)
_, PROJECT_ID = google.auth.default()
PARENT = 'projects/{}'.format(PROJECT_ID)

@app.route('/test', methods=['GET'])
def translate():
    from flask import Flask, render_template, request, make_response, jsonify
    local_request = request.get_json()

    if not local_request:
        return make_response(jsonify({"error" : 'Texts or target language not specified!'}), 400)

    texts = local_request.get('messages', [])
    target = local_request.get('target', '')

    if not texts or not target:
        return make_response(jsonify({"error" : 'Texts or target language not specified!'}), 400)

    translated_texts = []
    for text in texts:
        translated_texts.append(translate_text(target, text))
    response_data = {"translated_texts": translated_texts}
    return make_response(jsonify(response_data), 200)


# [START translate_translate_text]
def translate_text(target, text):
    import six
    from google.cloud import translate_v2 as translate

    translate_client = translate.Client()

    if isinstance(text, six.binary_type):
        text = text.decode("utf-8")

    # Text can also be a sequence of strings, in which case this method
    # will return a sequence of results for each text.
    result = translate_client.translate(text, target_language=target)

    # print(u"Text: {}".format(result["input"]))
    # print(u"Translation: {}".format(result["translatedText"]))
    # print(u"Detected source language: {}".format(result["detectedSourceLanguage"]))
    return result['translatedText']


import os
app.run(debug=True, threaded=True, host='127.0.0.1',
        port=8080)


