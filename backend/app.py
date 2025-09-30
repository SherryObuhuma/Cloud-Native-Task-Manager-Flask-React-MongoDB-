
import os
from flask import Flask, jsonify, request, abort
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from bson.errors import InvalidId
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

default_mongo = os.getenv("MONGO_URI", "mongodb://mongo:27017/flaskdb")
app.config["MONGO_URI"] = default_mongo
mongo = PyMongo(app)
db = mongo.db

@app.route("/health", methods=["GET"])
def health():
    try:
        db.command("ping")
        return{"status": "ok", "db": "connected"}
    except Exception as e:
        return{"status": "ok", "db": f"error: {str(e)}"}

@app.route("/items", methods=["GET"])
def list_items():
    items = []
    for it in db.items.find():
        it["_id"] = str(it["_id"])
        items.append(it)
    return jsonify(items), 200

@app.route("/items/<id>", methods=["GET"])
def get_item(id):
    try:
        oid = ObjectId(id)
    except InvalidId:
        abort(400, "Invalid id")
    it = db.items.find_one({"_id": oid})
    if not it:
        abort(404)
    it["_id"] = str(it["_id"])
    return jsonify(it), 200

@app.route("/items", methods=["POST"])
def create_item():
    data = request.get_json() or {}
    name = data.get("name")
    description = data.get("description", "")
    if not name:
        abort(400, "name required")
    result = db.items.insert_one({"name": name, "description": description})
    return jsonify({"_id": str(result.inserted_id), "name": name, "description": description}), 201

@app.route("/items/<id>", methods=["PUT"])
def update_item(id):
    try:
        oid = ObjectId(id)
    except InvalidId:
        abort(400, "Invalid id")
    data = request.get_json() or {}
    update = {}
    if "name" in data:
        update["name"] = data["name"]
    if "description" in data:
        update["description"] = data["description"]
    if not update:
        abort(400, "no fields to update")
    res = db.items.update_one({"_id": oid}, {"$set": update})
    if res.matched_count == 0:
        abort(404)
    it = db.items.find_one({"_id": oid})
    it["_id"] = str(it["_id"])
    return jsonify(it), 200

@app.route("/items/<id>", methods=["DELETE"])
def delete_item(id):
    try:
        oid = ObjectId(id)
    except InvalidId:
        abort(400, "Invalid id")
    res = db.items.delete_one({"_id": oid})
    if res.deleted_count == 0:
        abort(404)
    return jsonify({"deleted": id}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5001)))
