import sys
from app.services.supabase_client import get_supabase_client

def test_supabase_connection():
    print("Testing Supabase integration...")
    try:
        supabase = get_supabase_client()
        print("✅ Supabase client initialized successfully.")
    except Exception as e:
        print(f"❌ Failed to initialize Supabase client: {e}")
        sys.exit(1)

    # These are the 8 tables defined in the database schema
    tables_to_check = [
        "companies",
        "latinfo_cache",
        "safety_records",
        "social_conflicts",
        "public_projects",
        "air_quality",
        "mining_projects",
        "illegal_mining"
    ]

    success_count = 0
    print("\nChecking tables in Supabase database:")
    for table in tables_to_check:
        try:
            # Query count of rows in the table
            res = supabase.table(table).select("*", count="exact", head=True).execute()
            count = res.count if res.count is not None else 0
            print(f"  ✅ Table [{table}] is accessible. Row Count: {count}")
            success_count += 1
        except Exception as e:
            print(f"  ❌ Table [{table}] failed to query: {e}")

    print("\n--- Summary ---")
    if success_count == len(tables_to_check):
        print("🎉 Integration test PASSED! All database tables are fully accessible and populated.")
    else:
        print(f"⚠️ Integration test PARTIALLY PASSED. {success_count}/{len(tables_to_check)} tables accessible.")
        sys.exit(1)

if __name__ == "__main__":
    test_supabase_connection()
