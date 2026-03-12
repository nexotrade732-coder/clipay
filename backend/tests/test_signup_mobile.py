"""
Backend API Tests for CLIPAY - Iteration 3
Tests new signup fields (mobile), login, and color scheme features
"""

import pytest
import requests
import os
import uuid

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestHealthCheck:
    """Basic health check tests"""
    
    def test_api_health(self):
        """Test API health endpoint"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["database"] == "connected"
        print("✅ API health check passed")


class TestAuthSignup:
    """Test signup with new mobile field"""
    
    def test_signup_with_mobile_field(self):
        """Test that signup accepts mobile field"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@clipay.com"
        
        signup_data = {
            "name": "Test User Mobile",
            "email": unique_email,
            "password": "testpass123",
            "referral_code": "CLIPAY-MAST-0001",  # Master user's referral code
            "mobile": "+92 300 1234567"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        
        # Should be successful
        assert response.status_code == 200, f"Signup failed: {response.text}"
        data = response.json()
        
        # Verify token returned
        assert "token" in data, "No token in response"
        assert len(data["token"]) > 0, "Token is empty"
        
        # Verify user data
        assert "user" in data, "No user in response"
        user = data["user"]
        assert user["email"] == unique_email
        assert user["name"] == "Test User Mobile"
        
        print(f"✅ Signup with mobile field successful for {unique_email}")
        return data
    
    def test_signup_requires_referral_code(self):
        """Test that signup requires a valid referral code"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@clipay.com"
        
        signup_data = {
            "name": "Test User",
            "email": unique_email,
            "password": "testpass123",
            "referral_code": "INVALID-CODE-1234",
            "mobile": "+92 300 1111111"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        assert response.status_code == 400, "Should reject invalid referral code"
        assert "Invalid referral code" in response.json().get("detail", "")
        print("✅ Invalid referral code rejected correctly")
    
    def test_signup_validates_mobile_optional(self):
        """Test that signup works without mobile (optional field)"""
        unique_email = f"test_{uuid.uuid4().hex[:8]}@clipay.com"
        
        signup_data = {
            "name": "Test User No Mobile",
            "email": unique_email,
            "password": "testpass123",
            "referral_code": "CLIPAY-MAST-0001"
            # No mobile field
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/signup", json=signup_data)
        assert response.status_code == 200, f"Signup without mobile should work: {response.text}"
        print("✅ Signup without mobile field successful (mobile is optional)")


class TestAuthLogin:
    """Test login functionality"""
    
    def test_admin_login(self):
        """Test admin login with correct credentials"""
        login_data = {
            "email": "admin@clipay.com",
            "password": "password"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["role"] == "admin"
        assert data["user"]["email"] == "admin@clipay.com"
        print("✅ Admin login successful")
        return data["token"]
    
    def test_user_login(self):
        """Test user login with correct credentials"""
        login_data = {
            "email": "masteruser@clipay.com",
            "password": "password"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 200, f"User login failed: {response.text}"
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["role"] == "user"
        assert data["user"]["email"] == "masteruser@clipay.com"
        print("✅ User login successful")
        return data["token"]
    
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        login_data = {
            "email": "wrong@clipay.com",
            "password": "wrongpassword"
        }
        
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        assert response.status_code == 401, "Should reject invalid credentials"
        print("✅ Invalid credentials rejected correctly")


class TestAuthMe:
    """Test authenticated user endpoint"""
    
    def test_get_current_user(self):
        """Test getting current authenticated user"""
        # First login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "masteruser@clipay.com",
            "password": "password"
        })
        token = login_response.json()["token"]
        
        # Get current user
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/auth/me", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "masteruser@clipay.com"
        assert data["name"] == "Master User"
        assert "referral_code" in data
        print("✅ Get current user successful")


class TestPackages:
    """Test packages endpoint"""
    
    def test_get_packages(self):
        """Test getting available packages"""
        response = requests.get(f"{BASE_URL}/api/packages")
        assert response.status_code == 200
        
        packages = response.json()
        assert isinstance(packages, list)
        assert len(packages) >= 3  # Starter, Premium, Elite
        
        # Verify package structure
        package_names = [p["name"] for p in packages]
        assert "Starter" in package_names
        assert "Premium" in package_names
        assert "Elite" in package_names
        
        print(f"✅ Retrieved {len(packages)} packages successfully")


class TestAdminDashboard:
    """Test admin dashboard endpoint"""
    
    def test_admin_dashboard_stats(self):
        """Test admin dashboard statistics"""
        # Login as admin
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@clipay.com",
            "password": "password"
        })
        token = login_response.json()["token"]
        
        # Get dashboard stats
        headers = {"Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/api/admin/dashboard", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify dashboard fields
        assert "total_users" in data
        assert "active_packages" in data
        assert "pending_deposits" in data
        assert "pending_withdrawals" in data
        assert "total_paid_out" in data
        
        print(f"✅ Admin dashboard stats: {data['total_users']} users, {data['active_packages']} active packages")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
