from flask import Flask, request, jsonify
from deta import Deta

deta = Deta("b0yb70gn_ADpnN6zsbaLTPh9Ypve3UpqNmKComzmc")
db = deta.Base('simpleDB')
app = Flask(__name__)

# create and update. 
# to create, just pass data (key generated)
# to update, pass existing key with updated data
@app.route("/text", methods=["PUT"])
def update_text():
    text = db.put(request.json)
    return text if text else jsonify({"error": "Not found"}, 404)

# get text object by it's key
@app.route("/text/<key>", methods=["GET"])
def get_text(key):
    text = db.get(key)
    return text if text else jsonify({"error": "Not found"}, 404)

# delete text object by it's key
@app.route("/text/<key>", methods=["DELETE"])
def delete_text(key):
    db.delete(key)
    return

# get all text objects
@app.route("/texts", methods=["GET"])
def get_texts():
    res = db.fetch()
    all_items = res.items

    # fetch until last is 'None'
    while res.last:
        res = db.fetch(last=res.last)
        all_items += res.items

    return jsonify(results=all_items)