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
    testCounter = 7
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
    
    # createTestAccount(driver, 6)
    # clickButton(driver, "Create Account")
    
    # # Test Case: Email Input already exist
    # createTestAccount(driver, 6)
    # clickOk(driver)
    # pause()
    
    # # Test Case: Account successfully created
    # createTestAccount(driver, testCounter)
    # pause()
    
    # customerSignIn(driver, testCounter)
    # clickAllCategories(driver)
    # pause()
    # testEditProfile(driver)
    # pause()
    # testCreateOrder(driver)
    # pause()
    # clickLogo(driver)
    # signOut(driver)
    
    # # Add more order
    # customerSignIn(driver, testCounter - 1)
    # testCreateOrder1(driver)
    # clickLogo(driver)
    # signOut(driver)
    
    # Test Admin Action
    pause()
    signIn(driver, "admin@admin.com", "admin")
    # clickCustomerView(driver)
    # clickAllCategories(driver)
    # clickEmployeeView(driver)
    # testAddProduct(driver)
    
    # # Test Remove Product
    # clickInventory(driver)
    # removeProduct(driver, "Corn")

    # pause()
    # clickStore(driver)
    # pause()
    
    clickOrders(driver)
    clickMap(driver)
    clickButtonByText(driver, "Show Orders")
    
    pause()
    clickButtonByText(driver, "Show Robot2")
    pause()
    clickButtonByText(driver, "Show Robot1")
    
    pause()
    clickStore(driver)
    pause()
    clickAnalytics(driver)
    clickEmployees(driver)
    addEmployeeButton(driver)
    
    signOut(driver)
    
    pause()
    driver.quit()
    
"""Test Admin Action"""

def clickStore(driver):
    '''Find and click Store button'''
    button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "css-0"))
    )
    button.click()
    
def clickAnalytics(driver):
    '''Find and click the Analytics button'''
    clickButton(driver, 'Analytics')

def clickEmployees(driver):
    '''Find and click the Employees button'''
    clickButton(driver, 'Employees')
    
def addEmployeeButton(driver):
    '''Find and click the "+" button'''
    button = driver.find_element(By.CLASS_NAME, 'chakra-icon.css-onkibi')
    button.click()

def testAddProduct(driver):
    clickInventory(driver)
    clickAddProduct(driver)
    
    fillProductDetails(driver, "Cucumber", "0.50", "0.5", "20")
    fillProductDescription(driver, "cucumber, (Cucumis sativus), creeping plant of the gourd family (Cucurbitaceae), widely cultivated for its edible fruit.")
    fillImageURL(driver, "https://mucci-production-user-uploads-bucket.s3.amazonaws.com/images/Product-IMG_MiniCucumbers-rev2.original.png")
    
    clickVegetablesCheckbox(driver)
    clickSave(driver)
    
def removeProduct(driver, product_name):
    '''Find and click the Remove button for the specified product'''
    removeXpath = f"//td[text()='{product_name}']/following-sibling::td/button[contains(text(), 'Remove')]"
    removeButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, removeXpath))
    )
    removeButton.click()
    
def clickEditProduct(driver, product_name):
    '''Find and click the Edit button for the specified product'''
    editXpath = f"//td[text()='{product_name}']/following-sibling::td/a/button[contains(text(), 'Edit')]"
    editButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, editXpath))
    )
    editButton.click()

def fillProductDetails(driver, product_name, price, weight, quantity):
    '''Find and fill in product details'''
    fillProductName(driver, product_name)
    fillProductPrice(driver, price)
    fillProductWeight(driver, weight)
    fillProductQuantity(driver, quantity)

    
"""Test Customer Action"""

def testEditProfile(driver):
    '''Customer Edit Name'''
    clickProfile(driver)
    fillName(driver, "Change Name")
    clickSave(driver)

def testCreateOrder(driver):
    '''Successfully create a test Order'''
    clickButton(driver, "Meat")
    addToCart(driver, "Beef", 3)
    addToCart(driver, "Milk", 1)
    checkOut(driver)
    
