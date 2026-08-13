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

@admin_bp.route('/register_store', methods=['GET', 'POST'])
def register_store():
    naver_key = os.getenv("NAVER_MAP_CLIENT_ID")
    
    if request.method == 'POST':
        try:
            store_image = request.files.get('store-img')
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
                "latitude": float(latitude) if latitude else 0.0,
                "longitude": float(longitude) if longitude else 0.0,
                "benefit": store_benefit,
                "benefit_condition": store_benefit_condition,
                "hashtag_first": store_hashtag_first,
                "hashtag_second": store_hashtag_second,
                "hashtag_third": store_hashtag_third
            }
            
            insert_response = supabase.table("register_store").insert(store_db_row).execute()
            
            if insert_response.data:
                new_store_id = insert_response.data[0]['id']
                qr_url = f"https://togethriding.co.kr/store/{new_store_id}"
                
                return jsonify({
                    "success": True, 
                    "message": "스토어가 성공적으로 등록되었습니다.",
                    "qr_url": qr_url
                })
            else:
                return jsonify({"success": False, "message": "스토어 등록에 실패했습니다."}), 500
                
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
            
@admin_bp.route('/register_banner', methods=['GET','POST'])
def register_banner():
    
    if request.method == 'POST':
        try:
            banner_category = request.form.get('banner-category')
            banner_title = request.form.get('banner-title')
            start_date = request.form.get('start-date')
            end_date = request.form.get('end-date')
            banner_url = request.form.get('banner-url')
            banner_image = request.files.get('banner-img')

            if not banner_image:
                return jsonify({"status": "error", "message": "배너 이미지는 필수입니다."}), 400
            
            file_extension = banner_image.filename.split('.')[-1]
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            file_bytes = banner_image.read()
            
            supabase.storage.from_("banner_images").upload(
                path=unique_filename,
                file=file_bytes,
                file_options={"content-type": banner_image.content_type}
            )

            image_public_url = supabase.storage.from_("banner_images").get_public_url(unique_filename)

            banner_db_row = {
                "category": banner_category,
                "title": banner_title,
                "start_date": start_date,
                "end_date": end_date,
                "banner_url": banner_url,
                "image_url":image_public_url
            }
            supabase.table("register_banner").insert(banner_db_row).execute()
            return jsonify({"status": "success", "message": "배너가 성공적으로 등록되었습니다"})
        
        except Exception as e:
            print("배너 저장 중 에러:", str(e))
            return jsonify({"status": "error", "message": str(e)}), 500
        
    try:
        response = supabase.table("register_banner").select("*").execute()
        banners_list = response.data
    except Exception as e:
        print("배너 목록 로드 실패:", str(e))
        banners_list = []
    return render_template('admin/register_banner.html', banners=banners_list)

@admin_bp.route('/orderer_list')
def orderer_list():
    return render_template('admin/orderer_list.html')

@admin_bp.route('/api/orderer_list')
def api_orderer_list():
    try:
        response = supabase.table("users").select("*").order("order_date", desc=True).execute()
        return jsonify({"status": "success", "data": response.data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@admin_bp.route('/api/update_status', methods=['POST'])
def api_update_status():
    try:
        data = request.get_json()
        order_id = data.get("product_order_id") 
        new_status = data.get("renter_state")   

        if not order_id or not new_status:
            return jsonify({"status": "error", "message": "데이터가 부족합니다."})
        supabase.table("users").update({"renter_state": new_status}).eq("product_order_id", order_id).execute()
        
        return jsonify({"status": "success"})
        
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})


@admin_bp.route('/develop_note')
def develop_note():
    return render_template('admin/develop_note.html')