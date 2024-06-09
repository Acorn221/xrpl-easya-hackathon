from flask import Flask, jsonify
from werkzeug.utils import secure_filename
import flask
import requests

BASE_LOCALHOST = "http://127.0.0.1:5000"
PERSONS_PAGE = "/persons"
UPLOAD_PAGE = "/upload" # corresponds to action in upload_form.html
ONE_INDEXED = False
app = Flask(__name__)

pages_to_jsons: dict[list] = { PERSONS_PAGE : [] }

def __next_id(objs: list = pages_to_jsons[PERSONS_PAGE]):
    if not objs: # if objs is empty return 0
        return 0 + int(ONE_INDEXED)
    return max(o["id"] for o in objs) + 1

def jsonify_page(page: str) -> flask.Response:
    return jsonify(pages_to_jsons[page])

def page_str_format(page: str) -> str:
    if "localhost" in page or BASE_LOCALHOST in page:
        _page = page
    else:
        _page = BASE_LOCALHOST
        if not page.startswith("/"):
            _page += f"/{page}"
        else:
            _page += page
    return _page

@app.get(PERSONS_PAGE)
def get_persons() -> flask.Response:
    return jsonify_page(PERSONS_PAGE)

@app.post(PERSONS_PAGE)
def add_to_persons() -> flask.Response:
    if flask.request.is_json:
        obj = flask.request.get_json()
        if "id" not in obj.values():
            obj["id"] = __next_id(pages_to_jsons[PERSONS_PAGE])
        pages_to_jsons[PERSONS_PAGE].append(obj)
        return obj, 201
    return {"error": "Request must be JSON"}, 415

@app.route('/')
def home():
    return flask.render_template('upload_form.html')

@app.route('/transform', methods=['POST'])
# trans_fn should return a dict
def transform_file(trans_fn = lambda x: {x.filename : 201}) -> flask.Response:
    ret = dict()
    files = flask.request.files.getlist("file")
    if files:
        for file in files:
                ret.update(trans_fn(file))
    return jsonify(ret)