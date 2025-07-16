from langchain.chains import SequentialChain
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage, HumanMessage
from langchain.prompts.chat import ChatPromptTemplate
import openai

# Replace with your OpenRouter API key
OPENROUTER_API_KEY = "your-api-key"

# Set OpenRouter-compatible ChatOpenAI models
gpt_executor = ChatOpenAI(model="openai/gpt-4", openai_api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")
claude_refiner = ChatOpenAI(model="anthropic/claude-3-opus", openai_api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")
command_validator = ChatOpenAI(model="nousresearch/command-r-plus", openai_api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")
mistral_tester = ChatOpenAI(model="mistralai/mistral-large", openai_api_key=OPENROUTER_API_KEY, base_url="https://openrouter.ai/api/v1")

# Define prompt templates for each agent
executor_prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You are the Tactical Executor for an AI-powered publishing empire."),
    HumanMessage(content="{input}")
])

refiner_prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You refine tone and polish for trauma-aware, literary content."),
    HumanMessage(content="{input}")
])

validator_prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You validate niche data using BSRs, search volume, and Google Trends."),
    HumanMessage(content="{input}")
])

tester_prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You generate and test viral ad hooks, emotional CTAs, and headlines."),
    HumanMessage(content="{input}")
])

# Create chains for each model
from langchain.chains import LLMChain

executor_chain = LLMChain(llm=gpt_executor, prompt=executor_prompt, output_key="phase1")
refiner_chain = LLMChain(llm=claude_refiner, prompt=refiner_prompt, input_key="phase1", output_key="phase2")
validator_chain = LLMChain(llm=command_validator, prompt=validator_prompt, input_key="phase2", output_key="phase3")
tester_chain = LLMChain(llm=mistral_tester, prompt=tester_prompt, input_key="phase3", output_key="final_output")

# Chain all phases sequentially
full_chain = SequentialChain(
    chains=[executor_chain, refiner_chain, validator_chain, tester_chain],
    input_variables=["input"],
    output_variables=["final_output"],
    verbose=True
)

# Example run
if __name__ == "__main__":
    result = full_chain.run("Scan top 10 profitable neurodivergent-friendly ebook niches using real market data.")
    print(result)
