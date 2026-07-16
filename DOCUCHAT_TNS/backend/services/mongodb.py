import os
import certifi
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = MongoClient(
    MONGODB_URI,
    tls=True,
    tlsCAFile=certifi.where()
)

db = client["PDFCHAT"]
chat_collection = db["chat_history"]
users_collection = db["users"]

users_collection.create_index(
    "username",
    unique=True
)

try:
    client.admin.command("ping")
    print("[OK] MongoDB Connected Successfully")  # FIX: emoji crashed Windows CP1252 terminal
except Exception as e:
    print("[ERROR] MongoDB Connection Failed")    # FIX: emoji crashed Windows CP1252 terminal
    print(e)

def create_session(
    session_id,
    topicname,
    user_id,
    username
):
    chat_collection.insert_one(
        {
            "_id": session_id,
            "user_id": user_id,
            "username": username,
            "topic": topicname,
            "messages": []
        }
    )

def session_exists(
    session_id,
    user_id
):
    return chat_collection.find_one(
        {
            "_id": session_id,
            "user_id": user_id
        }
    ) is not None

def delete_session(session_id, user_id):

    result = chat_collection.delete_one(
        {
            "_id": session_id,
            "user_id": user_id
        }
    )

    return result.deleted_count == 1

def save_chat_turn(session_id, user_query, assistant_response):
    # print("✌️ Saved RESPONSE and QUERY")
    result = chat_collection.update_one(
        {"_id": session_id},
        {
            "$push": {
                "messages": {
                    "$each": [
                        {
                            "role": "user",
                            "content": user_query
                        },
                        {
                            "role": "assistant",
                            "content": assistant_response
                        }
                    ]
                }
            }
        }
    )

    return result.modified_count == 1

def get_chat_history(session_id):
    # print(">>>>>>>>>>>>>>Giving history to LLM")
    session = chat_collection.find_one(
        {"_id": session_id}
    )

    if session:
        return session["messages"]

    return []




def get_user_sessions(user_id):

    sessions = []

    cursor = chat_collection.find(
        {
            "user_id": user_id
        },
        {
            "_id": 1,
            "topic": 1
        }
    )

    for session in cursor:
        sessions.append(
            {
                "session_id": session["_id"],
                "topic": session["topic"]
            }
        )

    return sessions





def get_session_history(
    session_id,
    user_id
):

    session = chat_collection.find_one(
        {
            "_id": session_id,
            "user_id": user_id
        }
    )

    if session is None:
        return None

    return {
        "session_id": session["_id"],
        "topic": session["topic"],
        "messages": session["messages"]
    }









