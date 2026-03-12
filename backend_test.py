import requests
import sys
import json
from datetime import datetime

class CLIPAYAPITester:
    def __init__(self, base_url="https://social-earnings-hub-3.preview.emergentagent.com"):
        self.base_url = base_url
        self.user_token = None
        self.admin_token = None
        self.tests_run = 0
        self.tests_passed = 0
        print(f"🔧 Testing CLIPAY API at: {self.base_url}")

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/api{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {method} {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers)
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"      Error: {error_data}")
                except:
                    print(f"      Raw response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"   ❌ FAILED - Network Error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "/", 200)

    def test_user_login(self, email, password):
        """Test user login"""
        success, response = self.run_test(
            f"User Login ({email})",
            "POST",
            "/auth/login",
            200,
            data={"email": email, "password": password}
        )
        if success and 'token' in response:
            if email == "admin@clipay.com":
                self.admin_token = response['token']
            else:
                self.user_token = response['token']
            return True, response
        return False, {}

    def test_packages_list(self):
        """Test getting packages list"""
        return self.run_test("Get Packages List", "GET", "/packages", 200)

    def test_watch_links(self, token):
        """Test getting watch links (requires auth)"""
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        return self.run_test(
            "Get Watch Links", 
            "GET", 
            "/watch/links", 
            200 if token else 401,
            headers=headers
        )

    def test_referral_stats(self, token):
        """Test getting referral stats (requires auth)"""
        headers = {"Authorization": f"Bearer {token}"} if token else {}
        return self.run_test(
            "Get Referral Stats", 
            "GET", 
            "/referrals/stats", 
            200 if token else 401,
            headers=headers
        )

    def test_ranks(self):
        """Test getting ranks (public endpoint)"""
        return self.run_test("Get Ranks", "GET", "/ranks", 200)

    def test_admin_dashboard(self, admin_token):
        """Test admin dashboard (requires admin auth)"""
        headers = {"Authorization": f"Bearer {admin_token}"} if admin_token else {}
        return self.run_test(
            "Admin Dashboard Stats", 
            "GET", 
            "/admin/dashboard", 
            200 if admin_token else 401,
            headers=headers
        )

def main():
    print("🚀 Starting CLIPAY API Tests")
    print("=" * 50)
    
    tester = CLIPAYAPITester()
    
    # Test 1: Health endpoint
    tester.test_health_endpoint()
    
    # Test 2: User login
    user_success, user_data = tester.test_user_login("masteruser@clipay.com", "password")
    
    # Test 3: Admin login
    admin_success, admin_data = tester.test_user_login("admin@clipay.com", "password")
    
    # Test 4: Get packages (public)
    tester.test_packages_list()
    
    # Test 5: Get watch links (requires user auth)
    tester.test_watch_links(tester.user_token)
    
    # Test 6: Get referral stats (requires user auth)
    tester.test_referral_stats(tester.user_token)
    
    # Test 7: Get ranks (public)
    tester.test_ranks()
    
    # Test 8: Admin dashboard (requires admin auth)
    tester.test_admin_dashboard(tester.admin_token)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 TEST RESULTS")
    print(f"   Tests Run: {tester.tests_run}")
    print(f"   Tests Passed: {tester.tests_passed}")
    print(f"   Tests Failed: {tester.tests_run - tester.tests_passed}")
    print(f"   Success Rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests PASSED!")
        return 0
    else:
        print("❌ Some tests FAILED!")
        return 1

if __name__ == "__main__":
    sys.exit(main())