from app import BASE_LOCALHOST
from app import page_str_format
import flask
import requests


def post(send_dict: dict, page: str) -> flask.Response:
    return requests.post(page_str_format(page), json=send_dict)

def get(page: str):
    return requests.get(page_str_format(page))

post({"Reaction time" : 5, "Captcha score" : 0.7 }, "/persons")