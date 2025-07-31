# main.py / app.py
# BPI Kalasag Backend MVP - Pydantic v2 Compatibility Fix
# This is the single, official backend file for the project.

import os
from bson import Binary
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field
from typing import Optional, Any
from uuid import UUID, uuid4
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from pydantic_core import core_schema

# --- Configuration & Setup ---

# Construct the path to the .env file which is in the parent directory
dotenv_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=dotenv_path)

MONGO_DATABASE_URL = os.getenv("MONGO_DATABASE_URL")
if not MONGO_DATABASE_URL:
    raise ValueError("MONGO_DATABASE_URL environment variable not set or .env file not found.")

# --- Pydantic Models ---

# This is the updated PyObjectId class for Pydantic v2
class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, source_type: Any, handler: Any
    ) -> core_schema.CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.chain_schema([
                    core_schema.str_schema(),
                    core_schema.no_info_plain_validator_function(cls.validate),
                ])
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid ObjectId')
        return ObjectId(v)

# --- Request Models ---
class UserCreateRequest(BaseModel):
    full_name: str
    phone_number: str = Field(..., pattern=r"^\d{11}$")
    email: Optional[str] = None
    age_group: Optional[str] = None

class AccountCreateRequest(BaseModel):
    owner_user_id: UUID
    initial_balance: float = Field(..., ge=0)

class GuardianAdditionRequest(BaseModel):
    senior_user_id: UUID
    guardian_phone_number: str = Field(..., pattern=r"^\d{11}$")

class TransactionRequest(BaseModel):
    source_account_id: UUID
    destination_account_id: Optional[UUID] = None
    amount: float = Field(..., gt=0)

class GuardianFeedbackRequest(BaseModel):
    alert_id: PyObjectId
    feedback: str

# --- FastAPI App Initialization ---
app = FastAPI(
    title="BPI Kalasag API (MongoDB)",
    description="Backend services for the BPI Kalasag MVP using MongoDB.",
    version="4.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/greet", summary="A simple greeting endpoint")
def greet():
    """Returns a simple hello message."""
    return {"message": "Hello from your unified Kalasag API!"}


@app.post("/users", status_code=201, summary="Create a new user")
async def create_user(request: UserCreateRequest):
    """Creates a new user in the database."""
    existing_user = await app.mongodb.users.find_one({"phone_number": request.phone_number})
    if existing_user:
        raise HTTPException(status_code=400, detail="User with this phone number already exists.")

    user_doc = {
        "user_id": Binary.from_uuid(uuid4()),
        "full_name": request.full_name,
        "phone_number": request.phone_number,
        "email": request.email,
        "age_group": request.age_group,
        "is_kalasag_active": False
    }
    await app.mongodb.users.insert_one(user_doc)
    return jsonable_encoder(user_doc)


@app.post("/accounts", status_code=201, summary="Create a new bank account for a user")
async def create_account(request: AccountCreateRequest):
    """Creates a new bank account linked to a user with an initial balance."""
    owner = await app.mongodb.users.find_one({"user_id": request.owner_user_id})
    if not owner:
        raise HTTPException(status_code=404, detail="Owner user not found.")

    account_doc = {
        "account_id": uuid4(),
        "owner_user_id": request.owner_user_id,
        "account_number": str(uuid4())[:12].replace('-', ''),
        "balance": request.initial_balance,
        "account_type": "savings",
        "status": "active"
    }
    await app.mongodb.accounts.insert_one(account_doc)
    return jsonable_encoder(account_doc)


