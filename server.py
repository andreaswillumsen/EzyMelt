from flask import Flask, request, jsonify
import sqlite3

app = Flask(__name__)

def init_db():
    with sqlite3.connect("anlegg.db") as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS anlegg (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        lat REAL,
                        lon REAL,
                        status TEXT,
                        effekt REAL)''')

@app.route("/add_anlegg", methods=["POST"])
def add_anlegg():
    data = request.json
    with sqlite3.connect("anlegg.db") as conn:
        cursor = conn.cursor()
        cursor.execute("INSERT INTO anlegg (name, lat, lon, status, effekt) VALUES (?, ?, ?, ?, ?)", 
                       (data["name"], data["lat"], data["lon"], data["status"], data["effekt"]))
        conn.commit()
    return jsonify({"message": "Anlegg lagret"}), 201

@app.route("/get_anlegg", methods=["GET"])
def get_anlegg():
    with sqlite3.connect("anlegg.db") as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT name, lat, lon, status, effekt FROM anlegg")
        anlegg = [{"name": row[0], "lat": row[1], "lon": row[2], "status": row[3], "effekt": row[4]} for row in cursor.fetchall()]
    return jsonify(anlegg)

if __name__ == "__main__":
    init_db()
    app.run(host="0.0.0.0", port=5000, debug=True)
