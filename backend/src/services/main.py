# from query_generator import generate_sql
# from db_queries import execute_query
# from ddl_loader import load_ddl

# if __name__ == "__main__":
#     view_name = "students_view"
#     role = "user"
#     ddl_statement = load_ddl(view_name)

#     if not ddl_statement:
#         print(f"Error: No DDL found for view '{view_name}'")
#         exit(1)
    
#     while True:
#         question = input("User: ").strip()

#         if not question:
#             print("Error: No question provided!")
#             exit(1)

#         if question.lower() == "exit":
#             exit(1)
            
#         sql_query = generate_sql(user_input=question, ddl=ddl_statement)

#         print("\nGenerated SQL Query:")
#         print(sql_query)


#         try:
#             result = execute_query(sql_query,role)
#             if result.empty:
#                 print("\nNo results found.")
#             else:
#                 print("\nQuery Results:")
#                 print(result)
#         except Exception as e:
#             print(f"\nError executing the query: {e}")