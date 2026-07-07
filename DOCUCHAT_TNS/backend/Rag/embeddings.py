from huggingface_hub import InferenceClient


class HFEmbedding:

    def __init__(self, api_key):
        self.client = InferenceClient(
            provider="hf-inference",
            api_key=api_key
        )

        self.model = "sentence-transformers/all-MiniLM-L6-v2"

    def embed_query(self, text):

        embedding = self.client.feature_extraction(
            text,
            model=self.model
        )

        return embedding.tolist()

    def embed_documents(self, texts):

        embeddings = []

        # for text in texts:
        #     embedding = self.client.feature_extraction(
        #         text,
        #         model=self.model
        #     )

        #     embeddings.append(embedding.tolist())

        embeddings = self.client.feature_extraction(
            texts,
            model=self.model
        )
        embeddings.tolist()

        return embeddings