from flask import Blueprint, request, jsonify
import service.user as user_service

user_bp = Blueprint('user_bp', __name__)


@user_bp.route('/', methods=['GET'])
def get_all():
    users = user_service.get_all()
    return jsonify([user.to_dict() for user in users])


@user_bp.route('/<int:user_id>', methods=['GET'])
def get_by_id(user_id):
    user = user_service.get_by_id(user_id)
    if user:
        return jsonify(user.to_dict()), 200
    else:
        return jsonify({'error': 'User not found.'}), 404


@user_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    success, message = user_service.login(data['email'], data['password'])
    if success:
        return jsonify({'message': "success"}), 200
    else:
        return jsonify({'error': message}), 401


@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    success, message = user_service.delete_by_id(user_id)
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 404


@user_bp.route('/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    data = request.json
    success, message = user_service.update(user_id, **data)
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400


@user_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data['username']
    password = data['password']
    email = data['email']
    success, message = user_service.register(username, email, password)
    if success:
        return jsonify({'message': message}), 201
    else:
        return jsonify({'error': message}), 400