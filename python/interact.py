from app import BASE_LOCALHOST
import requests

def post(send_dict: dict, page: str):
    if "localhost" in page or BASE_LOCALHOST in page:
        _page = page
    else:
        _page = BASE_LOCALHOST
        if not page.startswith("/"):
            _page += f"/{page}"
        else:
            _page += page
    print(_page)
    requests.post(_page + "", json=send_dict)

post({"Reaction time" : 5, "Captcha score" : 0.7 }, "/persons")