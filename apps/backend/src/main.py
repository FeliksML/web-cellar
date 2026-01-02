from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.addresses.router import router as addresses_router
from src.auth.router import router as auth_router
from src.cart.router import router as cart_router
from src.config import get_settings
from src.health.router import router as health_router
from src.orders.admin_router import router as orders_admin_router
from src.orders.router import router as orders_router
from src.products.admin_router import router as products_admin_router
from src.products.router import categories_router, router as products_router
from src.reviews.router import router as reviews_router

settings = get_settings()

app = FastAPI(
    title="Beasty Baker API",
    description="Production-ready bakery e-commerce API",
    version="0.2.0",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
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
app.include_router(products_admin_router)
app.include_router(orders_admin_router)


@app.get("/", operation_id="root")
async def root() -> dict[str, str]:
    """Root endpoint."""
    return {"message": "Beasty Baker API", "docs": "/docs"}
