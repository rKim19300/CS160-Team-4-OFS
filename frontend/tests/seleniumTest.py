from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import  WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

LOGIN_URL = "http://localhost:3000"
PAUSE_TIME = 1
testCounter = 0

def main():

    # Create object and link to server
    service = Service(executable_path="C:\\Kid2512\\Study\\SJSU\\2024 Spring\\CS160\\Project\\TeamGit\\frontend\\tests\\chromedriver.exe")
    driver = webdriver.Chrome(service=service)

    driver.get(LOGIN_URL)
    
    # Test Case: empty Input Field
    # testEmptyInput(driver)
    
    # Test Case: Invalid ID or Password
    testInvalidAccount(driver)
    
    # Test Case: Owner Account
    # testAdminAccount(driver)

    time.sleep(PAUSE_TIME)   # pause for class to see action
    
    # Move To Sign Up Page
    clickSignUp(driver)
    
    # Test Case: empty Input Field
    testEmptySignUp(driver)
    
    # Test Case: Email Input already exist
    # testInvalidEmail(driver)
    
    # Test Case: Account successfully created
    testSignUp(driver)
    
    time.sleep(PAUSE_TIME)
    driver.quit()

"""SIGN UP PAGE TESTS"""

def testEmptySignUp(driver):
    '''Test Case for Empty Input Submittion'''
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickSubmit(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    
def testInvalidEmail(driver):
    '''Test Case for Email Already exist'''
    fillUsername(driver, "admin")
    fillEmail(driver, "admin@admin.com")
    fillPassword(driver, "P@$$w0rd")
    fillConfirmPassword(driver, "P@$$w0rd")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickSubmit(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickOK(driver)

def testSignUp(driver):
    '''Test Case for Account Successfully Created'''
    name = "test" + str(testCounter)
    email = "test" + str(testCounter) + "@test.com"
    
    print("name = ", name)
    print("email = ", email)
    fillUsername(driver, name)
    fillEmail(driver, email)
    # fillUsername(driver, "test0")
    # fillEmail(driver, "test0@test.com")
    fillPassword(driver, "P@$$w0rd")
    fillConfirmPassword(driver, "P@$$w0rd")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickSubmit(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickOK(driver)
    
def clickSignUp(driver):
    '''Find and click link to Sign Up Page'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Create Account')]"))
    )
    
    signUp = driver.find_element(By.XPATH, "//*[contains(text(), 'Create Account')]")
    signUp.click()
    
"""SIGN UP HELPER FUNCTIONS"""
def fillUsername(driver, username):
    '''Find Name Field and type in userName'''
    username_field = driver.find_element(By.NAME, "userName")
    username_field.clear()
    username_field.send_keys(username)

def fillEmail(driver, email):
    '''Find Email Field and type in email'''
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys(email)

def fillPassword(driver, password):
    '''Find Password Field and type in password'''
    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys(password)

def fillConfirmPassword(driver, confirmPassword):
    '''Find Password Field and type in confirmPassword'''
    confirm_password_field = driver.find_element(By.NAME, "confirmPassword")
    confirm_password_field.clear()
    confirm_password_field.send_keys(confirmPassword)

"""LOG IN PAGE TESTS"""

def testEmptyInput(driver):
    '''Test Case for empty input log in'''
    clickContinue(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickOK(driver)
    
def testInvalidAccount(driver):
    '''Test Case for invalid account log in'''
    fillInEmail(driver, "invalidAccount@ofs.com")
    fillInPassword(driver, "P@$$w0rd")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickContinue(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickOK(driver)
    
def testAdminAccount(driver):
    ''' Test Case for Admin account Successfully login '''
    fillInEmail(driver, "admin@admin.com")
    fillInPassword(driver, "admin")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickContinue(driver)
    
""" LOG IN HELPER FUNCTIONS"""

def fillInEmail(driver, email):
    '''Find email box and type in email'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
    
    # Locate email input fields and fill in test email
    emailInput = driver.find_element(By.XPATH, "//input[@type='email']")
    emailInput.clear()
    emailInput.send_keys(email)

def fillInPassword(driver, password):
    '''Find password box and type in password'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
    
    # Locate password input fields and fill in test password
    passwordInput = driver.find_element(By.XPATH, "//input[@type='password']")
    passwordInput.clear()
    passwordInput.send_keys(password)

def clickContinue(driver):
    '''Find and click Continue button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Continue')]"))
    )
    # Find and click Continue
    continueButton = driver.find_element(By.XPATH, "//*[contains(text(), 'Continue')]")
    continueButton.click()

def clickOK(driver):
    '''Find and click OK button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'OK')]"))
    )
    # Find and click OK
    confirmButton = driver.find_element(By.XPATH, "//*[contains(text(), 'OK')]")
    confirmButton.click()

def clickSubmit(driver):
    '''Find and click Submit button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Submit')]"))
    )
    # Find and click Submit
    submit = driver.find_element(By.XPATH, "//*[contains(text(), 'Submit')]")
    submit.click()
    
    
if __name__ == '__main__':
    main()