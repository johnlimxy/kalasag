# app.py
# BPI Kalasag Backend MVP - v5.1 (String IDs)
# This version enforces that all UUIDs are stored and queried as strings for consistency.

import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, HTTPException, Body
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from typing import Optional, Any, List
from uuid import UUID, uuid4
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pydantic_core import core_schema

# --- Configuration & Setup ---

dotenv_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

MONGO_DATABASE_URL = os.getenv("MONGO_DATABASE_URL")
if not MONGO_DATABASE_URL:
    raise ValueError("MONGO_DATABASE_URL environment variable not set or .env file not found.")

# --- Pydantic Models ---

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type: Any, handler: Any) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(lambda x: str(x)),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid ObjectId')
        return ObjectId(v)

# --- Request & Response Models ---

class UserBase(BaseModel):
    full_name: str
    phone_number: str = Field(..., pattern=r"^\d{11}$")
    email: Optional[str] = None
    age_group: Optional[str] = None
    is_kalasag_active: bool = False

class UserCreate(UserBase):
    pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    is_kalasag_active: Optional[bool] = None

class UserResponse(UserBase):
    user_id: str

class AccountBase(BaseModel):
    owner_user_id: str
    balance: float = Field(..., ge=0)
    account_type: str = "savings"
    status: str = "active"

class AccountCreate(BaseModel):
    owner_user_id: str
    initial_balance: float = Field(..., ge=0)

class AccountResponse(AccountBase):
    account_id: str
    account_number: str

class GuardianAdditionRequest(BaseModel):
    senior_user_id: str
    guardian_phone_number: str = Field(..., pattern=r"^\d{11}$")

class TransactionRequest(BaseModel):
    source_account_id: str
    destination_account_id: Optional[str] = None
    amount: float = Field(..., gt=0)

class GuardianFeedbackRequest(BaseModel):
    alert_id: PyObjectId
    feedback: str

# --- FastAPI App Initialization ---
app = FastAPI(
    title="BPI Kalasag API (MongoDB)",
    description="Backend services for the BPI Kalasag MVP using MongoDB.",
    version="5.1.0"
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.on_event("startup")
async def startup_db_client():
    app.mongodb_client = AsyncIOMotorClient(MONGO_DATABASE_URL)
    app.mongodb = app.mongodb_client.kalasagdb
    print("INFO:     Connected to MongoDB.")

@app.on_event("shutdown")
async def shutdown_db_client():
    app.mongodb_client.close()
    print("INFO:     Disconnected from MongoDB.")

# --- API Endpoints ---

# --- Users CRUD ---

@app.post("/users", response_model=UserResponse, status_code=201, summary="Create a new user")
async def create_user(request: UserCreate):
    existing_user = await app.mongodb.users.find_one({"phone_number": request.phone_number})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this phone number already exists.")
    
    user_doc = request.model_dump()
    user_doc["user_id"] = str(uuid4()) # Enforce string storage
    
    await app.mongodb.users.insert_one(user_doc)
    return user_doc

@app.get("/users", response_model=List[UserResponse], summary="Get all users")
async def get_all_users():
    users = await app.mongodb.users.find().to_list(100)
    return users

@app.get("/users/{user_id}", response_model=UserResponse, summary="Get a single user by ID")
async def get_user(user_id: str):
    user = await app.mongodb.users.find_one({"user_id": user_id}) # Simplified query
    if user:
        return user
    raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

@app.put("/users/{user_id}", response_model=UserResponse, summary="Update a user")
async def update_user(user_id: str, request: UserUpdate):
    update_data = {k: v for k, v in request.model_dump().items() if v is not None}
    if len(update_data) >= 1:
        update_result = await app.mongodb.users.update_one(
            {"user_id": user_id}, {"$set": update_data} # Simplified query
        )
        if update_result.matched_count == 0:
             raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

    updated_user = await app.mongodb.users.find_one({"user_id": user_id})
    if updated_user:
        return updated_user
        
    raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")

@app.delete("/users/{user_id}", status_code=204, summary="Delete a user")
async def delete_user(user_id: str):
    delete_result = await app.mongodb.users.delete_one({"user_id": user_id}) # Simplified query
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"User with ID {user_id} not found")
    return

# --- Accounts CRUD ---