def testCreateOrder1(driver):
    '''Successfully create a test Order'''
    clickButton(driver, "Fruits")
    addToCart(driver, "Orange", 3)
    addToCart(driver, "Salmon Fillet", 2)
    checkOut1(driver)
    
def checkOut(driver):
    '''Check Out an Order in Cart'''
    goToCart(driver)
    clickButtonByText(driver, 'Checkout')
    fillDeliveryInfo(driver, "1 Washington St", "", "Santa Clara", "CA", "95050")
    clickNext(driver)
    # clickConfirm(driver)
    fillInPayment(driver, "Test Card", "4321 5678 1234 5678", "02/26", "123", "95112")
    clickNext(driver)
    clickConfirm(driver)
    
def checkOut1(driver):
    '''Check Out an Order in Cart'''
    goToCart(driver)
    clickButtonByText(driver, 'Checkout')
    fillDeliveryInfo(driver, "2201 Senter Rd", "", "San Jose", "CA", "95112")
    clickNext(driver)
    # clickConfirm(driver)
    fillInPayment(driver, "Tester Card", "54321 5678 1234 5678", "09/27", "123", "95112")
    clickNext(driver)
    clickConfirm(driver)
    
def fillInPayment(driver, cardName, cardNo, exp, cvv, zipcode):
    fillNameOnCard(driver, cardName)
    fillCardNumber(driver, cardNo)
    fillExpiryDate(driver, exp)
    fillCVV(driver, cvv)
    fillZipCode(driver, zipcode)
    
    
def fillDeliveryInfo(driver, address1, address2, city, state, zipcode):
    '''Fill in delivery information'''
    fillAddressLine1(driver, address1)
    fillAddressLine2(driver, address2)
    fillCity(driver, city)
    fillState(driver, state)
    fillZipCode(driver, zipcode)

    
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
    clickButton(driver, "Drinks")
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
    
def signOut(driver):
    '''Find and click the Sign Out button'''
    signOutButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'Sign Out')]"))
    )
    signOutButton.click()
    
def createTestAccount(driver, testCounter):
    '''Create test account'''
    name = "test" + str(testCounter)
    email = "test" + str(testCounter) + "@test.com"
    
    fillUsername(driver, name)
    fillEmail(driver, email)
    fillPassword(driver, "P@$$w0rd")
    fillConfirmPassword(driver, "P@$$w0rd")
    clickSubmit(driver)
    
"""Find checkbox and click"""

def clickCheckbox(driver, value):
    '''Find and click a checkbox by its value'''
    checkbox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//input[@value='{value}']"))
    )
    checkbox.click()

def clickDairyAndEggsCheckbox(driver):
    '''Find and click the Dairy & Eggs checkbox'''
    clickCheckbox(driver, "Dairy & Eggs")

def clickVegetablesCheckbox(driver):
    '''Find and click the Vegetables checkbox'''
    clickCheckbox(driver, "Vegetables")

def clickFruitsCheckbox(driver):
    '''Find and click the Fruits checkbox'''
    clickCheckbox(driver, "Fruits")

def clickMeatCheckbox(driver):
    '''Find and click the Meat checkbox'''
    clickCheckbox(driver, "Meat")

def clickSeafoodCheckbox(driver):
    '''Find and click the Seafood checkbox'''
    clickCheckbox(driver, "Seafood")

def clickProteinCheckbox(driver):
    '''Find and click the Protein checkbox'''
    clickCheckbox(driver, "Protein")

def clickSnacksAndCandyCheckbox(driver):
    '''Find and click the Snacks & Candy checkbox'''
    clickCheckbox(driver, "Snacks & Candy")

def clickFrozenCheckbox(driver):
    '''Find and click the Frozen checkbox'''
    clickCheckbox(driver, "Frozen")

"""Find and click Buttons"""

def clickLogo(driver):
    '''Find and click the logo on the top left of the website'''
    logo = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '.NavBarCustomer_logoImg__j26-K'))
    )
    logo.click()
    
def clickSendOrders(driver):
    '''Find and click Send Orders button'''
    clickButtonByText(driver, "Send Orders")
    
def goToCart(driver):
    '''Find and click Cart'''
    clickButtonByText(driver, 'Cart')
    
