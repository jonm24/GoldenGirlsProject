from typing import Text
from flask import Flask, request, jsonify
from deta import Deta

deta = Deta("b0yb70gn_ADpnN6zsbaLTPh9Ypve3UpqNmKComzmc")
db = deta.Base('simpleDB')
app = Flask(__name__)

@app.route('/post-text', methods=["POST"])
def create_user():
    text = request.json.get("text")

    post = db.put({
        "text": text,
    })

    return jsonify(post)

@app.route("/get-texts", methods=["GET"])
def get_texts():
    res = db.fetch()
    all_items = res.items

    # fetch until last is 'None'
    while res.last:
        res = db.fetch(last=res.last)
        all_items += res.items

    return jsonify(results=all_items)

@app.route("/text/<key>", methods=["GET"])
def get_text(key):
    text = db.get(key)
    return text if text else jsonify({"error": "Not found"}, 404)

@app.route("/text/<key>", methods=["PUT"])
def update_text():
    text = db.put(request.json)
    return text if text else jsonify({"error": "Not found"}, 404)

@app.route("/text/<key>", methods=["DELETE"])
def delete_text(key):
    db.delete(key)
    return