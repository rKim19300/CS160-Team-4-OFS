from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL = "http://localhost:3000"
PAUSE_TIME = 1


def main():
    testCounter = 1
    # Create WebDriver instance
    service = Service(executable_path="./chromedriver.exe")
    driver = webdriver.Chrome(service=service)
    driver.get(URL)
    
    # Landing Page -> Log In Page
    clickButton(driver, "Sign In")
    
    # # Test Case: empty Input Field
    # clickContinue(driver)
    # clickOk(driver)
    # pause()
    
    # # Test case: Invalid Account Log In
    # signIn(driver, "invalidAccount@test.com", "test")
    # clickOk(driver)
    
    # # Log In Page -> Sign Up Page: Create Account
    # clickButton(driver, "Create Account")
    
    # # Test Case: Empty Input Field
    # clickSubmit(driver)
    
    # # Test Case: Email Input already exist
    # createTestAccount(driver, 0)
    # clickOk(driver)
    # pause()
    
    # # Test Case: Account successfully created
    # createTestAccount(driver, testCounter)
    # pause()
    
    customerSignIn(driver, testCounter)
    # clickAllCategories(driver)
    pause()
    # testEditProfile(driver)
    testCreateOrder(driver)
    # Test Admin Action
    # pause()
    # signIn(driver, "admin@admin.com", "admin")
    
    pause()
    driver.quit()
    
"""Test Customer Action"""

def testEditProfile(driver):
    '''Customer Edit Name'''
    # clickProfile(driver)
    clickButtonByText(driver, 'Profile')  # To go to the profile page
    
    fillName(driver, "Change Name")
    clickSave(driver)
    clickButtonByText(driver, 'Sign Out')  # To sign out

def testCreateOrder(driver):
    '''Successfully create a test Order'''
    clickButton(driver, "Fruits")
    addToCart(driver, "Apple", 3)
    addToCart(driver, "Salmon Fillet", 2)
    
    goToCart(driver)
    checkOut(driver)
    fillDeliveryInfo(driver, "1 Washington St", "", "Santa Clara", "CA", "95050")
    clickNext(driver)

def fillDeliveryInfo(driver, address1, address2, city, state, zipcode):
    '''Fill in delivery information'''
    fillAddressLine1(driver, address1)
    fillAddressLine2(driver, address2)
    fillCity(driver, city)
    fillState(driver, state)
    fillZipCode(driver, zipcode)
    
def goToCart(driver):
    '''Find and click Cart'''
    clickButtonByText(driver, 'Cart')
    
def checkOut(driver):
    '''Find and click Cart'''
    clickButtonByText(driver, 'Checkout')
    
def addToCart(driver, item, amount):
    '''Add item To Cart'''
    clickButton(driver, item)
    changeQuantity(driver, amount)
    clickButton(driver, "Add To Cart")
    clickOk(driver)
    
def clickAllCategories(driver):
    clickButton(driver, "All Products")
    clickButton(driver, "Dairy & Eggs")
    clickButton(driver, "Vegetables")
    clickButton(driver, "Fruits")
    clickButton(driver, "Meat")
    clickButton(driver, "Seafood")
    clickButton(driver, "Protein")
    clickButton(driver, "Snacks & Candy")
    clickButton(driver, "Frozen")
    clickButton(driver, "Buy It Again")
    
def changeQuantity(driver, amount):
    '''Find the Quantity field and fill in the specified amount'''
    fillInInput(driver, By.CSS_SELECTOR, ".chakra-numberinput__field", str(amount))

def increaseQuantity(driver):
    '''Find and click the increase button'''
    clickBySelector(driver, ".css-1m5jnul:not([disabled])")

def decreaseQuantity(driver):
    '''Find and click the decrease button'''
    clickBySelector(driver, ".css-1m5jnul[disabled]")

def clickBySelector(driver, selector):
    '''Find and click the button based on the given selector'''
    # Wait for the button to be clickable
    button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    # Click the button
    button.click()
    
"""Test Authentification"""

def customerSignIn(driver, testCounter):
    email = "test" + str(testCounter) + "@test.com"
    password = "P@$$w0rd"
    signIn(driver, email, password)
    
