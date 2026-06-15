from flask import Flask, render_template, jsonify, request, redirect, url_for, session

app = Flask(__name__)

app.secret_key = "together_secret_key_1234"

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_process():
    user_input = request.form.get('order_number')
    print(f"사용자가 입력한 번호 : {user_input}")    
    return redirect(url_for('main_page'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/index')
def main_page():
    return render_template('index.html')

@app.route('/reservationinf')
def reservation_inf():
    return render_template('function/reservation_inf.html')

@app.route('/message')
def message():
    return render_template('pages/message.html')

if __name__ == '__main__':
    from livereload import Server
    app.debug = True
    server = Server(app.wsgi_app)
    server.serve(port=5003)
