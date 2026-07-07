import os
import json
from dotenv import load_dotenv
from pprint import pprint
import re
import shutil

# env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv()

from langchain_groq import ChatGroq
# from langchain_community.document_loaders import PyPDFLoader
from langchain_community.vectorstores.utils import filter_complex_metadata
from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_huggingface import HuggingFaceEmbeddings
# from langchain_huggingface import HuggingFaceEndpointEmbeddings
from langchain_chroma import Chroma
from Rag.embeddings import HFEmbedding
from services.mongodb import (
    create_session,
    session_exists,
    save_chat_turn,
    get_chat_history
)
from services.documents_reader import read_Document

#Saved upto here 143
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

print(f"Debug: GROQ_API_KEY loaded: {'Yes' if GROQ_API_KEY else 'No'}")
print(f"Debug: HF_TOKEN loaded: {'Yes' if HF_TOKEN else 'No'}")


def get_vector_store(topic_name,session_id, embeddings):
    # Sanitize topic name for folder path
    safe_topic_name = topic_name.strip().lower()
    safe_topic_name = re.sub(r'[^a-z0-9\s]', '', safe_topic_name) 
    safe_topic_name = re.sub(r'\s+', '_', safe_topic_name)  
    
    db_path = f"./chroma_langchain_db/{safe_topic_name}/{session_id}"
    
    # Check if database already exists on disk
    if os.path.exists(db_path):
        print(f"✓ LOADING EXISTING database from disk: {db_path}")
        print(f"  Collection name: {safe_topic_name}")
    else:
        print(f"✓ CREATING NEW database at: {db_path}")
        print(f"  Collection name: {safe_topic_name}")
    
    vector_store = Chroma(
        collection_name=safe_topic_name,
        embedding_function=embeddings,
        persist_directory=db_path,  
    )
    
    # Show current collection stats
    count = vector_store._collection.count() if hasattr(vector_store, '_collection') else "unknown"
    print(f"  Current documents in collection: {count}")
    
    return vector_store

def clean_response(text):
    cleaned = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
    
    return cleaned.strip()

