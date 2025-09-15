from flask import Flask, render_template, request, redirect, session
import sqlite3

app = Flask(__name__)
app.secret_key = "secret123"

# Database setup
def init_db():
    conn = sqlite3.connect("mood.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE,
                    password TEXT
                )''')
    c.execute('''CREATE TABLE IF NOT EXISTS entries (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER,
                    mood TEXT,
                    journal TEXT,
                    activity TEXT,
                    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )''')
    conn.commit()
    conn.close()

@app.route("/")
def index():
    if "user_id" in session:
        return redirect("/dashboard")
    return render_template("index.html")

@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = sqlite3.connect("mood.db")
        c = conn.cursor()
        try:
            c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
            conn.commit()
        except:
            return "Username already exists!"
        conn.close()
        return redirect("/login")
    return render_template("register.html")

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form["username"]
        password = request.form["password"]

        conn = sqlite3.connect("mood.db")
        c = conn.cursor()
        c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
        user = c.fetchone()
        conn.close()

        if user:
            session["user_id"] = user[0]
            return redirect("/dashboard")
        else:
            return "Invalid credentials"
    return render_template("login.html")

@app.route("/logout")
def logout():
    session.pop("user_id", None)
    return redirect("/")

@app.route("/dashboard", methods=["GET", "POST"])
def dashboard():
    if "user_id" not in session:
        return redirect("/login")

    if request.method == "POST":
        mood = request.form["mood"]
        journal = request.form["journal"]
        activity = request.form["activity"]

        conn = sqlite3.connect("mood.db")
        c = conn.cursor()
        c.execute("INSERT INTO entries (user_id, mood, journal, activity) VALUES (?, ?, ?, ?)",
                  (session["user_id"], mood, journal, activity))
        conn.commit()
        conn.close()

    conn = sqlite3.connect("mood.db")
    c = conn.cursor()
    c.execute("SELECT mood, journal, activity, date FROM entries WHERE user_id=?", (session["user_id"],))
    entries = c.fetchall()
    conn.close()

    return render_template("dashboard.html", entries=entries)

if __name__ == "_main_":
    init_db()
    app.run(debug=True)