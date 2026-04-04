from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, BackgroundTasks
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'clipay-secret-key-2024-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 72

# Create the main app
app = FastAPI(title="CLIPAY API", version="1.0.0")
api_router = APIRouter(prefix="/api")
security = HTTPBearer()

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# ==================== PYDANTIC MODELS ====================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    referral_code: str
    mobile: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    email: str
    referral_code: str
    referred_by: Optional[str] = None
    balance: float = 0.0
    total_earnings: float = 0.0
    total_withdrawn: float = 0.0
    active_package: Optional[str] = None
    package_expiry: Optional[str] = None
    rank: str = "None"
    is_blocked: bool = False
    created_at: str
    role: str = "user"

class UserUpdate(BaseModel):
    name: Optional[str] = None
    usdt_wallet: Optional[str] = None
    jazzcash_number: Optional[str] = None
    password: Optional[str] = None

class PackageResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    price: float
    daily_ads: int
    earning_per_ad: float
    duration_days: int
    matrix_level: int
    is_active: bool = True

class PackageCreate(BaseModel):
    name: str
    price: float
    daily_ads: int
    earning_per_ad: float
    duration_days: int
    matrix_level: int

class DepositCreate(BaseModel):
    amount: float
    gateway: str
    txid: Optional[str] = None

class DepositResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    user_name: str
    amount: float
    gateway: str
    txid: Optional[str] = None
    status: str
    created_at: str
    processed_at: Optional[str] = None

class WithdrawCreate(BaseModel):
    amount: float
    gateway: str
    wallet_address: str

class WithdrawResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    user_email: str
    user_name: str
    amount: float
    gateway: str
    wallet_address: str
    status: str
    created_at: str
    processed_at: Optional[str] = None

class WatchLinkResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    title: str
    url: str
    platform: str
    earning: float
    is_active: bool = True

class WatchLinkCreate(BaseModel):
    title: str
    url: str
    platform: str
    earning: float

class TransactionResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    type: str
    amount: float
    description: str
    status: str
    created_at: str

class RankResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    name: str
    required_team_size: int
    required_directs: int
    reward: float
    is_active: bool = True

class RankCreate(BaseModel):
    name: str
    required_team_size: int
    required_directs: int
    reward: float

class MLMSettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    level1_percent: float
    level2_percent: float
    level3_percent: float
    matrix_width: int

class MLMSettingsUpdate(BaseModel):
    level1_percent: float
    level2_percent: float
    level3_percent: float
    matrix_width: int

class SystemSettingsResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    platform_name: str
    min_withdrawal: float
    withdrawal_fee_percent: float
    maintenance_mode: bool
    usdt_address_trc20: Optional[str] = None
    usdt_address_bep20: Optional[str] = None
    usdt_qr_trc20: Optional[str] = None
    usdt_qr_bep20: Optional[str] = None
    jazzcash_number: Optional[str] = None
    jazzcash_name: Optional[str] = None
    jazzcash_qr: Optional[str] = None
    usd_to_pkr_rate: Optional[float] = 300.0

class SystemSettingsUpdate(BaseModel):
    platform_name: Optional[str] = None
    min_withdrawal: Optional[float] = None
    withdrawal_fee_percent: Optional[float] = None
    maintenance_mode: Optional[bool] = None
    usdt_address_trc20: Optional[str] = None
    usdt_address_bep20: Optional[str] = None
    usdt_qr_trc20: Optional[str] = None
    usdt_qr_bep20: Optional[str] = None
    jazzcash_number: Optional[str] = None
    jazzcash_name: Optional[str] = None
    jazzcash_qr: Optional[str] = None
    usd_to_pkr_rate: Optional[float] = None

# Free Package Models
class FreePackageSettings(BaseModel):
    model_config = ConfigDict(extra="ignore")
    is_enabled: bool = True
    name: str = "Free Trial"
    daily_ads: int = 4
    earning_per_ad: float = 0.50
    withdrawal_target: float = 100.0
    description: str = "Watch ads daily and earn up to $100. Activate a paid package to withdraw your earnings."

class FreePackageUpdate(BaseModel):
    is_enabled: Optional[bool] = None
    name: Optional[str] = None
    daily_ads: Optional[int] = None
    earning_per_ad: Optional[float] = None
    withdrawal_target: Optional[float] = None
    description: Optional[str] = None

class DashboardStats(BaseModel):
    total_users: int
    active_packages: int
    pending_deposits: int
    pending_withdrawals: int
    total_paid_out: float

class ReferralStats(BaseModel):
    total_network: int
    direct_referrals: int
    level2_referrals: int
    level3_referrals: int
    total_commission: float

class WatchProgress(BaseModel):
    watched_today: int
    daily_quota: int
    earnings_today: float

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, role: str) -> str:
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("is_blocked", False):
        raise HTTPException(status_code=403, detail="Account blocked")
    return user

async def get_admin_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    user = await get_current_user(credentials)
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

def generate_referral_code(name: str) -> str:
    short_name = ''.join(name.split())[:4].upper()
    return f"CLIPAY-{short_name}-{str(uuid.uuid4())[:4].upper()}"

async def get_referral_chain(user_id: str, depth: int = 3) -> List[str]:
    """Get upline referral chain up to specified depth"""
    chain = []
    current_id = user_id
    for _ in range(depth):
        user = await db.users.find_one({"id": current_id}, {"_id": 0, "referred_by": 1})
        if not user or not user.get("referred_by"):
            break
        referrer = await db.users.find_one({"referral_code": user["referred_by"]}, {"_id": 0, "id": 1})
        if referrer:
            chain.append(referrer["id"])
            current_id = referrer["id"]
        else:
            break
    return chain

