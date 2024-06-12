from flask import Flask, jsonify
from werkzeug.utils import secure_filename
from typing import Callable
from pathlib import Path
import flask
import requests
import cropper
import os
import PupilSense.scripts.inference as psi

BASE_LOCALHOST = "http://127.0.0.1:5000"
# _P = POST _G = GET
PERSONS_PAGE_PG = "/persons"
CLEARFILE_PAGE_P = "/clear"
TRANS_PAGE_P = "/transform"  # corresponds to action in upload_form.html
UPLOAD_PAGE = "/upload"
ONE_INDEXED = False
TEST_FOLDER = os.path.normpath("PupilSense/dataset/test")
KILL_PREDICT_FOLDER = "PupilSense/dataset/test/predicted"

# Run the app with run.sh or run.cmd to (unsecurely) host on the local network
# Alternatively, to run locally, 
#   run the equivalent scripts runlocal.sh and runlocal.cmd
# Then visit the printed ip and port link

# post files to /transform to open cropper
# or post files to /upload to process as is.
# A JSON object {id: int, abnormal: int} is returned in either case.
#   abnormal = 1 if true and 0 if false.

# Note: post anything to /clear when you 
#   want to use images of a different person/eye

[f.unlink() for f in Path(TEST_FOLDER).glob("*") if f.is_file()]
app = Flask(__name__)

pages_to_jsons: dict[list] = {PERSONS_PAGE_PG: []}


def __next_id(objs: list = pages_to_jsons[PERSONS_PAGE_PG]):
    if not objs:  # if objs is empty return 0
        return 0 + int(ONE_INDEXED)
    return max(o["id"] for o in objs) + 1


def batch_predict(ret_ratio=True):

    # Load environment variables from the .env file
    psi.load_dotenv("PupilSense/.env")

    # Get the base directory
    base_dir = psi.get_base_dir()
    # Construct the full paths using the placeholders and the base directory
    model_path = os.path.join(base_dir, os.getenv("MODELS_DIR"))

    # Construct the full paths using the placeholders and the base directory
    image_path = os.path.normpath(
        os.path.join(base_dir, os.getenv("IMAGE_PATH_PLACEHOLDER"))
    )
    config_path = os.path.join(base_dir, os.getenv("CONFIG_PATH_PLACEHOLDER"))

    print("Inference Started")
    infer = psi.Inference(config_path, image_path, model_path)
    ratio = infer.predict_batch()
    if ratio == -1:
        return dict()
    drunk = int(ratio > 0.45 or (ratio < 0.15 and ratio != 0))
    return {"id": __next_id(), "abnormal": drunk}


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


@app.get(PERSONS_PAGE_PG)
def get_persons() -> flask.Response:
    return jsonify_page(PERSONS_PAGE_PG)

@app.post(CLEARFILE_PAGE_P)
def clear_files() -> flask.Response:
    [f.unlink() for f in Path(TEST_FOLDER).glob("*") if f.is_file()]    
    return jsonify(dict())

@app.post(PERSONS_PAGE_PG)
def add_to_persons() -> flask.Response:
    if flask.request.is_json:
        obj = flask.request.get_json()
        if "id" not in obj.values():
            obj["id"] = __next_id(pages_to_jsons[PERSONS_PAGE_PG])
        pages_to_jsons[PERSONS_PAGE_PG].append(obj)
        return obj, 201
    return {"error": "Request must be JSON"}, 415


@app.route("/")
def home():
    return flask.render_template("upload_form.html")


@app.route(TRANS_PAGE_P, methods=["POST"])
# trans_fn should return a dict
def transform_file() -> flask.Response:
    return upload(transform=True)


@app.route(UPLOAD_PAGE, methods=["POST"])
def upload_file() -> flask.Response:
    return upload(transform=False)


def upload(transform=False) -> flask.Response:
    files = flask.request.files.getlist("file")
    if files:
        for file in files:
            savepath = f"{TEST_FOLDER}{os.sep}{file.filename}"
            if "." not in file.filename:
                savepath += ".png"
            try:
                file.save(savepath)
                file.close()
                if transform:
                    cropper.run(savepath)
            except FileNotFoundError:
                print("No new file passed")
        return jsonify(batch_predict())
    return jsonify(dict())
