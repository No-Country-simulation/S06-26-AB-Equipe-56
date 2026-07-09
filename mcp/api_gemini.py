from dotenv import load_dotenv
from PIL import Image
from fastapi import UploadFile
import re
import json
import io
import os
import sys

caminho_absoluto = os.path.abspath(os.curdir)
sys.path.insert(0, caminho_absoluto)
load_dotenv()

async def scrape_images_from_gemini(file: UploadFile):
    from google import genai
    
    CHAVE_API = os.getenv("API_KEY_GEMINI")
    client = genai.Client(api_key=CHAVE_API)
    
    conteudo = await file.read()
    imagem = Image.open(io.BytesIO(conteudo))

    # 2. Escreva o seu prompt
    prompt = """
    Vou te fornecer a imagem de um comprovante de pagamento. Por favor, analise a imagem e extraia as seguintes informações: o valor do comprovante, o CNPJ da empresa, a data e o horário (se estiverem disponíveis)
    
    {
        "valor": 50.50,
        "cnpj": "XX.XXX.XXX/0001-XX",
        "data": "YYYY-MM-DD",
        "horario": "HH:MM"
    }
```"
    
    """

    # 3. Envie o prompt e a imagem juntos como uma lista no parâmetro 'contents'
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=[prompt, imagem] # É aqui que a mágica acontece!
    )
    texto_extraido = re.search(r"\{.*\}", response.text, re.DOTALL)
    print(texto_extraido)
    json_response = texto_extraido.group(0) if texto_extraido else "Não foi possível extrair os dados."
    json_final = json_response.replace("\n", "").replace(" ", "")
    json_final = json.loads(json_final)
    print(json_final)
    return json_final