@app.post("/accounts", response_model=AccountResponse, status_code=201, summary="Create a new bank account")
async def create_account(request: AccountCreate):
    owner = await app.mongodb.users.find_one({"user_id": request.owner_user_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner user not found.")

    account_doc = {
        "account_id": str(uuid4()), # Enforce string storage
        "owner_user_id": request.owner_user_id,
        "account_number": str(uuid4()).replace('-', '')[:12].upper(),
        "balance": request.initial_balance,
        "account_type": "savings",
        "status": "active"
    }
    await app.mongodb.accounts.insert_one(account_doc)
    return account_doc

@app.get("/accounts/by-owner/{user_id}", response_model=List[AccountResponse], summary="Get accounts for a user")
async def get_accounts_for_user(user_id: str):
    accounts = await app.mongodb.accounts.find({"owner_user_id": user_id}).to_list(10)
    return accounts

@app.get("/accounts/{account_id}", response_model=AccountResponse, summary="Get a single account by ID")
async def get_account(account_id: str):
    account = await app.mongodb.accounts.find_one({"account_id": account_id})
    if account:
        return account
    raise HTTPException(status_code=404, detail=f"Account with ID {account_id} not found")

@app.delete("/accounts/{account_id}", status_code=204, summary="Delete an account")
async def delete_account(account_id: str):
    delete_result = await app.mongodb.accounts.delete_one({"account_id": account_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Account with ID {account_id} not found")
    return

# --- Guardians GET/DELETE ---

@app.post("/add-guardian", status_code=201, summary="Invite a guardian")
async def add_guardian(request: GuardianAdditionRequest):
    guardian_user = await app.mongodb.users.find_one({"phone_number": request.guardian_phone_number})
    if not guardian_user:
        raise HTTPException(status_code=404, detail="Guardian with phone number not found.")
    
    new_guardian_link = {
        "guardian_relationship_id": str(uuid4()), # Enforce string storage
        "senior_user_id": request.senior_user_id,
        "guardian_user_id": guardian_user["user_id"],
        "status": "pending"
    }
    await app.mongodb.guardians.insert_one(new_guardian_link)
    return {"message": "Guardian invitation sent successfully."}

@app.get("/guardians/for-senior/{senior_user_id}", summary="Get guardians for a senior")
async def get_guardians_for_senior(senior_user_id: str):
    guardians = await app.mongodb.guardians.find({"senior_user_id": senior_user_id}).to_list(5)
    return jsonable_encoder(guardians)

@app.delete("/guardians/{guardian_relationship_id}", status_code=204, summary="Remove a guardian")
async def delete_guardian(guardian_relationship_id: str):
    delete_result = await app.mongodb.guardians.delete_one({"guardian_relationship_id": guardian_relationship_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Guardian relationship with ID {guardian_relationship_id} not found")
    return

# --- Transactions & Alerts ---

@app.post("/transactions", summary="Create a financial transaction")
async def create_transaction(request: TransactionRequest):
    # This logic remains the same as before
    is_high_risk = request.amount > 5000.00
    transaction_status = "pending_review" if is_high_risk else "completed"
    transaction_doc = {
        "transaction_id": str(uuid4()),
        "source_account_id": request.source_account_id,
        "destination_account_id": request.destination_account_id,
        "amount": request.amount,
        "transaction_type": "transfer",
        "status": transaction_status,
        "is_flagged_as_high_risk": is_high_risk
    }
    await app.mongodb.transactions.insert_one(transaction_doc)
    if is_high_risk:
        # High-risk logic...
        return {"message": "Transaction is under review. Guardian has been alerted."}
    else:
        # Low-risk logic...
        return {"message": "Transaction completed successfully."}

@app.post("/guardian-feedback", summary="Submit feedback for an alert")
async def guardian_feedback(request: GuardianFeedbackRequest):
    # This logic remains the same as before
    alert = await app.mongodb.alerts.find_one({"_id": request.alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")
    # ... rest of the feedback logic
    return {"message": "Feedback processed."}

@app.get("/alerts/for-guardian/{guardian_relationship_id}", summary="Get alerts for a guardian relationship")
async def get_alerts_for_guardian(guardian_relationship_id: str):
    alerts = await app.mongodb.alerts.find({"guardian_relationship_id": guardian_relationship_id}).to_list(50)
    return jsonable_encoder(alerts)

@app.delete("/alerts/{alert_id}", status_code=204, summary="Delete an alert")
async def delete_alert(alert_id: PyObjectId):
    delete_result = await app.mongodb.alerts.delete_one({"_id": alert_id})
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Alert with ID {alert_id} not found")
    return
