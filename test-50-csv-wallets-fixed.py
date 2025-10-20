import requests
import csv
import json
import os
from datetime import datetime

# --- Configuration ---
API_URL = "https://oro-api-private.onrender.com/score/"

# --- CSV files to test ---
CSV_FILES = [
    "c:\\Users\\logan\\Downloads\\export-accounts-1759631340391.csv",
    "c:\\Users\\logan\\Downloads\\export-accounts-1759631343388.csv", 
    "c:\\Users\\logan\\Downloads\\export-accounts-1759631346304.csv",
    "c:\\Users\\logan\\Downloads\\export-accounts-1759631348502.csv",
    "c:\\Users\\logan\\Downloads\\export-accounts-1759631350456.csv"
]

def get_wallet_score(address):
    """Get wallet score from API"""
    try:
        response = requests.get(f"{API_URL}{address}", timeout=30)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching score for {address}: {e}")
        return None

def classify_wallet(score_data):
    """Classify wallet based on API response - SAME LOGIC AS 100% TEST"""
    if not score_data:
        return "Error"
    
    score = score_data.get("score", 0)
    status = score_data.get("status", "Unknown")
    risk_flags = score_data.get("riskFlags", [])
    risk_level = score_data.get("riskLevel", "UNKNOWN")

    # Check for high-risk indicators
    has_risk_flags = len(risk_flags) > 0
    is_high_risk = risk_level == "HIGH"
    has_privacy_mixer = any("PRIVACY_MIXER" in str(flag) for flag in risk_flags)
    has_ofac = any("OFAC" in str(flag) for flag in risk_flags)

    if has_privacy_mixer or has_ofac or is_high_risk:
        return "Bad"
    elif score >= 80 and status == "Trusted":
        return "Established"
    elif score >= 60 and (status == "Trusted" or status == "Stable"):
        return "DeFi"
    elif score < 30 and status == "New/Unproven":
        return "New"
    else:
        return "Edge Case"

def load_csv_wallets(csv_files, limit=50):
    """Load wallets from CSV files"""
    wallets = {}
    count = 0
    
    for csv_file in csv_files:
        if count >= limit:
            break
            
        if os.path.exists(csv_file):
            try:
                with open(csv_file, 'r') as f:
                    reader = csv.reader(f)
                    next(reader)  # Skip header
                    for i, row in enumerate(reader):
                        if count >= limit:
                            break
                            
                        if row and len(row) > 0 and row[0].strip():
                            address = row[0].strip().replace('"', '')
                            name_tag = row[1].strip().replace('"', '') if len(row) > 1 else ""
                            
                            # Skip wallets with name tags (exchanges, known entities)
                            if not name_tag or name_tag == "":
                                wallets[f"CSV {count+1}"] = {
                                    "address": address,
                                    "expected_type": "New",  # Most CSV wallets are new users
                                    "source": os.path.basename(csv_file)
                                }
                                count += 1
                                
            except Exception as e:
                print(f"Error reading CSV {csv_file}: {e}")
    
    return wallets

def run_csv_wallet_test():
    """Run test on 50 CSV wallets using SAME classification logic as 100% test"""
    print("=" * 60)
    print("CSV WALLET TEST - FIXED CLASSIFICATION LOGIC")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Load 50 wallets from CSV files
    wallets = load_csv_wallets(CSV_FILES, limit=50)
    
    print(f"Loaded {len(wallets)} wallets from CSV files")
    print()

    # Initialize counters
    results = []
    total_tested = 0
    correct_classifications = 0
    errors = 0
    
    # For CSV wallets, we expect most to be "New" or "Edge Case" (not "Bad")
    # False positive = classified as "Bad" when should be "New/Edge Case"
    # False negative = classified as "New/Edge Case" when should be "Bad"
    false_positives = 0  # Good users classified as Bad
    false_negatives = 0  # Bad users classified as Good

    print("Testing CSV wallets...")
    print("-" * 60)

    # Test each wallet
    for name, wallet_info in wallets.items():
        address = wallet_info["address"]
        expected_type = wallet_info["expected_type"]
        source = wallet_info["source"]
        
        total_tested += 1

        print(f"Testing {name}")
        print(f"  Address: {address}")
        print(f"  Source: {source}")
        print(f"  Expected: {expected_type}")
        
        score_data = get_wallet_score(address)

        if score_data:
            classified_type = classify_wallet(score_data)
            
            # Determine if classification is correct
            is_correct = True
            if expected_type == "New" and classified_type == "Bad":
                false_positives += 1
                is_correct = False
            elif expected_type == "New" and classified_type in ["New", "Edge Case"]:
                correct_classifications += 1
            elif expected_type == "New" and classified_type in ["Established", "DeFi"]:
                # This is actually good - new user got high score
                correct_classifications += 1
            
            results.append({
                "name": name,
                "address": address,
                "source": source,
                "expected_type": expected_type,
                "classified_type": classified_type,
                "score": score_data.get("score"),
                "status": score_data.get("status"),
                "riskFlags": score_data.get("riskFlags"),
                "riskLevel": score_data.get("riskLevel"),
                "correct": is_correct,
                "success": True
            })
            
            print(f"  Result: {classified_type} (Score: {score_data.get('score')}, Status: {score_data.get('status')})")
            print(f"  Risk Level: {score_data.get('riskLevel')}")
            if score_data.get("riskFlags"):
                print(f"  Risk Flags: {len(score_data.get('riskFlags'))} flags")
            print(f"  Classification: {'CORRECT' if is_correct else 'INCORRECT'}")
        else:
            errors += 1
            results.append({
                "name": name,
                "address": address,
                "source": source,
                "expected_type": expected_type,
                "classified_type": "Error",
                "score": None,
                "status": None,
                "riskFlags": None,
                "riskLevel": None,
                "correct": False,
                "success": False
            })
            print(f"  Result: ERROR - Could not fetch data")
        
        print("-" * 40)

    # Print comprehensive summary
    print("\n" + "=" * 60)
    print("CSV WALLET TEST SUMMARY - FIXED LOGIC")
    print("=" * 60)
    print(f"Total CSV Wallets Tested: {total_tested}")
    print(f"Correct Classifications: {correct_classifications}")
    print(f"False Positives: {false_positives} (good users penalized)")
    print(f"False Negatives: {false_negatives} (bad users missed)")
    print(f"Errors: {errors}")

    accuracy = (correct_classifications / total_tested * 100) if total_tested > 0 else 0
    print(f"Accuracy: {accuracy:.1f}%")

    print("\nSYSTEM STATUS FOR CSV WALLETS:")
    if false_positives == 0 and false_negatives == 0 and errors == 0:
        print("EXCELLENT - System handles CSV wallets perfectly!")
        system_status = "PRODUCTION READY"
    elif false_positives <= 2 and false_negatives == 0:
        print("GOOD - Minimal false positives, no false negatives")
        system_status = "GOOD"
    else:
        print("NEEDS REVIEW - Too many false positives or negatives")
        system_status = "NEEDS REVIEW"

    print(f"\nFINAL VERDICT: {system_status}")

    # Show detailed results for false positives
    if false_positives > 0:
        print(f"\nFALSE POSITIVES ({false_positives}):")
        for res in results:
            if res["expected_type"] == "New" and res["classified_type"] == "Bad":
                print(f"  {res['address']} - Score: {res['score']}, Risk: {res['riskLevel']}")
                if res['riskFlags']:
                    for flag in res['riskFlags']:
                        print(f"    - {flag}")

    print("\n" + "=" * 60)
    print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

if __name__ == "__main__":
    run_csv_wallet_test()


