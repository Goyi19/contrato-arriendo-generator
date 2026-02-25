from flask import Flask, jsonify
from flask_cors import CORS
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from categories_config import CATEGORIES_CONFIG
except ImportError:
    CATEGORIES_CONFIG = {"Comercial": {}, "Fuentes de Flujo": {}}

app = Flask(__name__)
CORS(app)

@app.route('/api/categories', methods=['GET'])
def get_categories():
    return jsonify(CATEGORIES_CONFIG)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
