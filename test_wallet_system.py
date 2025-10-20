import requests
import csv
import json
import os
from datetime import datetime

# --- Configuration ---
API_URL = "https://oro-api-private.onrender.com/score/"
MIXER_CONTRACTS_CSV = "c:\\Users\\logan\\Downloads\\mixer_contracts.csv"
EXPORT_ACCOUNTS_CSV = "c:\\Users\\logan\\Downloads\\export-accounts-1759631376786.csv"

# --- Well-known wallets for testing (ground truth for classification) ---
WELL_KNOWN_WALLETS = {
    # Established/Trusted Users (should get high scores)
    "Vitalik Buterin": {"address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "expected_type": "Established"},
    "Binance Hot Wallet 1": {"address": "0x28C6c06298d514Db089934071355E5743bf21d60", "expected_type": "Established"},
    "Binance Cold Wallet": {"address": "0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE", "expected_type": "Established"},
    "Binance Hot Wallet 2": {"address": "0x47ac0Fb4F2D84898e4D9E7b4DaB3C24507a6D503", "expected_type": "Established"},
    "Coinbase Wallet": {"address": "0x71660c4005BA85c37ccec55d0C4493E66Fe775d3", "expected_type": "Established"},
    
    # DeFi Users (should get good scores, no risk flags)
    "Uniswap V2 Router": {"address": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "expected_type": "DeFi"},
    "Uniswap V3 Router": {"address": "0xE592427A0AEce92De3Edee1F18E0157C05861564", "expected_type": "DeFi"},
    "Aave V2 Pool": {"address": "0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9", "expected_type": "DeFi"},
    
    # Bad/Privacy Mixer Users (should get low scores, risk flags)
    "Tornado Cash (OFAC)": {"address": "0x8589427373D6D84E98730D7795D8f6f8731FDA16", "expected_type": "Bad"},
    "Tornado Cash (Contract)": {"address": "0x12D66f87A04A9E220743712Ce6d9bB1Ba5616C8a", "expected_type": "Bad"},
    "Tornado Cash (Relayer)": {"address": "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf", "expected_type": "Bad"},
    "Ronin Bridge Hacker": {"address": "0x098B716B8Aaf21512996dC57EB0615e2383E2f96", "expected_type": "Bad"},
    
    # New/Unproven Users (should get low-medium scores)
    "New User Example": {"address": "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6", "expected_type": "New"},
    
    # Edge Case Users (unusual patterns)
    "Burn Address": {"address": "0x000000000000000000000000000000000000dead", "expected_type": "Edge Case"},
    "Null Address": {"address": "0x0000000000000000000000000000000000000000", "expected_type": "Edge Case"},
}

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
    """Classify wallet based on API response"""
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

def load_csv_wallets(csv_path, expected_type="Bad"):
    """Load wallets from CSV file"""
    wallets = {}
    if os.path.exists(csv_path):
        try:
            with open(csv_path, 'r') as f:
                reader = csv.reader(f)
                next(reader)  # Skip header
                for i, row in enumerate(reader):
                    if row and len(row) > 0 and row[0].strip():
                        address = row[0].strip()
                        note = row[1].strip() if len(row) > 1 else f"CSV Wallet {i+1}"
                        wallets[f"CSV {i+1} ({note})"] = {
                            "address": address, 
                            "expected_type": expected_type
                        }
        except Exception as e:
            print(f"Error reading CSV {csv_path}: {e}")
    return wallets

def run_comprehensive_test():
    """Run comprehensive wallet testing"""
    print("=" * 60)
    print("ORO API WALLET CLASSIFICATION TEST")
    print("=" * 60)
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()

    # Load all test wallets
    all_wallets = WELL_KNOWN_WALLETS.copy()
    
    # Add mixer contracts (should be classified as Bad)
    mixer_wallets = load_csv_wallets(MIXER_CONTRACTS_CSV, "Bad")
    all_wallets.update(mixer_wallets)
    
    # Add export accounts (assuming these are user wallets, classify as New/Edge Case)
    export_wallets = load_csv_wallets(EXPORT_ACCOUNTS_CSV, "New")
    all_wallets.update(export_wallets)

    # Initialize counters
    results = []
    total_tested = 0
    correct_classifications = 0
    errors = 0
    
    user_type_counts = {
        "Established": {"total": 0, "correct": 0},
        "DeFi": {"total": 0, "correct": 0},
        "New": {"total": 0, "correct": 0},
        "Bad": {"total": 0, "correct": 0},
        "Edge Case": {"total": 0, "correct": 0},
    }

    print("Testing wallets...")
    print("-" * 60)

    # Test each wallet
    for name, wallet_info in all_wallets.items():
        address = wallet_info["address"]
        expected_type = wallet_info["expected_type"]
        
        total_tested += 1
        user_type_counts[expected_type]["total"] += 1

        print(f"Testing {name}")
        print(f"  Address: {address}")
        print(f"  Expected: {expected_type}")
        
        score_data = get_wallet_score(address)

        if score_data:
            classified_type = classify_wallet(score_data)
            is_correct = classified_type == expected_type
            
            if is_correct:
                correct_classifications += 1
                user_type_counts[expected_type]["correct"] += 1
            
            results.append({
                "name": name,
                "address": address,
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
            if score_data.get("riskFlags"):
                print(f"  Risk Flags: {score_data.get('riskFlags')}")
            print(f"  Classification: {'CORRECT' if is_correct else 'INCORRECT'}")
        else:
            errors += 1
            results.append({
                "name": name,
                "address": address,
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

    # Calculate false positives and negatives
    false_positives = 0  # Good users classified as Bad
    false_negatives = 0  # Bad users classified as Good

    for res in results:
        if res["success"]:
            if res["expected_type"] in ["Established", "DeFi", "New"] and res["classified_type"] == "Bad":
                false_positives += 1
            elif res["expected_type"] == "Bad" and res["classified_type"] in ["Established", "DeFi", "New"]:
                false_negatives += 1

    # Print comprehensive summary
    print("\n" + "=" * 60)
    print("USER WALLET TEST SUMMARY")
    print("=" * 60)
    print(f"Total User Wallets Tested: {total_tested}")
    print(f"Correct Classifications: {correct_classifications}")
    print(f"False Positives: {false_positives} (good users penalized)")
    print(f"False Negatives: {false_negatives} (bad users missed)")
    print(f"Errors: {errors}")

    print("\nBreakdown by User Type:")
    for user_type, counts in user_type_counts.items():
        if counts["total"] > 0:
            percentage = (counts["correct"] / counts["total"] * 100)
            print(f"  {user_type} Users: {counts['correct']}/{counts['total']} ({percentage:.1f}%)")

    print(f"\nTotal Categorized: {total_tested - errors}/{total_tested} wallets")

    print("\nSYSTEM STATUS FOR USER WALLETS:")
    if correct_classifications == total_tested and errors == 0 and false_positives == 0 and false_negatives == 0:
        print("PERFECT - System is production ready for user wallets!")
        print("No false positives - Good users are safe")
        print("No false negatives - Bad users are caught")
        system_status = "PRODUCTION READY"
    else:
        print("WARNING - System needs further review!")
        if false_positives > 0:
            print(f"{false_positives} false positives - Good users might be penalized")
        if false_negatives > 0:
            print(f"{false_negatives} false negatives - Bad users might be missed")
        if errors > 0:
            print(f"{errors} errors - API calls failed")
        system_status = "NEEDS REVIEW"

    print("\nOUTREACH READINESS FOR USER WALLETS:")
    if system_status == "PRODUCTION READY":
        print("EXCELLENT - Ready to reach out to protocols!")
        print("System works perfectly for user wallet reputation")
        print("Won't hurt partners' users")
    else:
        print("CAUTION - Review results before outreach")
        print("Some classifications may need adjustment")

    print(f"\nFINAL VERDICT FOR USER WALLETS:")
    print(f"{system_status}")

    # Detailed results for review
    print("\n" + "=" * 60)
    print("DETAILED RESULTS")
    print("=" * 60)
    
    for res in results:
        status_icon = "PASS" if res["correct"] else "FAIL"
        print(f"{status_icon} {res['name']}")
        print(f"   Expected: {res['expected_type']} | Got: {res['classified_type']}")
        print(f"   Score: {res['score']} | Status: {res['status']}")
        if res['riskFlags']:
            print(f"   Risk Flags: {res['riskFlags']}")
        print()

    print("=" * 60)
    print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

if __name__ == "__main__":
    run_comprehensive_test()