async def distribute_commissions(user_id: str, amount: float, description: str):
    """Distribute MLM commissions to upline"""
    settings = await db.mlm_settings.find_one({}, {"_id": 0})
    if not settings:
        settings = {"level1_percent": 15, "level2_percent": 5, "level3_percent": 2}
    
    chain = await get_referral_chain(user_id)
    percentages = [settings["level1_percent"], settings["level2_percent"], settings["level3_percent"]]
    
    for i, referrer_id in enumerate(chain):
        if i >= len(percentages):
            break
        commission = amount * (percentages[i] / 100)
        if commission > 0:
            await db.users.update_one(
                {"id": referrer_id},
                {"$inc": {"balance": commission, "total_earnings": commission}}
            )
            await db.transactions.insert_one({
                "id": str(uuid.uuid4()),
                "user_id": referrer_id,
                "type": "commission",
                "amount": commission,
                "description": f"Level {i+1} commission from {description}",
                "status": "completed",
                "created_at": datetime.now(timezone.utc).isoformat()
            })

async def check_and_update_rank(user_id: str):
    """Check and update user rank based on team metrics"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        return
    
    direct_count = await db.users.count_documents({"referred_by": user["referral_code"]})
    team_size = await get_total_team_size(user_id)
    
    ranks = await db.ranks.find({"is_active": True}, {"_id": 0}).sort("reward", 1).to_list(100)
    
    new_rank = "None"
    for rank in ranks:
        if team_size >= rank["required_team_size"] and direct_count >= rank["required_directs"]:
            achieved_ranks = user.get("achieved_ranks", [])
            if rank["name"] not in achieved_ranks:
                await db.users.update_one(
                    {"id": user_id},
                    {
                        "$inc": {"balance": rank["reward"], "total_earnings": rank["reward"]},
                        "$push": {"achieved_ranks": rank["name"]}
                    }
                )
                await db.transactions.insert_one({
                    "id": str(uuid.uuid4()),
                    "user_id": user_id,
                    "type": "rank_bonus",
                    "amount": rank["reward"],
                    "description": f"Achieved {rank['name']} rank bonus",
                    "status": "completed",
                    "created_at": datetime.now(timezone.utc).isoformat()
                })
            new_rank = rank["name"]
    
    if new_rank != user.get("rank"):
        await db.users.update_one({"id": user_id}, {"$set": {"rank": new_rank}})

async def get_total_team_size(user_id: str, depth: int = 10) -> int:
    """Get total team size recursively"""
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "referral_code": 1})
    if not user:
        return 0
    
    total = 0
    current_codes = [user["referral_code"]]
    
    for _ in range(depth):
        if not current_codes:
            break
        direct_refs = await db.users.find(
            {"referred_by": {"$in": current_codes}},
            {"_id": 0, "referral_code": 1}
        ).to_list(10000)
        total += len(direct_refs)
        current_codes = [ref["referral_code"] for ref in direct_refs]
    
    return total

# ==================== EMAIL SERVICE ====================

async def send_email(to_email: str, subject: str, html_content: str):
    """Send email via SendGrid - placeholder for API key"""
    sendgrid_key = os.environ.get('SENDGRID_API_KEY')
    sender_email = os.environ.get('SENDER_EMAIL', 'noreply@clipay.com')
    
    if not sendgrid_key:
        logger.warning(f"SendGrid not configured. Email to {to_email} not sent: {subject}")
        return False
    
    try:
        import sendgrid
        from sendgrid.helpers.mail import Mail
        
        message = Mail(
            from_email=sender_email,
            to_emails=to_email,
            subject=subject,
            html_content=html_content
        )
        sg = sendgrid.SendGridAPIClient(api_key=sendgrid_key)
        response = sg.send(message)
        return response.status_code == 202
    except Exception as e:
        logger.error(f"Email sending failed: {e}")
        return False

async def send_welcome_email(user_email: str, user_name: str):
    html = f"""
    <h1>Welcome to CLIPAY, {user_name}!</h1>
    <p>Your account has been created successfully.</p>
    <p>Start earning by:</p>
    <ul>
        <li>Purchasing a package</li>
        <li>Watching daily videos</li>
        <li>Building your referral network</li>
    </ul>
    <p>Happy Earning!</p>
    """
    await send_email(user_email, "Welcome to CLIPAY!", html)

async def send_deposit_notification(user_email: str, amount: float, status: str):
    html = f"""
    <h2>Deposit Update</h2>
    <p>Your deposit of <strong>${amount:.2f}</strong> has been <strong>{status}</strong>.</p>
    """
    await send_email(user_email, f"Deposit {status.title()}", html)

async def send_withdrawal_notification(user_email: str, amount: float, status: str):
    html = f"""
    <h2>Withdrawal Update</h2>
    <p>Your withdrawal request of <strong>${amount:.2f}</strong> has been <strong>{status}</strong>.</p>
    """
    await send_email(user_email, f"Withdrawal {status.title()}", html)

# ==================== AUTH ENDPOINTS ====================

@api_router.post("/auth/signup")
async def signup(data: UserCreate, background_tasks: BackgroundTasks):
    existing = await db.users.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    referrer = await db.users.find_one({"referral_code": data.referral_code})
    if not referrer:
        raise HTTPException(status_code=400, detail="Invalid referral code")
    
    # Check if free package is enabled
    free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
    if not free_pkg:
        # Create default free package settings
        free_pkg = {
            "is_enabled": True,
            "name": "Free Trial",
            "daily_ads": 4,
            "earning_per_ad": 0.50,
            "withdrawal_target": 100.0,
            "description": "Watch ads daily and earn up to $100. Activate a paid package to withdraw your earnings."
        }
        await db.free_package_settings.insert_one(free_pkg)
    
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "name": data.name,
        "email": data.email,
        "mobile": data.mobile,
        "password": hash_password(data.password),
        "referral_code": generate_referral_code(data.name),
        "referred_by": data.referral_code,
        "balance": 0.0,
        "total_earnings": 0.0,
        "total_withdrawn": 0.0,
        "active_package": "Free Trial" if free_pkg.get("is_enabled", True) else None,
        "is_free_package": True if free_pkg.get("is_enabled", True) else False,
        "package_expiry": None,
        "rank": "None",
        "achieved_ranks": [],
        "is_blocked": False,
        "role": "user",
        "usdt_wallet": None,
        "jazzcash_number": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.users.insert_one(user)
    del user["password"]
    if "_id" in user: del user["_id"]
    
    background_tasks.add_task(send_welcome_email, data.email, data.name)
    background_tasks.add_task(check_and_update_rank, referrer["id"])
    
    token = create_token(user_id, "user")
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(data: UserLogin):
    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if user.get("is_blocked"):
        raise HTTPException(status_code=403, detail="Account blocked")
    
    token = create_token(user["id"], user.get("role", "user"))
    
    del user["password"]
    if "_id" in user: del user["_id"]
    
    return {"token": token, "user": user}

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    return user

@api_router.put("/auth/profile")
async def update_profile(data: UserUpdate, user: dict = Depends(get_current_user)):
    update_data = {}
    if data.name:
        update_data["name"] = data.name
    if data.usdt_wallet:
        update_data["usdt_wallet"] = data.usdt_wallet
    if data.jazzcash_number:
        update_data["jazzcash_number"] = data.jazzcash_number
    if data.password:
        update_data["password"] = hash_password(data.password)
    
    if update_data:
        await db.users.update_one({"id": user["id"]}, {"$set": update_data})
    
    updated = await db.users.find_one({"id": user["id"]}, {"_id": 0, "password": 0})
    return updated

# ==================== PACKAGE ENDPOINTS ====================

@api_router.get("/packages", response_model=List[PackageResponse])
async def get_packages():
    packages = await db.packages.find({"is_active": True}, {"_id": 0}).to_list(100)
    return packages

@api_router.post("/packages/purchase/{package_id}")
async def purchase_package(package_id: str, user: dict = Depends(get_current_user)):
    package = await db.packages.find_one({"id": package_id, "is_active": True}, {"_id": 0})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    
    if user["balance"] < package["price"]:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    expiry = datetime.now(timezone.utc) + timedelta(days=package["duration_days"])
    
    # Update user - remove free package status when purchasing paid package
    await db.users.update_one(
        {"id": user["id"]},
        {
            "$inc": {"balance": -package["price"]},
            "$set": {
                "active_package": package["name"],
                "package_expiry": expiry.isoformat(),
                "package_id": package_id,
                "is_free_package": False  # User now has a paid package
            }
        }
    )
    
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "package_purchase",
        "amount": -package["price"],
        "description": f"Purchased {package['name']} package",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    await distribute_commissions(user["id"], package["price"], f"{package['name']} package purchase")
    
    return {"message": "Package purchased successfully", "expiry": expiry.isoformat()}

# ==================== DEPOSIT ENDPOINTS ====================

@api_router.get("/deposits/settings")
async def get_deposit_settings():
    settings = await db.system_settings.find_one({}, {"_id": 0})
    if not settings:
        return {
            "usdt_address_trc20": None,
            "usdt_address_bep20": None,
            "usdt_qr_trc20": None,
            "usdt_qr_bep20": None,
            "jazzcash_number": None,
            "jazzcash_name": None,
            "jazzcash_qr": None,
            "usd_to_pkr_rate": 300.0
        }
    return {
        "usdt_address_trc20": settings.get("usdt_address_trc20"),
        "usdt_address_bep20": settings.get("usdt_address_bep20"),
        "usdt_qr_trc20": settings.get("usdt_qr_trc20"),
        "usdt_qr_bep20": settings.get("usdt_qr_bep20"),
        "jazzcash_number": settings.get("jazzcash_number"),
        "jazzcash_name": settings.get("jazzcash_name"),
        "jazzcash_qr": settings.get("jazzcash_qr"),
        "usd_to_pkr_rate": settings.get("usd_to_pkr_rate", 300.0)
    }

# Free Package Settings Endpoint for Users
@api_router.get("/free-package/settings")
async def get_free_package_settings(user: dict = Depends(get_current_user)):
    """Get free package settings for users to see their target and progress"""
    free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
    if not free_pkg:
        free_pkg = {
            "is_enabled": True,
            "name": "Free Trial",
            "daily_ads": 4,
            "earning_per_ad": 0.50,
            "withdrawal_target": 100.0,
            "description": "Watch ads daily and earn up to $100. Activate a paid package to withdraw your earnings."
        }
    return free_pkg

@api_router.post("/deposits")
async def create_deposit(data: DepositCreate, user: dict = Depends(get_current_user)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    
    deposit = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "user_email": user["email"],
        "user_name": user["name"],
        "amount": data.amount,
        "gateway": data.gateway,
        "txid": data.txid,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "processed_at": None
    }
    
    await db.deposits.insert_one(deposit)
    if "_id" in deposit: del deposit["_id"]
    return deposit

@api_router.get("/deposits/my", response_model=List[DepositResponse])
async def get_my_deposits(user: dict = Depends(get_current_user)):
    deposits = await db.deposits.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return deposits

# ==================== WITHDRAWAL ENDPOINTS ====================

@api_router.post("/withdrawals")
async def create_withdrawal(data: WithdrawCreate, user: dict = Depends(get_current_user)):
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")
    
    # Check if user is on free package - block withdrawals
    if user.get("is_free_package", False):
        free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
        target = free_pkg.get("withdrawal_target", 100) if free_pkg else 100
        raise HTTPException(
            status_code=400, 
            detail=f"You need to activate a paid package to withdraw. Your current balance is ${user.get('balance', 0):.2f}. Target: ${target:.2f}"
        )
    
    settings = await db.system_settings.find_one({}, {"_id": 0})
    min_withdrawal = settings.get("min_withdrawal", 10) if settings else 10
    fee_percent = settings.get("withdrawal_fee_percent", 2) if settings else 2
    
    if data.amount < min_withdrawal:
        raise HTTPException(status_code=400, detail=f"Minimum withdrawal is ${min_withdrawal}")
    
    if user["balance"] < data.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    direct_referrals = await db.users.count_documents({"referred_by": user["referral_code"]})
    if direct_referrals < 2:
        raise HTTPException(status_code=400, detail="You need at least 2 direct referrals to withdraw")
    
    fee = data.amount * (fee_percent / 100)
    net_amount = data.amount - fee
    
    withdrawal = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "user_email": user["email"],
        "user_name": user["name"],
        "amount": data.amount,
        "fee": fee,
        "net_amount": net_amount,
        "gateway": data.gateway,
        "wallet_address": data.wallet_address,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "processed_at": None
    }
    
    await db.users.update_one({"id": user["id"]}, {"$inc": {"balance": -data.amount}})
    await db.withdrawals.insert_one(withdrawal)
    
    if "_id" in withdrawal: del withdrawal["_id"]
    return withdrawal

@api_router.get("/withdrawals/my", response_model=List[WithdrawResponse])
async def get_my_withdrawals(user: dict = Depends(get_current_user)):
    withdrawals = await db.withdrawals.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return withdrawals

# ==================== WATCH LINKS ENDPOINTS ====================

@api_router.get("/watch/links", response_model=List[WatchLinkResponse])
async def get_watch_links(user: dict = Depends(get_current_user)):
    if not user.get("active_package"):
        raise HTTPException(status_code=400, detail="No active package")
    
    # Check if user is on free package and has reached target
    if user.get("is_free_package", False):
        free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
        target = free_pkg.get("withdrawal_target", 100) if free_pkg else 100
        if user.get("balance", 0) >= target:
            raise HTTPException(status_code=400, detail="You've reached the free package target! Please activate a paid package to continue earning and withdraw.")
    
    # Check package expiry for paid packages
    if user.get("package_expiry") and not user.get("is_free_package", False):
        expiry = datetime.fromisoformat(user["package_expiry"].replace('Z', '+00:00'))
        if expiry < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Package expired")
    
    links = await db.watch_links.find({"is_active": True}, {"_id": 0}).to_list(100)
    return links

@api_router.get("/watch/progress", response_model=WatchProgress)
async def get_watch_progress(user: dict = Depends(get_current_user)):
    if not user.get("active_package"):
        return WatchProgress(watched_today=0, daily_quota=0, earnings_today=0)
    
    # Handle free package
    if user.get("is_free_package", False):
        free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
        daily_quota = free_pkg.get("daily_ads", 4) if free_pkg else 4
        earning_per_ad = free_pkg.get("earning_per_ad", 0.50) if free_pkg else 0.50
    else:
        package = await db.packages.find_one({"name": user["active_package"]}, {"_id": 0})
        daily_quota = package["daily_ads"] if package else 0
        earning_per_ad = package["earning_per_ad"] if package else 0
    
    today = datetime.now(timezone.utc).date().isoformat()
    watch_record = await db.watch_records.find_one(
        {"user_id": user["id"], "date": today},
        {"_id": 0}
    )
    
    watched_today = watch_record["watched"] if watch_record else 0
    earnings_today = watched_today * earning_per_ad
    
    return WatchProgress(watched_today=watched_today, daily_quota=daily_quota, earnings_today=earnings_today)

@api_router.post("/watch/{link_id}")
async def watch_link(link_id: str, background_tasks: BackgroundTasks, user: dict = Depends(get_current_user)):
    if not user.get("active_package"):
        raise HTTPException(status_code=400, detail="No active package")
    
    # Check if user is on free package and has reached target
    if user.get("is_free_package", False):
        free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
        target = free_pkg.get("withdrawal_target", 100) if free_pkg else 100
        if user.get("balance", 0) >= target:
            raise HTTPException(status_code=400, detail="You've reached the free package target! Please activate a paid package to continue earning.")
    
    # Check package expiry for paid packages
    if user.get("package_expiry") and not user.get("is_free_package", False):
        expiry = datetime.fromisoformat(user["package_expiry"].replace('Z', '+00:00'))
        if expiry < datetime.now(timezone.utc):
            raise HTTPException(status_code=400, detail="Package expired")
    
    link = await db.watch_links.find_one({"id": link_id, "is_active": True}, {"_id": 0})
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    
    # Handle free package vs paid package
    if user.get("is_free_package", False):
        free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
        daily_ads = free_pkg.get("daily_ads", 4) if free_pkg else 4
        earning = free_pkg.get("earning_per_ad", 0.50) if free_pkg else 0.50
    else:
        package = await db.packages.find_one({"name": user["active_package"]}, {"_id": 0})
        if not package:
            raise HTTPException(status_code=400, detail="Package not found")
        daily_ads = package["daily_ads"]
        earning = package["earning_per_ad"]
    
    today = datetime.now(timezone.utc).date().isoformat()
    watch_record = await db.watch_records.find_one({"user_id": user["id"], "date": today})
    
    watched_today = watch_record["watched"] if watch_record else 0
    if watched_today >= daily_ads:
        raise HTTPException(status_code=400, detail="Daily quota completed")
    
    watched_links = watch_record.get("watched_links", []) if watch_record else []
    if link_id in watched_links:
        raise HTTPException(status_code=400, detail="Link already watched today")
    
    await db.watch_records.update_one(
        {"user_id": user["id"], "date": today},
        {
            "$inc": {"watched": 1, "earnings": earning},
            "$push": {"watched_links": link_id},
            "$setOnInsert": {"created_at": datetime.now(timezone.utc).isoformat()}
        },
        upsert=True
    )
    
    await db.users.update_one(
        {"id": user["id"]},
        {"$inc": {"balance": earning, "total_earnings": earning}}
    )
    
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "type": "watch_earning",
        "amount": earning,
        "description": f"Watched: {link['title']}",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    background_tasks.add_task(distribute_commissions, user["id"], earning, "watch earning")
    
    return {"message": "Link watched successfully", "earned": earning}

# ==================== REFERRAL ENDPOINTS ====================

@api_router.get("/referrals/stats", response_model=ReferralStats)
async def get_referral_stats(user: dict = Depends(get_current_user)):
    direct_refs = await db.users.count_documents({"referred_by": user["referral_code"]})
    
    direct_users = await db.users.find({"referred_by": user["referral_code"]}, {"_id": 0, "referral_code": 1}).to_list(10000)
    direct_codes = [u["referral_code"] for u in direct_users]
    
    level2_refs = await db.users.count_documents({"referred_by": {"$in": direct_codes}}) if direct_codes else 0
    
    level2_users = await db.users.find({"referred_by": {"$in": direct_codes}}, {"_id": 0, "referral_code": 1}).to_list(10000) if direct_codes else []
    level2_codes = [u["referral_code"] for u in level2_users]
    
    level3_refs = await db.users.count_documents({"referred_by": {"$in": level2_codes}}) if level2_codes else 0
    
    total_network = direct_refs + level2_refs + level3_refs
    
    commissions = await db.transactions.find(
        {"user_id": user["id"], "type": "commission"},
        {"_id": 0, "amount": 1}
    ).to_list(10000)
    total_commission = sum(c["amount"] for c in commissions)
    
    return ReferralStats(
        total_network=total_network,
        direct_referrals=direct_refs,
        level2_referrals=level2_refs,
        level3_referrals=level3_refs,
        total_commission=total_commission
    )

@api_router.get("/referrals/list")
async def get_referral_list(user: dict = Depends(get_current_user)):
    referrals = await db.users.find(
        {"referred_by": user["referral_code"]},
        {"_id": 0, "id": 1, "name": 1, "email": 1, "active_package": 1, "created_at": 1}
    ).sort("created_at", -1).to_list(100)
    return referrals

# ==================== RANKS ENDPOINTS ====================

@api_router.get("/ranks")
async def get_ranks():
    ranks = await db.ranks.find({"is_active": True}, {"_id": 0}).sort("reward", 1).to_list(100)
    return ranks

@api_router.get("/ranks/progress")
async def get_rank_progress(user: dict = Depends(get_current_user)):
    direct_count = await db.users.count_documents({"referred_by": user["referral_code"]})
    team_size = await get_total_team_size(user["id"])
    achieved_ranks = user.get("achieved_ranks", [])
    current_rank = user.get("rank", "None")
    
    ranks = await db.ranks.find({"is_active": True}, {"_id": 0}).sort("reward", 1).to_list(100)
    
    progress = []
    for rank in ranks:
        achieved = rank["name"] in achieved_ranks
        team_progress = min(100, (team_size / rank["required_team_size"]) * 100) if rank["required_team_size"] > 0 else 100
        direct_progress = min(100, (direct_count / rank["required_directs"]) * 100) if rank["required_directs"] > 0 else 100
        overall_progress = (team_progress + direct_progress) / 2
        
        progress.append({
            "rank": rank,
            "achieved": achieved,
            "current_team": team_size,
            "current_directs": direct_count,
            "team_progress": team_progress,
            "direct_progress": direct_progress,
            "overall_progress": overall_progress
        })
    
    return {"current_rank": current_rank, "progress": progress}

# ==================== TRANSACTIONS ENDPOINTS ====================

@api_router.get("/transactions", response_model=List[TransactionResponse])
async def get_transactions(user: dict = Depends(get_current_user)):
    transactions = await db.transactions.find(
        {"user_id": user["id"]},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    return transactions

# ==================== ADMIN ENDPOINTS ====================

@api_router.get("/admin/dashboard", response_model=DashboardStats)
async def admin_dashboard(admin: dict = Depends(get_admin_user)):
    total_users = await db.users.count_documents({"role": "user"})
    active_packages = await db.users.count_documents({"active_package": {"$ne": None}})
    pending_deposits = await db.deposits.count_documents({"status": "pending"})
    pending_withdrawals = await db.withdrawals.count_documents({"status": "pending"})
    
    approved_withdrawals = await db.withdrawals.find({"status": "approved"}, {"_id": 0, "net_amount": 1}).to_list(10000)
    total_paid = sum(w.get("net_amount", w.get("amount", 0)) for w in approved_withdrawals)
    
    return DashboardStats(
        total_users=total_users,
        active_packages=active_packages,
        pending_deposits=pending_deposits,
        pending_withdrawals=pending_withdrawals,
        total_paid_out=total_paid
    )

@api_router.get("/admin/users")
async def admin_get_users(admin: dict = Depends(get_admin_user)):
    users = await db.users.find({"role": "user"}, {"_id": 0, "password": 0}).sort("created_at", -1).to_list(1000)
    return users

@api_router.put("/admin/users/{user_id}")
async def admin_update_user(user_id: str, data: dict, admin: dict = Depends(get_admin_user)):
    allowed_fields = ["name", "balance", "is_blocked", "active_package"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if update_data:
        await db.users.update_one({"id": user_id}, {"$set": update_data})
    
    updated = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    return updated

@api_router.delete("/admin/users/{user_id}")
async def admin_delete_user(user_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.users.delete_one({"id": user_id, "role": "user"})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@api_router.post("/admin/users/{user_id}/impersonate")
async def admin_impersonate_user(user_id: str, admin: dict = Depends(get_admin_user)):
    """Allow admin to login as a user to view their dashboard"""
    user = await db.users.find_one({"id": user_id, "role": "user"}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create a token for the user with impersonation flag
    payload = {
        "user_id": user["id"],
        "role": "user",
        "impersonated_by": admin["id"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)  # Shorter expiry for impersonation
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return {
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "balance": user.get("balance", 0),
            "role": "user",
            "impersonated": True
        }
    }

@api_router.get("/admin/deposits")
async def admin_get_deposits(admin: dict = Depends(get_admin_user)):
    deposits = await db.deposits.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return deposits

@api_router.put("/admin/deposits/{deposit_id}/approve")
async def admin_approve_deposit(deposit_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_admin_user)):
    deposit = await db.deposits.find_one({"id": deposit_id}, {"_id": 0})
    if not deposit:
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    if deposit["status"] != "pending":
        raise HTTPException(status_code=400, detail="Deposit already processed")
    
    await db.deposits.update_one(
        {"id": deposit_id},
        {"$set": {"status": "approved", "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await db.users.update_one(
        {"id": deposit["user_id"]},
        {"$inc": {"balance": deposit["amount"]}}
    )
    
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": deposit["user_id"],
        "type": "deposit",
        "amount": deposit["amount"],
        "description": f"Deposit via {deposit['gateway']}",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    background_tasks.add_task(send_deposit_notification, deposit["user_email"], deposit["amount"], "approved")
    
    return {"message": "Deposit approved"}

@api_router.put("/admin/deposits/{deposit_id}/reject")
async def admin_reject_deposit(deposit_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_admin_user)):
    deposit = await db.deposits.find_one({"id": deposit_id}, {"_id": 0})
    if not deposit:
        raise HTTPException(status_code=404, detail="Deposit not found")
    
    if deposit["status"] != "pending":
        raise HTTPException(status_code=400, detail="Deposit already processed")
    
    await db.deposits.update_one(
        {"id": deposit_id},
        {"$set": {"status": "rejected", "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    background_tasks.add_task(send_deposit_notification, deposit["user_email"], deposit["amount"], "rejected")
    
    return {"message": "Deposit rejected"}

@api_router.get("/admin/withdrawals")
async def admin_get_withdrawals(admin: dict = Depends(get_admin_user)):
    withdrawals = await db.withdrawals.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return withdrawals

@api_router.put("/admin/withdrawals/{withdrawal_id}/approve")
async def admin_approve_withdrawal(withdrawal_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_admin_user)):
    withdrawal = await db.withdrawals.find_one({"id": withdrawal_id}, {"_id": 0})
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    if withdrawal["status"] != "pending":
        raise HTTPException(status_code=400, detail="Withdrawal already processed")
    
    await db.withdrawals.update_one(
        {"id": withdrawal_id},
        {"$set": {"status": "approved", "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await db.users.update_one(
        {"id": withdrawal["user_id"]},
        {"$inc": {"total_withdrawn": withdrawal["amount"]}}
    )
    
    await db.transactions.insert_one({
        "id": str(uuid.uuid4()),
        "user_id": withdrawal["user_id"],
        "type": "withdrawal",
        "amount": -withdrawal["amount"],
        "description": f"Withdrawal via {withdrawal['gateway']}",
        "status": "completed",
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    background_tasks.add_task(send_withdrawal_notification, withdrawal["user_email"], withdrawal["amount"], "approved")
    
    return {"message": "Withdrawal approved"}

@api_router.put("/admin/withdrawals/{withdrawal_id}/reject")
async def admin_reject_withdrawal(withdrawal_id: str, background_tasks: BackgroundTasks, admin: dict = Depends(get_admin_user)):
    withdrawal = await db.withdrawals.find_one({"id": withdrawal_id}, {"_id": 0})
    if not withdrawal:
        raise HTTPException(status_code=404, detail="Withdrawal not found")
    
    if withdrawal["status"] != "pending":
        raise HTTPException(status_code=400, detail="Withdrawal already processed")
    
    await db.withdrawals.update_one(
        {"id": withdrawal_id},
        {"$set": {"status": "rejected", "processed_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    await db.users.update_one(
        {"id": withdrawal["user_id"]},
        {"$inc": {"balance": withdrawal["amount"]}}
    )
    
    background_tasks.add_task(send_withdrawal_notification, withdrawal["user_email"], withdrawal["amount"], "rejected")
    
    return {"message": "Withdrawal rejected"}

@api_router.get("/admin/packages")
async def admin_get_packages(admin: dict = Depends(get_admin_user)):
    packages = await db.packages.find({}, {"_id": 0}).to_list(100)
    return packages

@api_router.post("/admin/packages")
async def admin_create_package(data: PackageCreate, admin: dict = Depends(get_admin_user)):
    package = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.packages.insert_one(package)
    if "_id" in package: del package["_id"]
    return package

@api_router.put("/admin/packages/{package_id}")
async def admin_update_package(package_id: str, data: dict, admin: dict = Depends(get_admin_user)):
    allowed_fields = ["name", "price", "daily_ads", "earning_per_ad", "duration_days", "matrix_level", "is_active"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if update_data:
        await db.packages.update_one({"id": package_id}, {"$set": update_data})
    
    updated = await db.packages.find_one({"id": package_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/packages/{package_id}")
async def admin_delete_package(package_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.packages.delete_one({"id": package_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted"}

@api_router.get("/admin/links")
async def admin_get_links(admin: dict = Depends(get_admin_user)):
    links = await db.watch_links.find({}, {"_id": 0}).to_list(1000)
    return links

@api_router.post("/admin/links")
async def admin_create_link(data: WatchLinkCreate, admin: dict = Depends(get_admin_user)):
    link = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.watch_links.insert_one(link)
    if "_id" in link: del link["_id"]
    return link

@api_router.put("/admin/links/{link_id}")
async def admin_update_link(link_id: str, data: dict, admin: dict = Depends(get_admin_user)):
    allowed_fields = ["title", "url", "platform", "earning", "is_active"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if update_data:
        await db.watch_links.update_one({"id": link_id}, {"$set": update_data})
    
    updated = await db.watch_links.find_one({"id": link_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/links/{link_id}")
async def admin_delete_link(link_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.watch_links.delete_one({"id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Link not found")
    return {"message": "Link deleted"}

@api_router.get("/admin/mlm-settings", response_model=MLMSettingsResponse)
async def admin_get_mlm_settings(admin: dict = Depends(get_admin_user)):
    settings = await db.mlm_settings.find_one({}, {"_id": 0})
    if not settings:
        settings = {"level1_percent": 15, "level2_percent": 5, "level3_percent": 2, "matrix_width": 5}
    return settings

@api_router.put("/admin/mlm-settings")
async def admin_update_mlm_settings(data: MLMSettingsUpdate, admin: dict = Depends(get_admin_user)):
    await db.mlm_settings.update_one({}, {"$set": data.model_dump()}, upsert=True)
    return data

@api_router.get("/admin/ranks")
async def admin_get_ranks(admin: dict = Depends(get_admin_user)):
    ranks = await db.ranks.find({}, {"_id": 0}).to_list(100)
    return ranks

@api_router.post("/admin/ranks")
async def admin_create_rank(data: RankCreate, admin: dict = Depends(get_admin_user)):
    rank = {
        "id": str(uuid.uuid4()),
        **data.model_dump(),
        "is_active": True,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.ranks.insert_one(rank)
    if "_id" in rank: del rank["_id"]
    return rank

@api_router.put("/admin/ranks/{rank_id}")
async def admin_update_rank(rank_id: str, data: dict, admin: dict = Depends(get_admin_user)):
    allowed_fields = ["name", "required_team_size", "required_directs", "reward", "is_active"]
    update_data = {k: v for k, v in data.items() if k in allowed_fields}
    
    if update_data:
        await db.ranks.update_one({"id": rank_id}, {"$set": update_data})
    
    updated = await db.ranks.find_one({"id": rank_id}, {"_id": 0})
    return updated

@api_router.delete("/admin/ranks/{rank_id}")
async def admin_delete_rank(rank_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.ranks.delete_one({"id": rank_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Rank not found")
    return {"message": "Rank deleted"}

@api_router.get("/admin/settings", response_model=SystemSettingsResponse)
async def admin_get_settings(admin: dict = Depends(get_admin_user)):
    settings = await db.system_settings.find_one({}, {"_id": 0})
    if not settings:
        settings = {
            "platform_name": "CLIPAY",
            "min_withdrawal": 10,
            "withdrawal_fee_percent": 2,
            "maintenance_mode": False,
            "usdt_address_trc20": None,
            "usdt_address_bep20": None,
            "jazzcash_number": None,
            "jazzcash_name": None
        }
    return settings

@api_router.put("/admin/settings")
async def admin_update_settings(data: SystemSettingsUpdate, admin: dict = Depends(get_admin_user)):
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.system_settings.update_one({}, {"$set": update_data}, upsert=True)
    settings = await db.system_settings.find_one({}, {"_id": 0})
    return settings

# Free Package Admin Endpoints
@api_router.get("/admin/free-package", response_model=FreePackageSettings)
async def admin_get_free_package(admin: dict = Depends(get_admin_user)):
    """Get free package settings for admin"""
    free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
    if not free_pkg:
        free_pkg = {
            "is_enabled": True,
            "name": "Free Trial",
            "daily_ads": 4,
            "earning_per_ad": 0.50,
            "withdrawal_target": 100.0,
            "description": "Watch ads daily and earn up to $100. Activate a paid package to withdraw your earnings."
        }
        await db.free_package_settings.insert_one(free_pkg)
    return free_pkg

@api_router.put("/admin/free-package")
async def admin_update_free_package(data: FreePackageUpdate, admin: dict = Depends(get_admin_user)):
    """Update free package settings"""
    update_data = {k: v for k, v in data.model_dump().items() if v is not None}
    if update_data:
        await db.free_package_settings.update_one({}, {"$set": update_data}, upsert=True)
    free_pkg = await db.free_package_settings.find_one({}, {"_id": 0})
    return free_pkg

@api_router.get("/admin/transactions")
async def admin_get_transactions(admin: dict = Depends(get_admin_user)):
    transactions = await db.transactions.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return transactions

# ==================== SEED DATA ====================

@api_router.post("/seed")
async def seed_data():
    """Seed initial data for testing"""
    
    # Check if already seeded
    existing_admin = await db.users.find_one({"email": "admin@clipay.com"})
    if existing_admin:
        return {"message": "Already seeded"}
    
    # Create Admin
    admin_id = str(uuid.uuid4())
    admin = {
        "id": admin_id,
        "name": "Admin",
        "email": "admin@clipay.com",
        "password": hash_password("password"),
        "referral_code": "CLIPAY-ADMIN-0001",
        "referred_by": None,
        "balance": 0.0,
        "total_earnings": 0.0,
        "total_withdrawn": 0.0,
        "active_package": None,
        "package_expiry": None,
        "rank": "None",
        "achieved_ranks": [],
        "is_blocked": False,
        "role": "admin",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(admin)
    
    # Create Master User
    master_id = str(uuid.uuid4())
    expiry = datetime.now(timezone.utc) + timedelta(days=30)
    master_user = {
        "id": master_id,
        "name": "Master User",
        "email": "masteruser@clipay.com",
        "password": hash_password("password"),
        "referral_code": "CLIPAY-MAST-0001",
        "referred_by": "CLIPAY-ADMIN-0001",
        "balance": 450.50,
        "total_earnings": 1280.00,
        "total_withdrawn": 800.00,
        "active_package": "Premium",
        "package_expiry": expiry.isoformat(),
        "rank": "Bronze",
        "achieved_ranks": ["Bronze"],
        "is_blocked": False,
        "role": "user",
        "usdt_wallet": "TXyz123456789",
        "jazzcash_number": "03001234567",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.users.insert_one(master_user)
    
    # Create some referrals for master user
    for i in range(3):
        ref_id = str(uuid.uuid4())
        ref_user = {
            "id": ref_id,
            "name": f"Referral User {i+1}",
            "email": f"ref{i+1}@clipay.com",
            "password": hash_password("password"),
            "referral_code": f"CLIPAY-REF{i+1}-{str(uuid.uuid4())[:4].upper()}",
            "referred_by": "CLIPAY-MAST-0001",
            "balance": 50.0 * (i + 1),
            "total_earnings": 100.0 * (i + 1),
            "total_withdrawn": 0.0,
            "active_package": "Starter" if i == 0 else "Premium" if i == 1 else None,
            "package_expiry": expiry.isoformat() if i < 2 else None,
            "rank": "None",
            "achieved_ranks": [],
            "is_blocked": False,
            "role": "user",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
        await db.users.insert_one(ref_user)
    
    # Create Packages
    packages = [
        {"id": str(uuid.uuid4()), "name": "Starter", "price": 20, "daily_ads": 4, "earning_per_ad": 0.25, "duration_days": 30, "matrix_level": 1, "is_active": True},
        {"id": str(uuid.uuid4()), "name": "Premium", "price": 100, "daily_ads": 10, "earning_per_ad": 0.50, "duration_days": 30, "matrix_level": 3, "is_active": True},
        {"id": str(uuid.uuid4()), "name": "Elite", "price": 500, "daily_ads": 20, "earning_per_ad": 1.00, "duration_days": 30, "matrix_level": 10, "is_active": True},
    ]
    await db.packages.insert_many(packages)
    
    # Create Ranks
    ranks = [
        {"id": str(uuid.uuid4()), "name": "Bronze", "required_team_size": 50, "required_directs": 10, "reward": 50, "is_active": True},
        {"id": str(uuid.uuid4()), "name": "Silver", "required_team_size": 200, "required_directs": 25, "reward": 200, "is_active": True},
        {"id": str(uuid.uuid4()), "name": "Gold", "required_team_size": 500, "required_directs": 50, "reward": 500, "is_active": True},
    ]
    await db.ranks.insert_many(ranks)
    
    # Create Watch Links
    watch_links = [
        {"id": str(uuid.uuid4()), "title": "Product Review", "url": "https://youtube.com/watch?v=example1", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Tech Tutorial", "url": "https://youtube.com/watch?v=example2", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Lifestyle Vlog", "url": "https://youtube.com/watch?v=example3", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Reel Promotion", "url": "https://instagram.com/reel/example", "platform": "Instagram", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "TikTok Trend", "url": "https://tiktok.com/@user/video", "platform": "TikTok", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Facebook Ad", "url": "https://facebook.com/watch/example", "platform": "Facebook", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Cooking Show", "url": "https://youtube.com/watch?v=cooking", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Gaming Stream", "url": "https://youtube.com/watch?v=gaming", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "Music Video", "url": "https://youtube.com/watch?v=music", "platform": "YouTube", "earning": 0.50, "is_active": True},
        {"id": str(uuid.uuid4()), "title": "News Update", "url": "https://youtube.com/watch?v=news", "platform": "YouTube", "earning": 0.50, "is_active": True},
    ]
    await db.watch_links.insert_many(watch_links)
    
    # Create MLM Settings
    await db.mlm_settings.insert_one({
        "level1_percent": 15,
        "level2_percent": 5,
        "level3_percent": 2,
        "matrix_width": 5
    })
    
    # Create System Settings
    await db.system_settings.insert_one({
        "platform_name": "CLIPAY",
        "min_withdrawal": 10,
        "withdrawal_fee_percent": 2,
        "maintenance_mode": False,
        "usdt_address_trc20": None,
        "usdt_address_bep20": None,
        "jazzcash_number": None,
        "jazzcash_name": None
    })
    
    # Create some transactions for master user
    transactions = [
        {"id": str(uuid.uuid4()), "user_id": master_id, "type": "deposit", "amount": 500, "description": "Deposit via USDT", "status": "completed", "created_at": (datetime.now(timezone.utc) - timedelta(days=20)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": master_id, "type": "package_purchase", "amount": -100, "description": "Purchased Premium package", "status": "completed", "created_at": (datetime.now(timezone.utc) - timedelta(days=19)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": master_id, "type": "withdrawal", "amount": -200, "description": "Withdrawal via USDT", "status": "completed", "created_at": (datetime.now(timezone.utc) - timedelta(days=10)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": master_id, "type": "commission", "amount": 15, "description": "Level 1 commission", "status": "completed", "created_at": (datetime.now(timezone.utc) - timedelta(days=5)).isoformat()},
        {"id": str(uuid.uuid4()), "user_id": master_id, "type": "watch_earning", "amount": 2.50, "description": "Watched: Product Review", "status": "completed", "created_at": (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()},
    ]
    await db.transactions.insert_many(transactions)
    
    return {"message": "Seed data created successfully"}

# ==================== HEALTH CHECK ====================

@api_router.get("/")
async def root():
    return {"message": "CLIPAY API v1.0.0", "status": "healthy"}

@api_router.get("/health")
async def health():
    return {"status": "healthy", "database": "connected"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
