from flask import Flask, request, jsonify
from flask_cors import CORS
from deta import Deta

deta = Deta()
global_db = deta.Base('global') # where global app data is stored
users_db = deta.Base('users') # where user objects are stored
friends_db = deta.Base('friends') # where friend requests are stored
app = Flask(__name__)
CORS(app)

# check status of api
@app.route("/", methods=["GET"])
def index():
    return jsonify(status="ok")

# login in user 
# make a new object if one doesn't exist and return user
# catch error if it does exist and return user
@app.route("/users/login/<key>", methods=["GET"])
def user_login(key):
    try: 
        user = users_db.insert({"events": [], "friends": [], "version": 0}, key)
        global_db.update({"value": global_db.util.append(key)}, "all_users")
        return jsonify(user=user)
    except Exception as ex:
        user = users_db.get(key)
        return jsonify(error=f"{ex}", user=user)

# make a new friend request
@app.route("/friends/new", methods=["POST"])
def friend_request():
    res = friends_db.put(request.json)
    return jsonify(result=res if res else False)

# endpoint that gets hit when you go to friends page
# get pending friend requests
# get all users
@app.route('/friends/page/<key>', methods=["GET"])
def friends_page(key):
    all_users = global_db.get("all_users")
    res = friends_db.fetch([{"to?contains": key}, {"from?contains": key}])
    return jsonify(
        pending=res.items if res.items else None, 
        users=all_users if all_users else None
    )

@app.route('/friends/accept/<key>/<to>/<version>', methods=["PUT"])
def accept_friend(key, to, version):
    req = dict(friends_db.get(str(key)))
    receiver = dict(users_db.get(to))
    if int(version) == receiver.get('version'):
        users_db.update({ "friends": users_db.util.append(req.get('from')), "version": users_db.util.increment() }, to)
        users_db.update({ "friends": users_db.util.append(to), "version": users_db.util.increment() }, req.get('from'))
        friends_db.delete(str(key))
        new_user = users_db.get(to) 
        return jsonify(result=new_user)
    else:
        return jsonify(result=False)




### BOILERPLATE CODE ###
### ONLY FOR EXAMPLE ###

# # create and update. 
# # to create, just pass data (key generated)
# # to update, pass existing key with updated data
# @app.route("/text", methods=["PUT"])
# def update_text():
#     text = db.put(request.json)
#     return text if text else jsonify({"error": "Not found"}, 404)

# # get text object by it's key
# @app.route("/text/<key>", methods=["GET"])
# def get_text(key):
#     text = db.get(str(key))
#     return text if text else jsonify({"error": "Not found"}, 404)

# # delete text object by it's key
# @app.route("/text/<key>", methods=["DELETE"])
# def delete_text(key):
#     db.delete(str(key))
#     return jsonify(deleted=str(key))

# # get all text objects
# @app.route("/texts", methods=["GET"])
# def get_texts():
#     res = db.fetch()
#     all_items = res.items

#     # fetch until last is 'None'
#     while res.last:
#         res = db.fetch(last=res.last)
#         all_items += res.items

#     return jsonify(results=all_items)