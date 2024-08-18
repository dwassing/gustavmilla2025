from flask import Flask, g, request, jsonify
from flask_cors import CORS
import jwt
import datetime
import sqlite3

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = '42' # move this to a .gitignored file later
DATABASE = 'wedding.db'

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

@app.route('/')
def index():
    return 'Welcome to my Flask application!'

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')
    db = get_db()
    cursor = db.cursor()
    query = "SELECT id, first_name, last_name FROM login_table WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchone() 
    db.close()
    if user:
        id, first_name, last_name = user
        token = jwt.encode({'first_name': first_name, 'last_name': last_name, 'user_id': id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=180)}, app.config['SECRET_KEY'])
        return jsonify({'first_name': first_name, 'last_name': last_name, 'token': token})
    else:
        return jsonify({'message': 'Felaktigt namn eller lösenord!'}), 401

def validateToken(request):
    token = request.headers.get('Authorization')
    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@app.route('/getGuestPreferences', methods=['GET'])
def guestPreferences():
    payload = validateToken(request);
    if payload == None:
        return jsonify({'message': 'Invalid token!'}), 401
    else:
        db = get_db()
        cursor = db.cursor()
        query = "SELECT guest_id, first_name, last_name, food_preference, allergi, registered FROM guest_table WHERE connected_user = ?"
        cursor.execute(query, (str(payload['user_id'])))
        information = cursor.fetchall()
        dictlist = [dict() for x in range(len(information))]
        for n, entry in enumerate(information):
            dictlist[n]['guestId'] = entry[0]
            dictlist[n]['firstName'] = entry[1]
            dictlist[n]['lastName'] = entry[2]
            dictlist[n]['foodPreference'] = entry[3]
            dictlist[n]['allergi'] = entry[4]
            dictlist[n]['registered'] = entry[5]
        db.close()
        return jsonify(dictlist), 200
    
@app.route('/setGuestPreferences', methods=['POST'])
def setGuestPreferences():
    payload = validateToken(request);
    if payload == None:
        return jsonify({'message': 'Invalid token!'}), 401
    else:
        update_data = request.json
        db = get_db()
        cursor = db.cursor()
        for entry in update_data:
            query = "SELECT * FROM guest_table WHERE guest_id = ? AND connected_user = ?"
            cursor.execute(query, (entry['guestId'], payload['user_id']))
            if cursor.fetchone() == None:
                return jsonify({'message': 'Invalid combination!'}), 401
            else:
                query = "UPDATE guest_table SET first_name = ?, last_name = ?, food_preference = ?, allergi = ?, registered = ? WHERE guest_id = ? AND connected_user = ?"
                cursor.execute(query, (entry['firstName'], entry['lastName'], entry['foodPreferences'], entry['allergi'], True, entry['guestId'], payload['user_id']))
        db.commit()
        db.close()
        return jsonify({'message': 'Success'}), 200
    
@app.route('/removeGuest', methods=['POST'])
def setRemoveUser():
    payload = validateToken(request);
    if payload == None:
        return jsonify({'message': 'Invalid token!'}), 401
    else:
        person_to_remove = request.json.get('guestId')
        print(person_to_remove)
        db = get_db()
        cursor = db.cursor()
        query = "SELECT * FROM guest_table WHERE guest_id = ? AND connected_user = ?"
        cursor.execute(query, (person_to_remove, payload['user_id']))
        if cursor.fetchone() == None:
            return jsonify({'message': 'Invalid combination!'}), 401
        else:
            query = "UPDATE guest_table SET first_name = ?, last_name = ?, food_preference = ?, allergi = ?, registered = ? WHERE guest_id = ? AND connected_user = ?"
            cursor.execute(query, ("", "", "", "", False, person_to_remove, payload['user_id']))
            db.commit()
            db.close()
            return jsonify({'message': 'Success'}), 200

# Protected route example
@app.route('/registration', methods=['GET'])
def protected():
    token = request.headers.get('Authorization')

    if not token:
        return jsonify({'message': 'Token is missing!'}), 401
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        print("Payload:", payload)  # Debugging print statement
        first_name = payload['first_name']
        last_name = payload['last_name']
        user_id = payload['user_id']
        exp = payload['exp']
        print("Name:", first_name, last_name)
        # do something with id
        return jsonify({'message': f'Välkommen {first_name} {last_name}!'})
    except jwt.ExpiredSignatureError:
        return jsonify({'message': 'Token has expired!'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'message': 'Invalid token!'}), 401
    
if __name__ == '__main__':
    app.run(debug=True)