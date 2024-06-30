from flask import Flask, g, request, jsonify
import sqlite3

app = Flask(__name__)
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

@app.route('/login')
def login():
    username = request.args.get('username')
    password = request.args.get('password')
    db = get_db()
    cursor = db.cursor()
    query = "SELECT first_name, last_name FROM login_table WHERE username = ? AND password = ?"
    cursor.execute(query, (username, password))
    user = cursor.fetchone() 
    db.close()
    if user:
        first_name, last_name = user
        return jsonify({'authenticated': True, 'first_name': first_name, 'last_name': last_name})
    else:
        return jsonify({'authenticated': False})

if __name__ == '__main__':
    app.run(debug=True)