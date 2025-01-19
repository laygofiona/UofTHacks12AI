from langchain_core.prompts import ChatPromptTemplate
from langchain_cohere import ChatCohere
import os

# Utility functions
def string_to_dict(s):
  """
  Converts a string in the format "key1:value1 key2:value2 ..." 
  to a dictionary.

  Args:
    s: The input string.

  Returns:
    A dictionary with keys and values extracted from the string.
  """
  result = {}
  for pair in s.split():
    key, value = pair.split(":")
    result[key] = int(value) 
  return result

def generate_entry_ai_insights(entry):
    # To reference:
    # AI summary: ai_insights["ai_summary"]
    # Quick takeaway: ai_insights["quick_takeaway"]
    # Alternative scenarios: ai_insights["alternative_scenarios"]
    try:
        ai_summary = generate_ai_output_textual("Generate an emotional, reflective, and concise summary, in narrative form, (less than 75 words) of the choices the user has made based on the journal entry given", entry)
        quick_takewaway = generate_ai_output_textual("Generate a concise quick takeaway from a third person perspective of the user's choices made in the journal entry (less than 75 words). Write in second person and add some of your own valuable insights, as if you're a therapist or psychologist", entry)
        alternative_scenarios = generate_ai_output_textual("Generate an ordered list of five (always different) alternative choices the user could have made and the alternative scenarios within those choices that could have played out (less than 75 words for each scenario). Write in second person and just immediately start with 1. or the first scenario. Continue in order, always start every scenario by the number, and the phrase: \"Could have \"", entry)
        
        nums = ["1", "2", "3", "4", "5"]
        res = []
        l = 0  # Initialize l outside the loop

        for i, char in enumerate(alternative_scenarios):
            if char in nums:
                res.append(alternative_scenarios[l:i])
                l = i + 3  # Important: Move l to the next position after the number

        res.append(alternative_scenarios[l:]) # Append the last part after the loop
        res.pop(0)
        alternative_scenarios = res
        return {
            "ai_summary": ai_summary,
            "quick_takeaway": quick_takewaway,
            "alternative_scenarios": alternative_scenarios
        
        }
    except Exception as e:
        return f"An unexpected error occurred: {e}"
    
def generate_ai_insights_day(entry):
    # Used in main page to get emotional patterns and key themes for entry of the current day
    try:
        ai_insights = generate_ai_output_numerical("Given the journal entry, extract the names of the emotions you can recognize and include from 0-10 how much you think the emotion is conveyed in the journal entry. Give me at least 5 emotions. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" happy:1 sad:5 neutral:9 misreable:4\"", entry)
        key_themes = generate_ai_output_numerical("Given the journal entry, extract the names of the themes you can recognize and include from 0-10 how much you think the theme is conveyed/mentioned in the journal entry. Give me at least 5 themes. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" family:1 work:5 career:9 hobbies:4\"", entry)
        return {
            "ai_insights": ai_insights,
            "key_themes": key_themes
        }
    except Exception as e:
        return f"An unexpected error occurred: {e}"
    
def generate_ai_insights_week(entry):
    # Sample entry:
    # "Today I woke up feeling a strange sense of anticipation. It's a new chapter, a fresh start. I'm excited to see what adventures and challenges await me. I'm determined to make the most of this opportunity and learn as much as I can. ---- The day has flown by in a whirlwind of activity. I met some interesting people, learned a few new things, and even managed to conquer a long-standing procrastination habit. I'm feeling a sense of accomplishment and a renewed sense of motivation. ---- I'm feeling a bit overwhelmed today. The weight of responsibilities seems to be pressing down on me. But I'm trying to stay focused on one task at a time, and I'm reminding myself of the progress I've made so far. Small victories, one step at a time. ---- Today was a day for reflection. I spent some time in nature, observing the quiet beauty around me. It helped me to quiet my mind and gain some perspective. I realized that I need to be kinder to myself, to acknowledge my strengths and forgive my shortcomings. ---- I had a conversation today that really resonated with me. It challenged my assumptions and opened my eyes to a different perspective. I'm grateful for the opportunity to learn and grow from this interaction. ---- Today was a day for celebration! I achieved a long-term goal that I've been working towards for months. The feeling of accomplishment is exhilarating. I'm proud of myself for my perseverance and dedication. ---- I'm feeling a bit lost today. I'm not sure where I'm going or what I'm supposed to be doing. But I'm reminding myself that it's okay to feel uncertain. It's part of the journey. I'll take a deep breath, trust my instincts, and see where the path leads."
    # Used in main page to get emotional patterns and key themes for entry of the current past week
    # Seperate journal entries using ----
    try:
        ai_insights = generate_ai_output_numerical("Given the seven journal entries all seperated by \" ---- \", extract the names of the emotions you can recognize and include from 0-10 how much you think the emotion is conveyed in the journal entries. Give me at least 5 emotions. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" happy:1 sad:5 neutral:9 misreable:4\"", entry)
        key_themes = generate_ai_output_numerical("Given the seven journal entries all separated by \" ---- \", extract the names of the themes you can recognize and include from 0-10 how much you think the theme is conveyed/mentioned in the journal entry. Give me at least 5 themes. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" family:1 work:5 career:9 hobbies:4\"", entry)
        return {
            "ai_insights": ai_insights,
            "key_themes": key_themes
        }
    except Exception as e:
        return f"An unexpected error occurred: {e}"

