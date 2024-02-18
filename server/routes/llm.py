from flask import Blueprint, request, jsonify
import server.service.llama_functions as llama

llama_bp = Blueprint('llama_bp', __name__)


# Advanced conversation, use only if needed to adjust parameters going in
# Expects JSON with question, temperature, max_tokens, and presence_penalty
# Returns JSON with response (Output from llm)
@llama_bp.route('/adjusted_conversation', methods=['POST'])
def adjusted_conversation():
    data = request.json
    question = data['question']
    temperature = data['temperature']
    max_tokens = data['max_tokens']
    presence_penalty = data['presence_penalty']
    response = llama.adjusted_conversation(question, temperature, max_tokens, presence_penalty)
    return jsonify({'response': response}), 200


# Basic conversation, use for simple 'call-and-response' with llama
# Expects JSON with question
# Returns JSON with response (Output from llm)
@llama_bp.route('/conversation', methods=['POST'])
def conversation():
    data = request.json
    question = data['question']
    response = llama.conversation(question)
    return jsonify({'response': response}), 200


# Conversation with memory, use for conversations with memory
# Expects JSON with memory_key (ID for user chat) and question
# Returns JSON with response (Output from llm)
@llama_bp.route('/conversation_with_memory', methods=['POST'])
def conversation_with_memory():
    data = request.json
    memory_key = data['memory_key']
    question = data['question']
    response = llama.conversation_with_memory(memory_key, question)
    return jsonify({'response': response}), 200

# TBD: pull MySQL data from database based on memory_key
# Expects JSON with memory_key (ID for user chat)
# Returns JSON with respone(s)
