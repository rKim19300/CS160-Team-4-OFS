from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import  WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

LOGIN_URL = "http://localhost:3000"

def main():

    # Create object and link to server
    service = Service(executable_path="chromedriver.exe")
    driver = webdriver.Chrome(service=service)

    driver.get(LOGIN_URL)
    
    # Test Case: empty Input Field
    testEmptyInput(driver)
    
    # Test Case: Invalid ID or Password
    testInvalidAccount(driver)
    
    # Test Case: Owner Account
    # testAdminAccount(driver)

    # Move To Sign Up Page
    clickSignUp(driver)
    
    # Test Case: empty Input Field
    time.sleep(2)   # pause for class to see action
    clickSubmit(driver)
    
    # Test Case: Email Input 
    
    
    time.sleep(5)
    driver.quit()

"""LOG IN PAGE SECTION"""

def testEmptyInput(driver):
    '''Test Case for invalid account log in'''
    clickContinue(driver)
    time.sleep(2)   # pause for class to see action
    clickOK(driver)
    
def testInvalidAccount(driver):
    '''Test Case for invalid account log in'''
    fillInEmail(driver, "invalidAccount@ofs.com")
    fillInPassword(driver, "P@$$w0rd")
    time.sleep(2)   # pause for class to see action
    clickContinue(driver)
    time.sleep(2)   # pause for class to see action
    clickOK(driver)
    
def testAdminAccount(driver):
    ''' Test Case for Admin account Successfully login '''
    fillInEmail(driver, "admin@admin.com")
    fillInPassword(driver, "admin")
    time.sleep(2)   # pause for class to see action
    clickContinue(driver)
    

def clickContinue(driver):
    '''Find and click Continue button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Continue')]"))
    )
    
    continueButton = driver.find_element(By.XPATH, "//*[contains(text(), 'Continue')]")
    continueButton.click()

def clickOK(driver):
    '''Find and click OK button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'OK')]"))
    )
    
    confirmButton = driver.find_element(By.XPATH, "//*[contains(text(), 'OK')]")
    confirmButton.click()

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
    
"""SIGN UP PAGE SECTION"""

def clickSignUp(driver):
    '''Find and click link to Sign Up Page'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Create Account')]"))
    )
    
    signUp = driver.find_element(By.XPATH, "//*[contains(text(), 'Create Account')]")
    signUp.click()
    
def clickSubmit(driver):
    '''Find and click Submit button'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Submit')]"))
    )
    
    submit = driver.find_element(By.XPATH, "//*[contains(text(), 'Submit')]")
    submit.click()
    
if __name__ == '__main__':
    main()