"""Script to create test users for development."""

import asyncio
import sys
from pathlib import Path

# Add the backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import select
from src.database import async_session
from src.auth.models import User
from src.auth.security import get_password_hash


TEST_USERS = [
    {
        "email": "admin@beastybaker.com",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "Baker",
        "role": "admin",
    },
    {
        "email": "super@beastybaker.com",
        "password": "super123",
        "first_name": "Super",
        "last_name": "Admin",
        "role": "super_admin",
    },
    {
        "email": "demo@beastybaker.com",
        "password": "demo123",
        "first_name": "Demo",
        "last_name": "Customer",
        "role": "customer",
    },
]


async def create_test_users():
    """Create test users if they don't exist."""
    async with async_session() as db:
        for user_data in TEST_USERS:
            # Check if user already exists
            result = await db.execute(
                select(User).where(User.email == user_data["email"])
            )
            existing = result.scalars().first()
            
            if existing:
                print(f"✓ User {user_data['email']} already exists (role: {existing.role})")
                continue
            
            # Create new user
            user = User(
                email=user_data["email"],
                hashed_password=get_password_hash(user_data["password"]),
                first_name=user_data["first_name"],
                last_name=user_data["last_name"],
                role=user_data["role"],
            )
            db.add(user)
            await db.commit()
            print(f"✓ Created user {user_data['email']} (role: {user_data['role']})")
    
    print("\n" + "=" * 50)
    print("TEST ACCOUNTS:")
    print("=" * 50)
    for user_data in TEST_USERS:
        print(f"\n📧 Email: {user_data['email']}")
        print(f"🔑 Password: {user_data['password']}")
        print(f"👤 Role: {user_data['role']}")
    print("\n" + "=" * 50)


if __name__ == "__main__":
    asyncio.run(create_test_users())
