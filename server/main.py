from flask import Flask, request, jsonify
from flask_cors import CORS
from deta import Deta

deta = Deta()
global_db = deta.Base('global') # where global app data is stored
users_db = deta.Base('users') # where user objects are stored
friends_db = deta.Base('friends') # where friend requests are stored
events_db = deta.Base('events') # where new events are stored
invites_db = deta.Base('invites') # wwhere event invites are stored
app = Flask(__name__)
CORS(app)

# check status of api
@app.route("/", methods=["GET"])
def index():
    return jsonify(status="ok")

@app.route("/users/all", methods=["GET"])
def all_users():
    all_users = global_db.get("all_users")
    return jsonify(results=dict(all_users).get('value') if all_users else None)
    
# login in user 
# make a new object if one doesn't exist and return user
# catch error if it does exist and return user
@app.route("/users/login/<key>", methods=["GET"])
def user_login(key):
    try: 
        user = users_db.insert({"events": [], "friends": [], "version": 0}, key)
        global_db.update({"value": global_db.util.append(key)}, "all_users")
        return jsonify(user=user)
    except Exception:
        # get user events
        user = dict(users_db.get(key))
        user_events = user.get("events")

        # change structure: list<{ event_id: decision }> -> list<event_id>
        user_events = [next(iter(dict(obj))) for obj in user_events]

        # get invites 
        invited_to = invites_db.fetch([{"to?contains": key}]) 

        # add invites to user events list
        [user_events.insert(0, dict(invite).get("event_id")) for invite in invited_to.items]   

        # remove duplicates
        user_events = list(set(user_events))

        # get events
        events = [events_db.get(event_id) for event_id in user_events] if len(user_events) > 0 else []
        
        return jsonify(user=user, events=events)

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

@app.route('/events/rsvp/<event_id>/<user_id>/<decision>/<version>', methods=["GET"])
def rsvp_event(event_id, user_id, decision, version):
    user = dict(users_db.get(str(user_id)))
    if int(version) == user.get('version'):
        user_invite = {}
        invited_to = invites_db.fetch([{"to?contains": user_id}])
        for invite in invited_to.items:
            if invite.get('event_id') == event_id:
                user_invite = invite
        
        if user_invite.get("status") != "":
            temp_user_events = user.get('events')
            for obj in temp_user_events:
                key = next(iter(obj))
                if key == event_id:
                    obj.update({key: decision})
                    
            users_db.update({"events": temp_user_events, "version": users_db.util.increment()}, user_id)
        else: 
            users_db.update({"events": users_db.util.append({ event_id: decision }), "version": users_db.util.increment()}, user_id)

        invites_db.update( {"status": decision}, user_invite.get("key"))
    
        new_user = users_db.get(user_id)
        return jsonify(result=new_user)    
    else: 
        return jsonify(error="user not up-to-date, please try again now", user=user)

@app.route('/events/create/<version>', methods=["POST"])
def create_event(version): 
    # dict event is stored in
    res = {}

    # get event object
    event = dict(request.json)
    host_key = event.get("host")

    # check user version first
    host = dict(users_db.get(host_key))
    if int(version) == host.get("version"):
        # store new event
        res = dict(events_db.put(event))

        # update host's object
        event_id = res.get("key")
        users_db.update({ "events": users_db.util.append({ f"{event_id}": "host" }), "version": users_db.util.increment() }, host_key)
    else: 
        return jsonify(error="user object not up-to-date", user=host)
    
    ## invite guests
    guests = res.get("invited")
    while len(guests) > 0:
        # get groups of 25
        if len(guests) >= 25:
            group = guests[0:24]
            guests = guests[25:len(guests) - 1]
        else:
            group = guests
            guests = []
        
        # send invites
        invites = []
        for guest in group:
            invites.append({"event_id": res.get("key"), "to": guest, "status": None})
        invites_db.put_many(invites)
    
    new_user = users_db.get(host_key)
    return jsonify(user=new_user, event=res)

@app.route('/events/delete/<key>', methods=["GET"])
def delete_event(key):
    events_db.delete(str(key))

    invites = invites_db.fetch({"event_id?contains": key})
    for invite in invites.items:
        invites_db.delete(invite.get("key"))

    return jsonify(result=f"event {key} deleted")


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