def Rag_core(given_data):
    try:
        # Load embeddings
        # embeddings = HuggingFaceEmbeddings(
        #     model_name="sentence-transformers/all-mpnet-base-v2"
        # )
        # type-2(to avoid sentence-transformers installing....)
        # embeddings = HuggingFaceEndpointEmbeddings(
        #     api_key= HF_TOKEN,
        #     model_name="sentence-transformers/all-MiniLM-L6-v2"
        # )
        # type-3(working)
        embeddings = HFEmbedding(HF_TOKEN)

        # print(type(embeddings3.embed_query("Hello")))
        # print(len(embeddings3.embed_query("Hello")))

        session_id = given_data.get("session_id", "default")
        print(f"got session_id: {session_id}")

        topic_name = given_data.get("topic_name")      
        print(f"got topic_name: {topic_name}")

        if not session_exists(session_id):
            print("Creating Mongodb Session id")
            create_session(
                session_id,
                topic_name
            )

        history = get_chat_history(session_id)

        recent_history = history[-2:]

        # print(f"Recent history: {recent_history}")

        topic_name = given_data.get("topic_name", "default")
        print(f"Processing topic: {topic_name}")
        
        # Load/create persistent vector store for this topic
        vector_store = get_vector_store(topic_name, session_id, embeddings)
            
    except Exception as e:
        print(f"Error initializing vector store: {str(e)}")
        raise
    
    
    def Pdf_Indexing(file_path, vector_store):
        """
        Indexes a PDF file into the vector store.
        
        How it works:
        1. Load PDF from file_path
        2. Split text into chunks
        3. Create embeddings for each chunk
        4. Add to vector_store (which knows persist_directory from creation)
        5. Chroma automatically saves embeddings to disk
        """
        # Adjust path to work from python_services directory
        # If path doesn't exist, try with parent directory
        print(f"\n📄 Processing PDF: {file_path}")

        if not os.path.isfile(file_path):
            raise FileNotFoundError(f"PDF file not found: {file_path}")
            
        # loader = PyPDFLoader(file_path)
        # docs = loader.load()


        docs = read_Document(file_path)
        docs = filter_complex_metadata(docs)
        print(f" ✓Loaded {len(docs)} Docling chunks")

        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            add_start_index=True,
        )

        all_splits = text_splitter.split_documents(docs)
        print(f"  ✓ Text split into {len(all_splits)} chunks")

        print(f"\n→ Adding {len(all_splits)} document chunks to vector database...")
        document_ids = vector_store.add_documents(documents=all_splits)
        print(f"✓ SUCCESSFULLY added {len(document_ids)} documents")
        print(f"✓ Data automatically persisted to disk\n")
        
        sample = vector_store.get(limit=1, include=["embeddings", "documents"])

    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY not set in environment")
    
    model = ChatGroq(
        model="llama-3.3-70b-versatile",
        api_key=GROQ_API_KEY,
    )

    def Quering(input_query, vector_store):
        
        def retrieve_context(query: str, k: int = 5):
            retrieved_docs = vector_store.similarity_search(query, k=k)

            docs_content = ""
            for doc in retrieved_docs:
                docs_content += f"Source: {doc.metadata}\n"
                docs_content += f"Content: {doc.page_content}\n\n"

            return docs_content, retrieved_docs


        def ask_about_pdf(user_query):
            context, source_docs = retrieve_context(user_query, k=5)

            # print(f"the pdf lines are {context}")
            print(f"********************the input query is  \"{user_query}\"")
            system_message = f"""You are a helpful PDF Chatbot.with No hallucinations, only provided contex content as response.
                                    Use the provided PDF context to answer user questions accurately.
                                    If the user asks a question that can be answered from the PDF context, answer using the context.
                                    If the user asks a follow-up question, use the conversation history to understand the reference, but answer based on the PDF context.
                                    If the PDF does not contain enough information to answer the question, politely say that the information was not found in the 
                                    uploaded PDF.(initially inform its not there in provided contex and bring back to given context again and dont ask for new context(ignore it))
                                    provide horizontal seperation lines in between the response section for clarity easy understanding of each part of it only if required.
                                    Never reveal your reasoning process.
                                    Answer directly without mentioning the PDF unless the user asks.
                                    Do not output <think>, reasoning, analysis, internal thoughts, or step-by-step deliberation.
                                    Do not make up facts that are not supported by the PDF context.(halucinate).
                                    Try to extend the convo within contex for further assistance(only inside pdf context).
                                    Don't make up any new information:
                                Context:
                                {context}"""

            messages = [
                {"role": "system", "content": system_message}
            ]

            messages.extend(recent_history)
            messages.append(
                {
                    "role": "user",
                    "content": user_query
                }
            )

            # pprint(messages)
            
            try:
                response = model.invoke(messages)
            except Exception as e:
                print(f"LLM model Error:{e}")
                raise  

            answer = clean_response(response.content)
            
            saved = save_chat_turn(session_id,user_query,answer)
            # pprint(f"chart Session:{chat_session}")
            if not saved:
                print("The db is not updated with history")
            else:
                print("Db is updated")

            return {
                "answer": response.content,
                "source_documents": source_docs,
                "context_used": context
            }

        return ask_about_pdf(input_query)

    try:
        if given_data.get("status") and "pdf_path" in given_data:

            print(f"Got session_id:{session_id}")
            # New PDF - index it
            print(f"Indexing PDF for topic: {topic_name}")
            pdf_path = given_data["pdf_path"]

            print(f"Received PDF : {pdf_path}")

            Pdf_Indexing(given_data["pdf_path"], vector_store)
            result = Quering(given_data["query"], vector_store)

            # print(result)
            print(result["answer"])
            answer = clean_response(result["answer"])

            return answer
        elif "query" in given_data:

            # Query existing indexed PDF
            print(f"Querying topic: {topic_name}")
            print(f"Got session_id in query:{session_id}")

            result = Quering(given_data["query"], vector_store)
            # print(result["context_used"])

            # print(result["answer"])
            answer = clean_response(result["answer"])
            print("Response sent...")
            return answer
        else:
            raise ValueError("Invalid request: must provide 'query' and optionally 'pdf_path'")
    except Exception as e:

        print(f"Error processing request: {str(e)}")
        raise
    
