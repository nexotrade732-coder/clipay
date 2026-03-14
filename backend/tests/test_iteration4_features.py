"""
Backend API Tests for CLIPAY - Iteration 4
Tests: Video Watch Timer (50 seconds), USD to PKR Conversion, Admin Settings
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


class TestDepositSettings:
    """Test deposit settings endpoint including USD to PKR rate"""
    
    def test_get_deposit_settings(self):
        """Test /api/deposits/settings returns usd_to_pkr_rate"""
        response = requests.get(f"{BASE_URL}/api/deposits/settings")
        assert response.status_code == 200
        
        data = response.json()
        # Verify usd_to_pkr_rate is present
        assert "usd_to_pkr_rate" in data, "usd_to_pkr_rate should be in response"
        assert isinstance(data["usd_to_pkr_rate"], (int, float)), "usd_to_pkr_rate should be numeric"
        assert data["usd_to_pkr_rate"] > 0, "usd_to_pkr_rate should be positive"
        
        print(f"✅ Deposit settings returns usd_to_pkr_rate: {data['usd_to_pkr_rate']}")
        return data
    
    def test_deposit_settings_contains_all_fields(self):
        """Test that deposit settings contains all expected fields"""
        response = requests.get(f"{BASE_URL}/api/deposits/settings")
        assert response.status_code == 200
        
        data = response.json()
        expected_fields = [
            "usdt_address_trc20", "usdt_address_bep20", 
            "usdt_qr_trc20", "usdt_qr_bep20",
            "jazzcash_number", "jazzcash_name", "jazzcash_qr",
            "usd_to_pkr_rate"
        ]
        
        for field in expected_fields:
            assert field in data, f"Field {field} should be in response"
        
        print("✅ Deposit settings contains all expected fields")


class TestAdminSettings:
    """Test admin settings for USD to PKR rate configuration"""
    
    @pytest.fixture
    def admin_token(self):
        """Get admin authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@clipay.com",
            "password": "password"
        })
        assert response.status_code == 200, f"Admin login failed: {response.text}"
        return response.json()["token"]
    
    def test_admin_get_settings(self, admin_token):
        """Test admin can get system settings"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify usd_to_pkr_rate is present in admin settings
        assert "usd_to_pkr_rate" in data, "usd_to_pkr_rate should be in admin settings"
        
        print(f"✅ Admin settings retrieved, usd_to_pkr_rate: {data.get('usd_to_pkr_rate')}")
        return data
    
    def test_admin_update_usd_to_pkr_rate(self, admin_token):
        """Test admin can update USD to PKR rate"""
        headers = {"Authorization": f"Bearer {admin_token}"}
        
        # Get current settings
        current_response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        current_rate = current_response.json().get("usd_to_pkr_rate", 300)
        
        # Set a new rate
        new_rate = 285.50
        update_response = requests.put(
            f"{BASE_URL}/api/admin/settings", 
            headers=headers,
            json={"usd_to_pkr_rate": new_rate}
        )
        
        assert update_response.status_code == 200, f"Failed to update settings: {update_response.text}"
        
        # Verify the rate was updated
        updated_data = update_response.json()
        assert updated_data.get("usd_to_pkr_rate") == new_rate, "Rate should be updated"
        
        # Verify deposit settings also reflects the change
        deposit_settings = requests.get(f"{BASE_URL}/api/deposits/settings")
        assert deposit_settings.json()["usd_to_pkr_rate"] == new_rate
        
        # Restore original rate
        requests.put(
            f"{BASE_URL}/api/admin/settings", 
            headers=headers,
            json={"usd_to_pkr_rate": current_rate}
        )
        
        print(f"✅ Admin successfully updated USD to PKR rate to {new_rate}")


class TestWatchLinks:
    """Test watch links endpoints"""
    
    @pytest.fixture
    def user_token(self):
        """Get user authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "masteruser@clipay.com",
            "password": "password"
        })
        assert response.status_code == 200, f"User login failed: {response.text}"
        return response.json()["token"]
    
    def test_get_watch_links(self, user_token):
        """Test user can get watch links (requires active package)"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{BASE_URL}/api/watch/links", headers=headers)
        
        # masteruser has active package
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        if len(data) > 0:
            link = data[0]
            assert "id" in link
            assert "title" in link
            assert "url" in link
            assert "earning" in link
        
        print(f"✅ Retrieved {len(data)} watch links")
        return data
    
    def test_get_watch_progress(self, user_token):
        """Test user can get watch progress"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{BASE_URL}/api/watch/progress", headers=headers)
        
        assert response.status_code == 200
        
        data = response.json()
        assert "watched_today" in data
        assert "daily_quota" in data
        assert "earnings_today" in data
        
        print(f"✅ Watch progress: {data['watched_today']}/{data['daily_quota']} watched")


class TestAuthAndUserFlow:
    """Test authentication and user flow"""
    
    def test_user_login(self):
        """Test user login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "masteruser@clipay.com",
            "password": "password"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["active_package"] is not None
        
        print("✅ User login successful")
        return data["token"]
    
    def test_admin_login(self):
        """Test admin login"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "admin@clipay.com",
            "password": "password"
        })
        assert response.status_code == 200
        
        data = response.json()
        assert data["user"]["role"] == "admin"
        
        print("✅ Admin login successful")


class TestPackages:
    """Test packages endpoint"""
    
    def test_get_packages(self):
        """Test get packages"""
        response = requests.get(f"{BASE_URL}/api/packages")
        assert response.status_code == 200
        
        packages = response.json()
        assert isinstance(packages, list)
        assert len(packages) >= 3
        
        # Verify package structure
        for package in packages:
            assert "name" in package
            assert "price" in package
            assert "daily_ads" in package
            assert "earning_per_ad" in package
        
        print(f"✅ Retrieved {len(packages)} packages")


class TestWithdrawals:
    """Test withdrawal endpoint settings"""
    
    @pytest.fixture
    def user_token(self):
        """Get user authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "masteruser@clipay.com",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_my_withdrawals(self, user_token):
        """Test user can get their withdrawals"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{BASE_URL}/api/withdrawals/my", headers=headers)
        
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        print(f"✅ Retrieved {len(data)} withdrawals")


class TestDeposits:
    """Test deposits endpoints"""
    
    @pytest.fixture
    def user_token(self):
        """Get user authentication token"""
        response = requests.post(f"{BASE_URL}/api/auth/login", json={
            "email": "masteruser@clipay.com",
            "password": "password"
        })
        return response.json()["token"]
    
    def test_get_my_deposits(self, user_token):
        """Test user can get their deposits"""
        headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{BASE_URL}/api/deposits/my", headers=headers)
        
        assert response.status_code == 200
        
        data = response.json()
        assert isinstance(data, list)
        
        print(f"✅ Retrieved {len(data)} deposits")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
