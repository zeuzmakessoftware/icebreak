from gmicloud import call_llm

system_prompt = "You are a helpful AI assistant"
user_message = "List 3 countries and their capitals."

result = call_llm(system_prompt, user_message)
print(result)
