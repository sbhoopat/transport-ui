from fastapi import APIRouter, Depends, HTTPException, Response, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models import Expense, User
from app.schemas import ExpenseCreate, ExpenseResponse
from typing import List, Optional
import uuid
import pandas as pd
from io import BytesIO
from datetime import datetime

router = APIRouter()

def get_current_user_id(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

def verify_admin(user_id: str, db: Session):
    user = db.query(User).filter(User.id == user_id).first()
    if not user or user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/expenses", response_model=List[ExpenseResponse])
async def get_expenses(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    verify_admin(current_user_id, db)
    expenses = db.query(Expense).all()
    return expenses

@router.post("/expenses", response_model=ExpenseResponse)
async def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    verify_admin(current_user_id, db)
    
    expense = Expense(
        id=str(uuid.uuid4()),
        user_id=current_user_id,
        category=expense_data.category,
        amount=expense_data.amount,
        description=expense_data.description
    )
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense

@router.get("/expenses/export")
async def export_expenses(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id),
    format: str = "xlsx"
):
    verify_admin(current_user_id, db)
    
    expenses = db.query(Expense).all()
    
    # Convert to DataFrame
    data = [{
        "Category": exp.category,
        "Amount": exp.amount,
        "Description": exp.description,
        "Date": exp.date.isoformat() if exp.date else ""
    } for exp in expenses]
    
    df = pd.DataFrame(data)
    
    # Create file
    output = BytesIO()
    if format == "csv":
        df.to_csv(output, index=False)
        media_type = "text/csv"
        filename = "expenses.csv"
    else:
        df.to_excel(output, index=False, engine="openpyxl")
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        filename = "expenses.xlsx"
    
    output.seek(0)
    
    return Response(
        content=output.read(),
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

@router.get("/expenses/summary")
async def get_expense_summary(
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user_id)
):
    verify_admin(current_user_id, db)
    
    expenses = db.query(Expense).all()
    
    # Group by category
    summary = {}
    for exp in expenses:
        if exp.category not in summary:
            summary[exp.category] = 0
        summary[exp.category] += exp.amount
    
    return {
        "by_category": summary,
        "total": sum(summary.values())
    }

