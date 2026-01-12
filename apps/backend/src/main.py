from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from src.addresses.router import router as addresses_router
from src.auth.router import router as auth_router
from src.auth.admin_router import router as customers_admin_router
from src.auth.models import User
from src.auth.security import get_password_hash
from src.cart.router import router as cart_router
from src.config import get_settings
from src.database import async_session_maker
from src.health.router import router as health_router
from src.orders.admin_router import router as orders_admin_router
from src.admin.dashboard import router as admin_dashboard_router
from src.admin.settings import router as admin_settings_router
from src.products.admin_router import router as products_admin_router
from src.orders.router import router as orders_router
from src.products.router import categories_router, router as products_router
from src.reviews.router import router as reviews_router
from src.reviews.admin_router import router as reviews_admin_router
from src.promo.router import router as promo_admin_router

settings = get_settings()


# Test accounts for development
TEST_USERS = [
    {"email": "admin@test.com", "password": "admin123", "first_name": "Admin", "last_name": "User", "role": "admin"},
    {"email": "super@test.com", "password": "super123", "first_name": "Super", "last_name": "Admin", "role": "super_admin"},
]


async def create_test_users():
    """Create test admin accounts if they don't exist."""
    async with async_session_maker() as db:
        for user_data in TEST_USERS:
            result = await db.execute(select(User).where(User.email == user_data["email"]))
            if result.scalars().first():
                continue
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                role=user_data["role"],
            )
            db.add(user)
            await db.commit()
            print(f"✓ Created test user: {user_data['email']} (password: {user_data['password']})")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler."""
    # Startup: create test users in development
    if settings.is_development:
        try:
            await create_test_users()
        except Exception as e:
            print(f"Could not create test users: {e}")
    yield
    # Shutdown: nothing needed


app = FastAPI(
    title="Beasty Baker API",
    description="Production-ready bakery e-commerce API",
    version="0.2.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Public
app.include_router(health_router, tags=["health"])
app.include_router(auth_router)
app.include_router(products_router)
app.include_router(categories_router)
app.include_router(addresses_router)
app.include_router(cart_router)
app.include_router(orders_router)
app.include_router(reviews_router)

# Include routers - Admin
app.include_router(admin_dashboard_router)
app.include_router(admin_settings_router)
app.include_router(products_admin_router)
app.include_router(orders_admin_router)
app.include_router(reviews_admin_router)
app.include_router(customers_admin_router)
app.include_router(promo_admin_router)


@app.get("/", operation_id="root")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {"message": "Beasty Baker API", "docs": "/docs"}

