from flask import Blueprint, request, jsonify
import service.query as query_service


query_bp = Blueprint('query_bp', __name__)


@query_bp.route('/<int:user_id>', methods=['GET'])
def get_by_user_id(user_id):
    queries = query_service.get_by_user_id(user_id)
    return jsonify([query.to_dict() for query in queries])


# Get recent queries, used in llama_complete
@query_bp.route('/recent/<int:user_id>', methods=['GET'])
def get_recent(user_id):
    count = int(request.args.get('count', 5))
    offset = int(request.args.get('offset', 0))
    queries = query_service.get_recent(user_id, count, offset)
    print(queries)
    return jsonify([query.to_dict() for query in queries])

# Adds into database, expects user_id, question, and response
# Expects a json object
@query_bp.route('/<int:user_id>', methods=['POST'])
def create(user_id):
    data = request.get_json()
    if data is None:
        return jsonify({'error': 'Invalid request, data is missing'}), 400
    question = data.get('question')
    response = data.get('response')
    success, message = query_service.create(user_id, question=question, response=response)
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400


@query_bp.route('/<int:query_id>', methods=['DELETE'])
def delete(query_id):
    success, message = query_service.delete_by_id(query_id)
    if success:
        return jsonify({'message': message}), 200
    else:
        return jsonify({'error': message}), 400

