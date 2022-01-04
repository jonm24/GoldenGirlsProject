from flask import Flask, request, jsonify
from deta import Deta

deta = Deta()
db = deta.Base('simpleDB')
app = Flask(__name__)

@app.route('/post-text', methods=["POST"])
def create_user():
    text = request.json.get("text")

    post = db.put({
        "text": text,
    })

    return jsonify(post, 201)

@app.route("/get-texts", methods=["GET"])
def get_user():
    res = db.fetch()
    all_items = res.items

    # fetch until last is 'None'
    while res.last:
        res = db.fetch(last=res.last)
        all_items += res.items

    return jsonify(all_items)

@app.route("/texts/<key>", methods=["PUT"])
def update_text():
    user = db.put(request.json)
    return user

@app.route("/texts/<key>", methods=["DELETE"])
def delete_text(key):
    db.delete(key)
    return