import csv
import uuid
from datetime import datetime, timezone

INPUT_FILE = 'expenses_rows.csv'
CATEGORIES_FILE = 'categories.csv'
TRANSACTIONS_FILE = 'transactions.csv'
USER_ID = '5fdc6a43-8de2-4542-ac74-f0df1c271964'

def run_conversion():
    # Store unique categories: { 'Subscripciones': 'uuid-1234' }
    categories_map = {}
    
    # We will hold the rows in memory to process them easily
    transactions = []
    
    now_iso = datetime.now(timezone.utc).isoformat()

    print(f"Reading {INPUT_FILE}...")
    
    with open(INPUT_FILE, mode='r', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)
        
        for row in reader:
            tipo = row.get('tipo', '').strip()
            
            # 1. Map Unique Categories
            if tipo and tipo not in categories_map:
                categories_map[tipo] = str(uuid.uuid4())
                
            # 2. Extract and format transaction data
            # Convert '2025-06-11 09:56:00+00' to just '2025-06-11'
            raw_date = row.get('date', '')
            formatted_date = raw_date.split(' ')[0] if raw_date else ''
            
            # Determine transaction type ('true'/'1' -> expense, else -> income)
            is_expense = row.get('expense', '').strip().lower() in ['true', 't', '1']
            trans_type = 'expense' if is_expense else 'income'
            
            # Fallback for creation_date if missing
            created_at = row.get('creation_date') or now_iso
            
            transactions.append({
                'id': str(uuid.uuid4()),
                'user_id': USER_ID,
                'category_id': categories_map.get(tipo, ''), # Link to the category UUID
                'type': trans_type,
                'amount': row.get('amount', '0'),
                'date': formatted_date,
                'description': row.get('description', ''),
                'created_at': created_at
            })

    # --- WRITE CATEGORIES CSV ---
    print(f"Writing {CATEGORIES_FILE} ({len(categories_map)} categories found)...")
    with open(CATEGORIES_FILE, mode='w', encoding='utf-8', newline='') as catfile:
        fieldnames = ['id', 'user_id', 'name', 'description', 'emoji', 'created_at']
        writer = csv.DictWriter(catfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for name, cat_id in categories_map.items():
            writer.writerow({
                'id': cat_id,
                'user_id': USER_ID,
                'name': name,
                'description': f"{name} expenses",
                'emoji': '📝', # You can manually change this in the output CSV!
                'created_at': now_iso
            })

    # --- WRITE TRANSACTIONS CSV ---
    print(f"Writing {TRANSACTIONS_FILE} ({len(transactions)} transactions)...")
    with open(TRANSACTIONS_FILE, mode='w', encoding='utf-8', newline='') as transfile:
        fieldnames = ['id', 'user_id', 'category_id', 'type', 'amount', 'date', 'description', 'created_at']
        writer = csv.DictWriter(transfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for t in transactions:
            writer.writerow(t)

    print("✅ Conversion complete!")

if __name__ == '__main__':
    run_conversion()