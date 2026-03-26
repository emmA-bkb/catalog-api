import os
import sys
from sqlalchemy import text

sys.path.insert(0, os.path.dirname(__file__))

from app.database.database import engine, init_db

def setup_database():
    try:
        init_db()
        print("Database initialized")
        
    except Exception as e:
        print(f"❌ Erro ao criar banco: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_database()
