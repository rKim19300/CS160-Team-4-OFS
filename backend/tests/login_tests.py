import unittest
import requests
import json

API_BASE_URL = "http://localhost:8888"
HEADERS = {
        "content-type": "application/json"
}

class TestLoginEndpoints(unittest.TestCase):
    def test_validCredentials(self):
        '''This test case will send VALID credentials to the `/api/login` route
        EXPECTED RESPONSE
            - HTTP 200 status code
            - "Successfully logged in" message (no need to check this, would be a little redundant)
            - cookie labeled "connect.sid"
        '''
        data = json.dumps({
                "email": "bob@bob.com",
                "password": "bob"
        })
        r = requests.post(f"{API_BASE_URL}/api/login", data=data, headers=HEADERS)
        # check to make sure that the response is what we're expecting
        self.assertEqual(r.status_code, 200)
        self.assertTrue("connect.sid" in r.cookies)


    def test_invalidCredentials(self):
        '''This test case will send INVALID credentials to the `/api/login` route
        EXPECTED RESPONSE
            - HTTP 401 status code
            - "Invalid credentials" message
        '''
        pass


if __name__ == "__main__":
    unittest.main()
