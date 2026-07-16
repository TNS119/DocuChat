import shutil
import os
import re
from langchain_chroma import Chroma

def get_vector_store(
    topic_name,
    user_id,
    session_id,
    embeddings
):
    """Return Chroma vector store for a given session.
    """

    # Sanitize topic name for folder/collection path
    safe_topic_name = (topic_name or "default").strip().lower()
    safe_topic_name = re.sub(r"[^a-z0-9\s]", "", safe_topic_name)
    safe_topic_name = re.sub(r"\s+", "_", safe_topic_name)

    # Anchor to backend/ so relative paths don't break based on CWD
    backend_dir = os.path.dirname(__file__)  # backend/Rag
    project_backend_root = os.path.abspath(os.path.join(backend_dir, ".."))  # backend/


    db_path = os.path.join(
        project_backend_root,
        "chroma_langchain_db",
        str(user_id),
        str(session_id)
    )

    db_exists = os.path.exists(db_path)

    if not db_exists:
        os.makedirs(db_path)
    

    if db_exists:
        print(f"[LOAD] Loading existing database from disk: {db_path}")
    else:
        print(f"[NEW] Creating new database at: {db_path}")

    vector_store = Chroma(
        collection_name=safe_topic_name,
        embedding_function=embeddings,
        persist_directory=db_path,
    )

    count = vector_store._collection.count() if hasattr(vector_store, "_collection") else "unknown"
    print(f"  Current documents in collection '{safe_topic_name}': {count}")
    return vector_store





def delete_vector_db(user_id, session_id):

    backend_dir = os.path.dirname(__file__)
    project_backend_root = os.path.abspath(
        os.path.join(backend_dir, "..")
    )

    db_path = os.path.join(
        project_backend_root,
        "chroma_langchain_db",
        str(user_id),
        str(session_id)
    )

    try:
        if os.path.exists(db_path):
            shutil.rmtree(db_path)
            print(f"[DELETED] Vector DB: {db_path}")
            return True

        print(f"[WARN] Vector DB not found: {db_path}")
        return False

    except Exception as e:
        print(f"[ERROR] Error deleting vector DB: {e}")
        return False
