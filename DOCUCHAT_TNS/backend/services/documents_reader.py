from langchain_docling import DoclingLoader
from langchain_docling.loader import ExportType

def read_Document(file_path):

    loader = DoclingLoader(
        file_path=file_path,
        export_type=ExportType.DOC_CHUNKS
    )
    
    docs = loader.load()
     
    return docs

