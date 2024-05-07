import os
import platform
import sys
import shutil
import requests
import json
import time
import subprocess


API_BASE_URL = "http://localhost:8888"
HEADERS = {
        "content-type": "application/json"
}

def __get_user_cookie(email, password):
    data = json.dumps({
            "email": email,
            "password": password
    })
    r = requests.post(f"{API_BASE_URL}/api/login", data=data, headers=HEADERS)
    return r.cookies["connect.sid"]

def place10orders(COOKIES):
    '''This function will place 10 orders
    * The first 9 orders will be between 101 and 200 lbs
    * The 10th order will be 100 lbs
    EXPECTED RESPONSE
        - First 9 orders on robot1, 10th order on robot2 
    '''
    order_req_data = json.dumps({
        "street_address": "375 S. 9th St, San Jose, CA 95112, USA",
        "coordinates": { "lat": 37.33456768586762, "lng": -121.87809771940486 }
    })
    # First, we need to place 9 orders
    for i in range(1, 10):
        cart_req_data = json.dumps({
            "product_id": i,
            "quantity": 1
        })
        r = requests.post(f"{API_BASE_URL}/api/addItemToCart", data=cart_req_data, headers=HEADERS, cookies=COOKIES)
        r = requests.post(f"{API_BASE_URL}/api/placeOrder", data=order_req_data, headers=HEADERS, cookies=COOKIES)
    # Now, place the last 10th order (100 lbs)
    cart_req_data = json.dumps({ "product_id": 1, "quantity": 1 })
    r = requests.post(f"{API_BASE_URL}/api/addItemToCart", data=cart_req_data, headers=HEADERS, cookies=COOKIES)
    r = requests.post(f"{API_BASE_URL}/api/placeOrder", data=order_req_data, headers=HEADERS, cookies=COOKIES)
    # print(r.text)

def attempt_to_sendRobot2(COOKIES):
    '''Attempts to send robot 2 after placing all the orders
    HOW WE WILL DETERMINE IF SOMETHING WENT WRONG
        We will know that something went wrong if when trying to send robot2,
        we get a 400 response telling us that the robot is already ON_ROUTE

    This function returns:
        Tuple. (http_status_code, message_from_backend)
    '''
    data = json.dumps({ "robot_id": 2 })
    r = requests.post(f"{API_BASE_URL}/api/sendRobot", data=data, headers=HEADERS, cookies=COOKIES)
    print(r)
    return (r.status_code, r.text)

def main():
    # Try the test case N number of times
    N = 2000
    output_file = './test_files/file3.csv'
    for i in range(0, N):

        # Reset the database
        reset_database()

        # Restart the backend
        os.chdir("../")
        node_process = subprocess.Popen(['node', 'app.js'])
        os.chdir("./tests")
        time.sleep(1)
        COOKIES = {"connect.sid": __get_user_cookie("admin@admin.com", "admin")}

        print(f'iteration {i}')
        # print(f"{node_process.pid=}")
        # -- Run the orders test case --
        place10orders(COOKIES)
        time.sleep(1) # Because the thread that sends robot runs every 5 sec

        # -- Try to send the robot --
        http_res, response_msg = attempt_to_sendRobot2(COOKIES)

        write_res_to_file(i, http_res, response_msg, output_file)

        # Terminate the Node.js process
        node_process.terminate()
        time.sleep(2)


def write_res_to_file(iteration, http_res, response_msg, output_file):
    """
    Writes the result of an assertion to a test file in .csv format.
    The header of the file will be "iteration,status_code,response_msg" (have to put in the header manually).
    The file_name will preferably be in a test folder, this will write one line of the test file
    """
    f = open(output_file, "a")
    f.write(f'{iteration},{http_res},{response_msg}\n')
    f.close()


def reset_database():

    """
    Assumes that we are in the backend tester file, but could always be migrated somewhere else
    or imported from the backend.  
    """
    # Delete db.db
    if os.path.exists("../db.db"):
        os.remove('../db.db')

    # populate the database
    os.system('node ../populate_db.js')

    # Move db outside of tests folder
    db = './db.db'
    src_path = os.path.join('./', db)
    dst_path = os.path.join('../', db)
    shutil.move(src_path, dst_path)

if __name__ == '__main__':
    main()
