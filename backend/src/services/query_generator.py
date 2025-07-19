import re
import ollama

# Direct configuration
OLLAMA_MODEL = "askdb-gemma2"

def generate_sql(user_input, ddl):
    prompt = f"DDL defining the consolated view: \n{ddl.strip()}\nGenerate an SQL query based on the following question: {user_input} \n. Do not use any alias for the columns."
    
    client = ollama.Client()
    response = client.generate(model=OLLAMA_MODEL, prompt=prompt)
    raw_response = response.response.strip()

    print("LLM raw response:", raw_response)

    match = re.search(r"```sql\s*(.+?)\s*```", raw_response, re.DOTALL)
    sql_query = match.group(1).strip() if match else None

    cleaned_message = re.sub(r"```sql\s*.+?\s*```", "", raw_response, flags=re.DOTALL).strip()
    
        
    return cleaned_message, sql_query

