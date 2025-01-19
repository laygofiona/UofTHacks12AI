from fastapi import FastAPI, Request, Query, HTTPException
from typing import List, Dict, Any # Import for type hinting
#  AI_Insights.py is in the same directory
from AI_Insights import generate_entry_ai_insights, generate_ai_insights_day, generate_ai_insights_week, generate_ai_insights_month
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('./serviceAccount.json')

app = firebase_admin.initialize_app(cred)

db = firestore.client()

app = FastAPI()

# POST endpoint to generate entry insights in the individual entry page
@app.post("/entry_insights")  
async def generate_insights_endpoint_entry(request: Request): 
    try:
        user_input = await request.json()
        # Pass the entry to generate AI entry insights for that current day  
        insights = generate_entry_ai_insights(user_input["entry"]) 
        return insights  # Return the result as JSON
    except Exception as e:
        return {"error": str(e)}, 500  
        # Return an error with a 500 status code
        
# POST endpoint to add entry to database
@app.post("/entry")  
async def add_entry(request: Request): 
    try:
        user_input = await request.json()
        
        doc_ref = db.collection("entries").document()
        
        # Get AI feedback
        # Pass the entry to generate AI entry insights for that current day  
        insights = generate_entry_ai_insights(user_input["entry"]) 
        
        entry_doc = {
            "entry": user_input["entry"],
            "ai_summary": insights["ai_summary"],
            "quick_takeaway": insights["quick_takeaway"],
            "alternative_scenarios": insights["alternative_scenarios"],
            "overall_emotion": insights["overall_emotion"],
            "id": doc_ref.id,
            "created-at": firestore.SERVER_TIMESTAMP
        }
        
        doc_ref.set(entry_doc)

        return 200
    except Exception as e:
        return {"error": str(e)}, 500  
        # Return an error with a 500 status code



# GET point to get indivudal entry
@app.get("/entry/{id}")  
async def get_entry(id: str):  # 'id' is a path parameter, so declare it directly
    try:
        doc_ref = db.collection("entries").document(id)
        doc = doc_ref.get()
        if doc.exists:
            entry_data = doc.to_dict()
            return entry_data
        else:
            raise HTTPException(status_code=404, detail="Entry not found")  # Return 404 if not found

    except Exception as e:
        # Log the error for debugging (important in production)
        print(f"Error retrieving entry: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}") # Raise HTTPException to handle the error


# GET endpoint to get list of entries 
@app.get("/entries")
async def get_entries():
    try:
        entries_ref = db.collection("entries")
        entries = entries_ref.stream()  # Stream of Firestore documents

        # List to store the fetched entries (documents)
        all_entries = []

        for entry in entries:  # Iterate asynchronously through the stream
            entry_data = entry.to_dict()  # Convert each document to a dictionary
            all_entries.append(entry_data)

        return all_entries  # Return the list of entries (dictionaries)

    except Exception as e:
        return {"error": str(e)}, 500  # Return an error with a 500 status code

# POST endpoint to generate AI insights for home/mainpage
@app.post("/generate_ai_insights_main")  
async def generate_insights_endpoint_main(request: Request, timeframe: str = Query(..., description="Timeframe for which to generate insights (required)")): 
    try:
        user_input = await request.json()
        # Pass the entry to generate AI entry insights for that current time frame, for display on main/home page
        if(timeframe == "day"):     
            insights = generate_ai_insights_day(user_input["entry"]) 
        elif(timeframe == "week"):
            insights = generate_ai_insights_week(user_input["entry"])
        elif(timeframe == "month"):
             insights = generate_ai_insights_month(user_input["entry"])
             
        return insights  # Return the result as JSON
    except Exception as e:
        return {"error": str(e)}, 500  
        # Return an error with a 500 status code


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) # Start the server
    
    
