import unittest
import requests
import json

API_BASE_URL = "http://localhost:8888"
HEADERS = {
        "content-type": "application/json"
}

def get_user_cookie(email, password):
    data = json.dumps({
            "email": email,
            "password": password
    })
    r = requests.post(f"{API_BASE_URL}/api/login", data=data, headers=HEADERS)
    return r.cookies["connect.sid"]

COOKIES = {"connect.sid": get_user_cookie("bob@bob.com", "bob")}

class TestCartEndpoints(unittest.TestCase):
    def test_addNonExistentItemToCart(self):
        '''This test case will try to add a NONEXISTENT item to a user's cart
        EXPECTED RESPONSE
            - HTTP 400 status code
            - "Product with id x does not exist" message (no need to check this, would be a little redundant)
        '''
        data = json.dumps({
            "product_id": 300,
            "quantity": 13
        })
        r = requests.post(f"{API_BASE_URL}/api/addItemToCart", data=data, headers=HEADERS, cookies=COOKIES)
        print(r.text)
        # check to make sure that the response is what we're expecting
        self.assertEqual(r.status_code, 400)


    def test_addRealItemToCart(self):
        '''This test case will try to add a REAL item to a user's cart
        EXPECTED RESPONSE
            - HTTP 200 status code
            - "Successfully added item to cart" message (no need to check this, would be a little redundant)
        '''
        data = json.dumps({
            "product_id": 1,
            "quantity": 13
        })
        r = requests.post(f"{API_BASE_URL}/api/addItemToCart", data=data, headers=HEADERS, cookies=COOKIES)
        print(r.text)
        # check to make sure that the response is what we're expecting
        self.assertEqual(r.status_code, 200)


    def test_viewCart(self):
        '''This test case will try and access a user's cart. This user should have at least one item in their cart
        EXPECTED RESPONSE:
            - HTTP 200 status code
            - List of objects, each obj is an item in the user's cart
        '''
        r = requests.get(f"{API_BASE_URL}/api/viewCart", headers=HEADERS, cookies=COOKIES)
        print(r.json())
        self.assertTrue(len(r.json()) > 0)
        self.assertEqual(r.status_code, 200)

if __name__ == "__main__":
    unittest.main()