def signIn(driver, email, password):
    '''Sign In with user input'''
    fillInEmail(driver, email)
    fillInPassword(driver, password)
    clickContinue(driver)
    
def createTestAccount(driver, testCounter):
    '''Create test account'''
    name = "test" + str(testCounter)
    email = "test" + str(testCounter) + "@test.com"
    
    fillUsername(driver, name)
    fillEmail(driver, email)
    fillPassword(driver, "P@$$w0rd")
    fillConfirmPassword(driver, "P@$$w0rd")
    clickSubmit(driver)
    
"""Find and click Buttons"""

def clickButton(driver, text):
    '''Find and click a button with dynamic text'''
    button = waitForElement(driver, By.XPATH, f"//*[contains(text(), '{text}')]")
    pause()
    button.click()

def waitForElement(driver, by, locator, timeout=10):
    '''Wait for element to be present and visible'''
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, locator)))

def clickProfile(driver):
    '''Find and click Profile button'''
    clickButton(driver, "Profile")
    
def clickSave(driver):
    '''Find and click Save button'''
    clickButton(driver, "Save")
    
def clickOkay(driver):
    '''Find and click Okay button'''
    clickButton(driver, "Okay")
    
def clickNext(driver):
    '''Find and click Next button'''
    clickButton(driver, "Next")
    
def clickOk(driver):
    '''Find and click OK button'''
    clickButton(driver, "OK")

def clickContinue(driver):
    '''Find and click Continue button'''
    clickButton(driver, "Continue")
    
def clickSubmit(driver):
    '''Find and click Submit button'''
    clickButton(driver, "Submit")

def clickButtonByText(driver, buttonText):
    '''Find and click a button with specified text'''
    button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//button[contains(text(),'{buttonText}')]"))
    )
    button.click()
    
"""Find Fields and Send User Input"""

def fillName(driver, name):
    '''Find and fill the name field'''
    fillInInput(driver, By.XPATH, "//label[contains(text(), 'Name')]/following-sibling::input", name)

def fillAddressLine1(driver, address):
    '''Fill in Address Line 1'''
    fillInInput(driver, By.NAME, "addressLine1", address)
    
def fillAddressLine2(driver, address):
    '''Fill in Address Line 2'''
    fillInInput(driver, By.NAME, "addressLine2", address)
    
def fillCity(driver, city):
    '''Fill in City'''
    fillInInput(driver, By.NAME, "city", city)

def fillState(driver, state):
    '''Fill in State'''
    fillInInput(driver, By.NAME, "state", state)

def fillZipCode(driver, zipcode):
    '''Fill in Zip Code'''
    fillInInput(driver, By.NAME, "zipCode", zipcode)

def fillInEmail(driver, email):
    '''Find email box and type in email'''
    fillInInput(driver, By.XPATH, "//input[@type='email']", email)

def fillInPassword(driver, password):
    '''Find password box and type in password'''
    fillInInput(driver, By.XPATH, "//input[@type='password']", password)
    
def fillUsername(driver, username):
    '''Find Name Field and type in userName'''
    fillInInput(driver, By.NAME, "userName", username)

def fillEmail(driver, email):
    '''Find Email Field and type in email'''
    fillInInput(driver, By.NAME, "email", email)

def fillPassword(driver, password):
    '''Find Password Field and type in password'''
    fillInInput(driver, By.NAME, "password", password)

def fillConfirmPassword(driver, confirmPassword):
    '''Find Password Field and type in confirmPassword'''
    fillInInput(driver, By.NAME, "confirmPassword", confirmPassword)
    
def fillInInput(driver, by, locator, value):
    '''Find input box of specified type and type in value'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((by, locator)))
    
    # Locate input field and fill in the value
    input_field = driver.find_element(by, locator)
    # input_field.clear()
    # Uncomment the following lines if you want to clear the field before typing
    input_field.send_keys(Keys.CONTROL, 'a')
    input_field.send_keys(Keys.DELETE)
    input_field.send_keys(value)

    
def pause():
    time.sleep(PAUSE_TIME)
    
if __name__ == '__main__':
    main()
