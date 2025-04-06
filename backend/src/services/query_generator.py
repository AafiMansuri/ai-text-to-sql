import ollama

# Direct configuration
OLLAMA_MODEL = "bisag-gemma2"  # or whatever model you're using

def generate_sql(user_input, ddl):
    prompt = f"DDL defining the consolated view: \n{ddl.strip()}\nGenerate an SQL query based on the following question: {user_input} \nOnly return the SQL query in plain text."
    
    client = ollama.Client()
    response = client.generate(model=OLLAMA_MODEL, prompt=prompt)

    query = response.response.strip()

    print(query)
    
    return query.replace("```sql", "").replace("```", "").strip()

