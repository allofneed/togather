import os
from dotenv import load_dotenv
from flask import Flask, render_template, jsonify, request, redirect, url_for, session
from supabase import create_client, Client

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/')
def login():
    return render_template('login.html')

@app.route('/login', methods=['POST'])
def login_process():
    user_input = request.form.get('order_number').strip()
    print(f"사용자가 입력한 번호 : {user_input}")

    if not user_input:
        return "<script>alert('주문번호를 입력해 주세요.'); history.back();</script>"
    
    try:
        user_input_num = int(user_input)
    except ValueError:
        return "<script>alert('숫자로만 입력해 주세요.'); history.back();</script>"
    
    try:
        response = supabase.table('users').select("*").eq('user_number', user_input_num).execute()

        if len(response.data) > 0:
            session['user'] = user_input
            session['user_name'] = response.data[0]['user_name']
            return redirect(url_for('index'))
        else:
            return "<script>alert('등록되지 않은 주문번호입니다.'); history.back();</script>"
    except Exception as e:
        return f"<script>alert('서버 에러가 발생했습니다: {str(e)}'); history.back();</script>"

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/index')
def index():
    current_user_name = session.get('user_name', '고객')
    naver_key = os.getenv("NAVER_MAP_CLIENT_ID")
    return render_template('index.html',user_name=current_user_name,naver_map_id=naver_key)

@app.route('/reservationinf')
def reservation_inf():
    return render_template('function/reservation_inf.html')

@app.route('/message')
def message():
    return render_template('pages/message.html')

@app.route('/mypage')
def mypage():
    return render_template('pages/mypage.html')

@app.route('/picture')
def picture():
    return render_template('pages/picture.html')

@app.route('/qr')
def qr():
    return render_template('pages/qr.html')

if __name__ == '__main__':
    from livereload import Server
    app.debug = True
    server = Server(app.wsgi_app)
    server.serve(port=5003)
