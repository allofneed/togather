import os
import uuid
from flask import Blueprint, render_template, session, redirect, url_for, request, jsonify
from supabase import create_client, Client

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
        try:
            store_image = request.files.get('store_img')
            store_name = request.form.get('store-name')
            store_category = request.form.get('store-category')
            store_base_address = request.form.get('store-base-address')
            store_detail_address = request.form.get('store-detail_address')
            latitude = request.form.get('latitude')
            longitude = request.form.get('longitude')
            store_benefit = request.form.get('benefit')
            store_benefit_condition = request.form.get('benefit-condition')
            store_hashtag_first = request.form.get('store_hashtag01')
            store_hashtag_second = request.form.get('store_hashtag02')
            store_hashtag_third = request.form.get('store_hashtag03')

            if not store_image:
                return jsonify({"success": False, "message": "대표 이미지는 필수 입니다"}), 400
            
            file_extension = store_image.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_bytes = store_image.read()

            supabase.storage.from_("store-images").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": store_image.content_type}
            )
            image_public_url = supabase.storage.from_("store-images").get_public_url(unique_filename)

            store_db_row = {
                "img_url": image_public_url,
                "name": store_name,
                "category": store_category,
                "main_address": store_base_address,
                "sub_address": store_detail_address,
                "latitude":float(latitude) if latitude else 0.0,
                "longitude":float(longitude) if longitude else 0.0,
                "benefit":store_benefit,
                "benefit_condition":store_benefit_condition,
                "hashtag_first":store_hashtag_first,
                "hashtag_second":store_hashtag_second,
                "hashtag_third":store_hashtag_third
            }
            supabase.table("register_store").insert(store_db_row).execute()
            return jsonify({"success": True, "message": "스토어가 성공적으로 등록되었습니다."})
        except Exception as e:
                print("DB 저장 중 에러 발생:", str(e))
                return jsonify({"success": False, "message": str(e)}), 500
        
    try:
        response = supabase.table("register_store").select("*").execute()
        stores_list = response.data
    except Exception as e:
        stores_list = []
        print("스토어 목록 로드 실패:", str(e))
    return render_template('admin/register_store.html', naver_map_id=naver_key, stores=stores_list)
            

@admin_bp.route('/register_banner')
def register_banner():
    return render_template('admin/register_banner.html')

# 반납관리 등은 추후 개발 예정
# 고객 센터의 경우에도 추후, 타 지자체 운영시 니딩컴퍼니로 개발 관련 오류 위해

@admin_bp.route('/develop_note')
def develop_note():
    return render_template('admin/develop_note.html')