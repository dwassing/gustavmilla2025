from flask import Flask, g, request, jsonify
import jwt
import datetime
import sqlite3

app = Flask(__name__)
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
    username = request.args.get('username')
    password = request.args.get('password')
    db = get_db()
    cursor = db.cursor()
    query = "SELECT id, first_name, last_name FROM login_table WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchone() 
    db.close()
    if user:
        id, first_name, last_name = user
        token = jwt.encode({'first_name': first_name, 'last_name': last_name, 'user_id': id, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)}, app.config['SECRET_KEY'])
        return jsonify({'first_name': first_name, 'last_name': last_name, 'token': token})
    else:
        return jsonify({'message': 'Authentication failed!'}), 401

if __name__ == '__main__':
    app.run(debug=True)