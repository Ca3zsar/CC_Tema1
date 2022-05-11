#!/bin/bash

python -m pip install -r API/requirements.txt

gunicorn --bind=0.0.0.0 --timeout 600 --chdir API  backend.wsgi
