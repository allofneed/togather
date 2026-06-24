from flask import Blueprint, render_template, session, redirect, url_for

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/dashboard')
def admin_dashboard():
    if session.get('user_role') != 'admin':
        return "접근 권한이 없습니다.", 403
    
    current_user_name = session.get('user_name', '고객')
    return render_template('admin/dashboard.html', user_name=current_user_name)

@admin_bp.route('/add_store')
def add_store():
    if session.get('user_role') != 'admin':
        return"접근 권한이 없습니다.", 403
    return render_template('admin/add_store.html')