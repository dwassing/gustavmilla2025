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
        token = jwt.encode({'first_name': first_name, 'last_name': last_name, 'user_id': id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, app.config['SECRET_KEY'])
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
def userPreferences():
    payload = validateToken(request);
    if payload == None:
        return jsonify({'message': 'Invalid token!'}), 401
    else:
        print(payload['first_name'])
        print(payload['last_name'])  
        db = get_db()
        cursor = db.cursor()
        query = "SELECT id FROM login_table WHERE first_name = ? AND last_name = ?"
        cursor.execute(query, (payload['first_name'], payload['last_name']))
        connected_user_id = cursor.fetchone()
        query = "SELECT first_name, last_name, food_preference, allergi FROM guest_table WHERE connected_user = ?"
        cursor.execute(query, (connected_user_id))
        information = cursor.fetchall()
        dictlist = [dict() for x in range(len(information))]
        for n, entry in enumerate(information):
            dictlist[n]['First Name'] = entry[0]
            dictlist[n]['Last Name'] = entry[1]
            dictlist[n]['Food Preference'] = entry[2]
            dictlist[n]['Allergi'] = entry[3]
        db.close()
        return jsonify(dictlist)

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