@app.post("/add-guardian", status_code=201, summary="Invite a guardian")
async def add_guardian(request: GuardianAdditionRequest):
    """Allows a senior user to invite another user to be their guardian."""
    guardian_user = await app.mongodb.users.find_one({"phone_number": request.guardian_phone_number})
    if not guardian_user:
        raise HTTPException(status_code=404, detail="Guardian with the provided phone number not found.")

    guardian_user_id = guardian_user["user_id"]

    existing_relationship = await app.mongodb.guardians.find_one({
        "senior_user_id": request.senior_user_id,
        "guardian_user_id": guardian_user_id
    })
    if existing_relationship:
        raise HTTPException(status_code=400, detail="Guardian relationship already exists.")

    new_guardian_link = {
        "guardian_relationship_id": uuid4(),
        "senior_user_id": request.senior_user_id,
        "guardian_user_id": guardian_user_id,
        "status": "pending"
    }
    await app.mongodb.guardians.insert_one(new_guardian_link)
    return {"message": "Guardian invitation sent successfully."}


@app.post("/transactions", summary="Create a financial transaction")
async def create_transaction(request: TransactionRequest):
    """Creates a financial transaction and triggers an alert if it's high-risk."""
    is_high_risk = request.amount > 5000.00
    transaction_status = "pending_review" if is_high_risk else "completed"

    transaction_doc = {
        "transaction_id": uuid4(),
        "source_account_id": request.source_account_id,
        "destination_account_id": request.destination_account_id,
        "amount": request.amount,
        "transaction_type": "transfer",
        "status": transaction_status,
        "is_flagged_as_high_risk": is_high_risk
    }
    await app.mongodb.transactions.insert_one(transaction_doc)

    if is_high_risk:
        source_account = await app.mongodb.accounts.find_one({"account_id": request.source_account_id})
        if not source_account:
             raise HTTPException(status_code=404, detail="Source account not found.")

        guardian_relationship = await app.mongodb.guardians.find_one({
            "senior_user_id": source_account["owner_user_id"],
            "status": "active"
        })

        if guardian_relationship:
            alert_doc = {
                "guardian_relationship_id": guardian_relationship["guardian_relationship_id"],
                "transaction_id": transaction_doc["transaction_id"],
                "alert_type": "high_amount",
                "status": "sent"
            }
            await app.mongodb.alerts.insert_one(alert_doc)
            print(f"SMS SIMULATION: Sent alert for transaction {transaction_doc['transaction_id']}")

        return {"message": "Transaction is under review. Guardian has been alerted."}
    else:
        await app.mongodb.accounts.update_one(
            {"account_id": request.source_account_id},
            {"$inc": {"balance": -request.amount}}
        )
        if request.destination_account_id:
            await app.mongodb.accounts.update_one(
                {"account_id": request.destination_account_id},
                {"$inc": {"balance": request.amount}}
            )
        return {"message": "Transaction completed successfully."}


@app.post("/guardian-feedback", summary="Submit feedback for an alert")
async def guardian_feedback(request: GuardianFeedbackRequest):
    """Allows a guardian to approve or deny a pending high-risk transaction."""
    alert = await app.mongodb.alerts.find_one({"_id": request.alert_id})
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found.")

    transaction_id = alert["transaction_id"]
    transaction = await app.mongodb.transactions.find_one({"transaction_id": transaction_id})
    if not transaction or transaction["status"] != 'pending_review':
        raise HTTPException(status_code=400, detail="Transaction is not pending review.")

    if request.feedback.lower() == 'approved':
        await app.mongodb.accounts.update_one(
            {"account_id": transaction["source_account_id"]},
            {"$inc": {"balance": -transaction["amount"]}}
        )
        if transaction["destination_account_id"]:
            await app.mongodb.accounts.update_one(
                {"account_id": transaction["destination_account_id"]},
                {"$inc": {"balance": transaction["amount"]}}
            )
        await app.mongodb.transactions.update_one(
            {"transaction_id": transaction_id},
            {"$set": {"status": "completed"}}
        )
        return {"message": "Transaction approved and completed."}

    elif request.feedback.lower() == 'denied':
        await app.mongodb.transactions.update_one(
            {"transaction_id": transaction_id},
            {"$set": {"status": "cancelled"}}
        )
        return {"message": "Transaction denied and cancelled."}
    else:
        raise HTTPException(status_code=400, detail="Invalid feedback provided. Use 'approved' or 'denied'.")
