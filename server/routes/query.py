from flask import Blueprint, request, jsonify
import service.query as query_service


query_bp = Blueprint('query_bp', __name__)


@query_bp.route('/', methods=['GET'])
def get_all():
    queries = query_service.get_all()
    return jsonify([query.to_dict() for query in queries])


@query_bp.route('/<int:user_id>', methods=['GET'])
def get_by_user_id(user_id):
    queries = query_service.get_by_user_id(user_id)
    return jsonify([query.to_dict() for query in queries])


@query_bp.route('/<int:user_id>', methods=['GET'])
def get_recent(user_id):
    count = int(request.args.get('count', 5))
    offset = int(request.args.get('offset', 0))
    queries = query_service.get_recent(user_id, offset, count)
    return jsonify([query.to_dict() for query in queries])
