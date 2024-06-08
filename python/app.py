from flask import Flask, jsonify
import flask
import requests

BASE_LOCALHOST = "http://127.0.0.1:5000"
PERSONS_PAGE = "/persons"
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
    return  jsonify_page(PERSONS_PAGE)

@app.post(PERSONS_PAGE)
def add_to_persons():
    if flask.request.is_json:
        obj = flask.request.get_json()
        if "id" not in obj.values():
            obj["id"] = __next_id(pages_to_jsons[PERSONS_PAGE])
        pages_to_jsons[PERSONS_PAGE].append(obj)
        return obj, 201
    return {"error": "Request must be JSON"}, 415
