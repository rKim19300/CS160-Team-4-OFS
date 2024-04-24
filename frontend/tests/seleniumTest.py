from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import  WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

LOGIN_URL = "http://localhost:3000"
PAUSE_TIME = 2
testCounter = 3

def main():

    # Create object and link to server
    service = Service(executable_path="./chromedriver.exe")
    driver = webdriver.Chrome(service=service)

    driver.get(LOGIN_URL)
    
    # # Test Case: empty Input Field
    # testEmptyInput(driver)
    
    # # Test Case: Invalid ID or Password
    # testInvalidAccount(driver)

    # time.sleep(PAUSE_TIME)   # pause for class to see action
    
    # # Move To Sign Up Page
    # clickSignUp(driver)
    
    # # Test Case: empty Input Field
    # testEmptySignUp(driver)
    
    # # Test Case: Email Input already exist
    # testInvalidEmail(driver)
    
    # # Test Case: Account successfully created
    # testSignUp(driver)
    
    # Test Case: Customer Action
    testCustomerAccount(driver)
    
    # Test Case: Owner Account
    # testAdminAccount(driver)
    
    time.sleep(PAUSE_TIME)
    driver.quit()

"""TEST USER ACTION"""
def testCustomerAccount(driver):
    ''' Test Case for Customer Action '''
    fillInEmail(driver, "test@test.com")
    fillInPassword(driver, "P@$$w0rd")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickContinue(driver)
    clickCategories(driver)
    addItemsToCart(driver)

def testAdminAccount(driver):
    ''' Test Case for Admin Action '''
    fillInEmail(driver, "admin@admin.com")
    fillInPassword(driver, "admin")
    time.sleep(PAUSE_TIME)   # pause for class to see action
    clickContinue(driver)
    
def addItemsToCart(driver):
    '''Add a few items to Cart'''
    time.sleep(PAUSE_TIME)   # pause for class to see action
    # Add 3 Apples
    click_fruits(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_apple(driver)
    addQuantity(driver, 2)
    addToCart(driver)
    clickOK(driver)
    
    # Add 1 banana 
    click_fruits(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_banana(driver)
    addToCart(driver)
    clickOK(driver)
    
    # Add Salmon
    click_protein(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_salmon_fillet(driver)
    addQuantity(driver, 1)
    addToCart(driver)
    clickOK(driver)
    
    goToCart(driver)
    
def clickCategories(driver):
    '''Test Click All Different Categories'''
    click_all_products(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_dairy_and_eggs
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_vegetables(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_fruits(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_meat(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_seafood(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_protein(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_snack_and_candy(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action
    click_frozen(driver)
    time.sleep(PAUSE_TIME)   # pause for class to see action

"""CUSTOMER PAGE HELPER FUNCTIONS"""
def goToCart(driver):
    '''Find and click Cart'''
    cart_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Cart')]"))
    )
    cart_button.click()
    
def addQuantity(driver, amount):
    '''Add amount of item'''
    increaseButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[2]/div/div/div/div[2]/div/div/div[1]"))
    )
    for i in range(amount):
        increaseButton.click()

def addToCart(driver):
    '''Find and click Add To Cart'''
    addButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Add To Cart')]"))
    )
    addButton.click()  

def click_apple(driver):
    '''Find and click Apple'''
    apple = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[2]/div/div/ul/li[1]/div/a"))
    )
    apple.click()

def click_banana(driver):
    '''Find and click Banana'''
    banana = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[2]/div/div/ul/li[2]/div/a"))
    )
    banana.click()

def click_salmon_fillet(driver):
    '''Find and click Salmon'''
    salmon_fillet = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[2]/div/div/ul/li/div/a"))
    )
    salmon_fillet.click()
    
def click_all_products(driver):
    all_products_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'All Products')]"))
    )
    all_products_button.click()

def click_dairy_and_eggs(driver):
    dairy_and_eggs_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[1]/div[1]/a[2]/button"))
    )
    dairy_and_eggs_button.click()

def click_vegetables(driver):
    vegetables_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Vegetables')]"))
    )
    vegetables_button.click()

def click_fruits(driver):
    fruits_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Fruits')]"))
    )
    fruits_button.click()

def click_meat(driver):
    meat_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Meat')]"))
    )
    meat_button.click()

def click_seafood(driver):
    seafood_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Seafood')]"))
    )
    seafood_button.click()

def click_protein(driver):
    protein_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Protein')]"))
    )
    protein_button.click()

def click_snack_and_candy(driver):
    snack_and_candy_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[1]/div[1]/a[8]/button"))
    )
    snack_and_candy_button.click()

def click_frozen(driver):
    frozen_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Frozen')]"))
    )
    frozen_button.click()

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
    # time.sleep(PAUSE_TIME)   # pause for class to see action
    # clickOK(driver)
    
def clickSignUp(driver):
    '''Find and click link to Sign Up Page'''
    # Wait for page elements to load
    WebDriverWait(driver, 5).until(
        EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Create Account')]"))
    )
    # Find and click Create Account
    signUp = driver.find_element(By.XPATH, "//*[contains(text(), 'Create Account')]")
    signUp.click()
    
"""SIGN UP HELPER FUNCTIONS"""
def fillUsername(driver, username):
    '''Find Name Field and type in userName'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "userName")))
    # Locate name input fields and fill in user name
    username_field = driver.find_element(By.NAME, "userName")
    username_field.clear()
    username_field.send_keys(username)

def fillEmail(driver, email):
    '''Find Email Field and type in email'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))
    # Locate email input fields and fill in test email
    email_field = driver.find_element(By.NAME, "email")
    email_field.clear()
    email_field.send_keys(email)

def fillPassword(driver, password):
    '''Find Password Field and type in password'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "password")))
    # Locate password input fields and fill in password
    password_field = driver.find_element(By.NAME, "password")
    password_field.clear()
    password_field.send_keys(password)

def fillConfirmPassword(driver, confirmPassword):
    '''Find Password Field and type in confirmPassword'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.NAME, "confirmPassword")))
    # Locate confirm password input fields and fill in password
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