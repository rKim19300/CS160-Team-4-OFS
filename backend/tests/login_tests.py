import unittest
import requests
import json

API_BASE_URL = "http://localhost:8888"
HEADERS = {
        "content-type": "application/json"
}

class TestLoginEndpoints(unittest.TestCase):
    def test_validCredentials(self):
        # This test case will send VALID credentials.
        # Should get back 200 status code, a "Successfuly logged in" message, as well as a cookie labeled "connect.sid"
        data = json.dumps({
                "email": "bob@bob.com",
                "password": "bob"
        })
        r = requests.post(f"{API_BASE_URL}/api/login", data=data, headers=HEADERS)
        # check to make sure that the response is what we're expecting
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.text, "Successfully logged in")
        self.assertTrue("connect.sid" in r.cookies)


if __name__ == "__main__":
    unittest.main()