def generate_ai_insights_month(entry):
    # Used in main page to get emotional patterns and key themes for entry of the current past month
    # Seperate journal entries using ----
    try:
        ai_insights = generate_ai_output_numerical("Given the thirty journal entries all seperated by \" ---- \", extract the names of the emotions you can recognize and include from 0-10 how much you think the emotion is conveyed in the journal entries. Give me at least 5 emotions. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" happy:1 sad:5 neutral:9 misreable:4\"", entry)
        key_themes = generate_ai_output_numerical("Given the thirty journal entries all separated by \" ---- \", extract the names of the themes you can recognize and include from 0-10 how much you think the theme is conveyed/mentioned in the journal entry. Give me at least 5 themes. Make sure to avoid the ValueError: invalid literal for int() with base 10: ''. Do not use , .Sample output should look like: \" family:1 work:5 career:9 hobbies:4\"", entry)
        return {
            "ai_insights": ai_insights,
            "key_themes": key_themes
        }
    except Exception as e:
        return f"An unexpected error occurred: {e}"
        

def generate_ai_output_numerical(prompt, input):
    COHERE_API_KEY = os.environ.get("COHERE_API_KEY")
    system_template = prompt

    model = ChatCohere(model="command-r-plus", api_key=COHERE_API_KEY)

    prompt_template = ChatPromptTemplate.from_messages(
        [("system", system_template), ("user", "{text}")]
    )

    prompt = prompt_template.invoke({"text": input})

    prompt.to_messages()

    response = model.invoke(prompt)
    
    # Clean the output: Remove extra spaces and commas
    cleaned_output = response.content.replace(",", "").replace("  ", " ") 

    return string_to_dict(cleaned_output)
    
def generate_ai_output_textual(prompt, input):
    COHERE_API_KEY = os.environ.get("COHERE_API_KEY")
    system_template = prompt

    model = ChatCohere(model="command-r-plus", api_key=COHERE_API_KEY)

    prompt_template = ChatPromptTemplate.from_messages(
        [("system", system_template), ("user", "{text}")]
    )

    prompt = prompt_template.invoke({"text": input})

    prompt.to_messages()

    response = model.invoke(prompt)

    return response.content

def main():
    ai_insights = generate_entry_ai_insights("I was walking through the park today, I tripped on a rock and fell. I felt sad. I then sat on a park bench and went home. It was a misreable day. I talked to no one")
    #print(generate_ai_insights_day("I was walking through the park today, I tripped on a rock and fell. I felt sad. I then sat on a park bench and went home. It was a misreable day. I talked to no one"))
    print(generate_ai_insights_week("Today I woke up feeling a strange sense of anticipation. It's a new chapter, a fresh start. I'm excited to see what adventures and challenges await me. I'm determined to make the most of this opportunity and learn as much as I can. ---- The day has flown by in a whirlwind of activity. I met some interesting people, learned a few new things, and even managed to conquer a long-standing procrastination habit. I'm feeling a sense of accomplishment and a renewed sense of motivation. ---- I'm feeling a bit overwhelmed today. The weight of responsibilities seems to be pressing down on me. But I'm trying to stay focused on one task at a time, and I'm reminding myself of the progress I've made so far. Small victories, one step at a time. ---- Today was a day for reflection. I spent some time in nature, observing the quiet beauty around me. It helped me to quiet my mind and gain some perspective. I realized that I need to be kinder to myself, to acknowledge my strengths and forgive my shortcomings. ---- I had a conversation today that really resonated with me. It challenged my assumptions and opened my eyes to a different perspective. I'm grateful for the opportunity to learn and grow from this interaction. ---- Today was a day for celebration! I achieved a long-term goal that I've been working towards for months. The feeling of accomplishment is exhilarating. I'm proud of myself for my perseverance and dedication. ---- I'm feeling a bit lost today. I'm not sure where I'm going or what I'm supposed to be doing. But I'm reminding myself that it's okay to feel uncertain. It's part of the journey. I'll take a deep breath, trust my instincts, and see where the path leads."))
    
    
if __name__ == "__main__":
    main()
    
    

    

