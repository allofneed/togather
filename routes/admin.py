import os
from flask import Blueprint, render_template, session, redirect, url_for, request

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.before_request
def check_admin_access():
    if session.get('user_role') != 'admin':
        return "접근 권한이 없습니다.", 403

@admin_bp.route('/dashboard')
def admin_dashboard():
    current_user_name = session.get('user_name', '고객')
    return render_template('admin/dashboard.html', user_name=current_user_name)

@admin_bp.route('/register_store', methods = ['GET', 'POST'])
def register_store():
    naver_key = os.getenv("NAVER_MAP_CLIENT_ID")
    if request.method =='POST':
        store_name=request.form.get('store_name')
        store_category=request.form.get('store_category')

        print(f"DB 저장 완료: {store_name} ({store_category})")
    return render_template('admin/register_store.html', naver_map_id=naver_key)

@admin_bp.route('/register_banner')
def register_banner():
    return render_template('admin/register_banner.html')

# 반납관리 등은 추후 개발 예정
# 고객 센터의 경우에도 추후, 타 지자체 운영시 니딩컴퍼니로 개발 관련 오류 위해

@admin_bp.route('/develop_note')
def develop_note():
    return render_template('admin/develop_note.html')