def clickProfile(driver):
    '''Find and click Profile button'''
    clickButtonByText(driver, 'Profile')
    
def clickInventory(driver):
    '''Find and click Inventory button'''
    clickButtonByText(driver, 'Inventory')
    
def clickAddProduct(driver):
    '''Find and click Add Product button'''
    clickButtonByText(driver, 'Add Product')

def clickOrders(driver):
    '''Find and click Orders button'''
    clickButtonByText(driver, 'Orders')

def clickMap(driver):
    '''Find and click Map button'''
    clickButtonByText(driver, 'Map')
    
def clickCustomerView(driver):
    '''Find and click Customer View button'''
    clickButtonByText(driver, 'Customer View')
    
def clickEmployeeView(driver):
    '''Find and click Employee View button'''
    clickButtonByText(driver, 'Employee View')
    
def clickSave(driver):
    '''Find and click Save button'''
    clickButton(driver, "Save")
    
def clickConfirm(driver):
    '''Find and click Confirm'''
    clickButtonByText(driver, 'Confirm')
    
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
    
def clickBySelector(driver, selector):
    '''Find and click the button based on the given selector'''
    # Wait for the button to be clickable
    button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    # Click the button
    button.click()
    
def clickButton(driver, text):
    '''Find and click a button with dynamic text'''
    button = waitForElement(driver, By.XPATH, f"//*[contains(text(), '{text}')]")
    pause()
    button.click()

def waitForElement(driver, by, locator, timeout=10):
    '''Wait for element to be present and visible'''
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, locator)))
    
"""Find Fields and Send User Input"""

def fillImageURL(driver, url):
    '''Find and fill in the Image URL input field'''
    fillInputByLabel(driver, "Image URL", url)

def fillProductDescription(driver, description):
    '''Find and fill in the Product description input field'''
    textarea_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "textarea.chakra-textarea.css-d3o0p2"))
    )
    textarea_field.clear()
    textarea_field.send_keys(description)
    
def fillProductName(driver, product_name):
    '''Find and fill in the product name'''
    fillInInput(driver, By.XPATH, "//label[text()='Name']/following-sibling::input", product_name)

def fillProductPrice(driver, price):
    '''Find and fill in the product price'''
    fillInInput(driver, By.XPATH, "//label[text()='Price']/following-sibling::div/input", price)

def fillProductWeight(driver, weight):
    '''Find and fill in the product weight'''
    fillInInput(driver, By.XPATH, "//label[text()='Weight']/following-sibling::div/input", weight)

def fillProductQuantity(driver, quantity):
    '''Find and fill in the product quantity'''
    fillInInput(driver, By.XPATH, "//label[text()='Quantity']/following-sibling::div/input", quantity)
    
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

def fill_input_field_by_name(driver, name, value):
    '''Find and fill in the input field by its name'''
    input_field = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, f"input[name='{name}']"))
    )
    input_field.clear()
    input_field.send_keys(value)

def fillNameOnCard(driver, name):
    '''Fill in the Name on Card input field'''
    fill_input_field_by_name(driver, 'nameOnCard', name)

def fillCardNumber(driver, number):
    '''Fill in the Card Number input field'''
    fill_input_field_by_name(driver, 'cardNumber', number)

def fillExpiryDate(driver, expiry_date):
    '''Fill in the Expiry Date input field'''
    fill_input_field_by_name(driver, 'exp', expiry_date)

def fillCVV(driver, cvv):
    '''Fill in the CVV input field'''
    fill_input_field_by_name(driver, 'cvv', cvv)

def fillZipCode(driver, zip_code):
    '''Fill in the Zip Code input field'''
    fill_input_field_by_name(driver, 'zipCode', zip_code)
    
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

def fillInputByLabel(driver, label, value):
    '''Find and fill in an input field by its label'''
    input_field = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//label[contains(text(), '{label}')]/following-sibling::input"))
    )
    # input_field.clear()
    input_field.send_keys(Keys.CONTROL, 'a')
    input_field.send_keys(Keys.DELETE)
    input_field.send_keys(value)
    
def pause():
    time.sleep(PAUSE_TIME)
    
if __name__ == '__main__':
    main()
