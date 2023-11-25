import openai
from dotenv import dotenv_values


env_config = dotenv_values(".env")
openai.api_key = env_config["OPENAI_API_KEY"]


class OpenAiGptModel:

    def __init__(self,
                 model,
                 system_message_content):
        self.model = model
        self.system_message_content = system_message_content

    def ask(self, prompt: str) -> str:
        messages = [{"role": "system", "content": self.system_message_content},
                    {"role": "user", "content": prompt}]
        response = openai.ChatCompletion.create(
            model=self.model,
            messages=messages,
            temperature=0
        )
        return response.choices[0].message["content"]
