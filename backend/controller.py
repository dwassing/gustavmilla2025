from flask import Flask, g, jsonify
import sqlite3

app = Flask(__name__)
DATABASE = 'testdatabase.db'

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

@app.route('/users')
def get_users():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM users')
    users = cursor.fetchall()
    users_dict = [{'id': row[0], 'name': row[1], 'age': row[2]} for row in users]
    return jsonify(users_dict)

@app.route('/login')
def login():
    return jsonify({})

if __name__ == '__main__':
    app.run(debug=True)