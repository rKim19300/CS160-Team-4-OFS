from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

URL = "http://localhost:3000"
PAUSE_TIME = 2

def main():
    testCounter = 100
    itemToRemove = "Apple"
    searchItem = "Orange"
    # Create WebDriver instance
    service = Service(executable_path="./chromedriver.exe")
    driver = webdriver.Chrome(service=service)
    driver.get(URL)
    pause()
    scrollPage(driver, PAUSE_TIME)
    
    # Landing Page -> Log In Page
    clickButton(driver, "Sign In")
    
    # Test Case: empty Input Field
    clickContinue(driver)
    clickOk(driver)
    pause()
    
    # Test case: Invalid Account Log In
    signIn(driver, "invalidEmail", "test")
    pause()
    signIn(driver, "invalidAccount@test.com", "test")
    clickOk(driver)
    
    # Log In Page -> Sign Up Page: Create Account
    clickButton(driver, "Create Account")
    
    # Test Case: Empty Input Field
    clickSubmit(driver)
    
    # Test Case: Email Input already exist
    createAccount(driver, "admin", "admin@admin.com")
    clickOk(driver)
    pause()
    
    # Test Case: Account successfully created
    createTestAccount(driver, testCounter - 1)
    pause()
    clickButton(driver, "Create Account")
    createTestAccount(driver, testCounter)
    pause()
    
    # Customer Action
    customerSignIn(driver, testCounter)
    pause()
    
    testSearchBar(driver, searchItem)
    changeQuantity(driver, 10)
    clickButton(driver, "Add To Cart")
    clickOk(driver)
    
    clickAllCategories(driver)
    pause()
    testEditProfile(driver)
    pause()
    clickLogo(driver)
    
    # Test Case: Check Out Address out or range
    testOrderOutOfRange(driver)
    
    # Test Case successfully checkout order
    testCreateOrder(driver)
    pause()
    clickLogo(driver)
    signOut(driver)
    
    # Add more order
    customerSignIn(driver, testCounter - 1)

    addMoreOrders(driver)
    clickLogo(driver)
    signOut(driver)
    
    # Test Admin Action
    pause()
    signIn(driver, "admin@admin.com", "admin")
    clickCustomerView(driver)
    clickAllCategories(driver)
    clickEmployeeView(driver)
    # Test Add Product
    scrollPage(driver, PAUSE_TIME)
    testAddProduct(driver)
    
    # Test Remove Product
    clickInventory(driver)
    pause()
    removeProduct(driver, itemToRemove)
    pause()
    scrollPage(driver, PAUSE_TIME)
    
    clickStore(driver)
    pause()
    clickAnalytics(driver)
    
    # Add click Analytics details
    clickButton(driver, "Year")
    clickButton(driver, "Month")
    clickButton(driver, "Week")
    pause()
    clickEmployees(driver)
    addEmployeeButton(driver)
    testAddEmployee(driver, testCounter)
    pause()
    signOut(driver)
    
    # Test Employee action
    
    testEmployeeEmail = "Employee" + str(testCounter) + "@employee.com"
    pause()
    signIn(driver, testEmployeeEmail, "P@$$w0rd")
    clickCustomerView(driver)
    scrollPage(driver, PAUSE_TIME)
    
    # clickAllCategories(driver)
    clickEmployeeView(driver)
    
    clickOrders(driver)
    clickMap(driver)
    
    clickButtonByText(driver, "Show Orders")
    pause()
    
    clickButtonByText(driver, "Show Robot1")
    pause()
    scrollPage(driver, PAUSE_TIME)
    
    clickButtonByText(driver, "Show Robot2")
    pause()
    clickButton(driver, "Send Orders")
    pause()
    
    scrollPage(driver, PAUSE_TIME)
    pause()
    
    # removeEmployee(driver, testCounter) not work yet
    signOut(driver)
    pause()
    driver.quit()
    
"""Test Admin Action"""

def testAddEmployee(driver, testCounter):
    '''Create test account'''
    name = "Employee" + str(testCounter)
    email = "Employee" + str(testCounter) + "@employee.com"
    createAccount(driver, name, email)
    
def addEmployeeButton(driver):
    '''Find and click the "+" button'''
    button = driver.find_element(By.CLASS_NAME, 'chakra-icon.css-onkibi')
    button.click()
        
def testAddProduct(driver):
    '''Create a few product and add to inventory'''
    clickInventory(driver)
    clickAddProduct(driver)
    addProduct(driver, "Cucumber", "1.25", "0.5", "20", "http://www.plantgrower.org/uploads/6/5/5/4/65545169/published/cucumber-slices.jpg?1516496438","Vegetables")
    clickInventory(driver)
    clickAddProduct(driver)
    addProduct(driver, "Water Melon", "1.00", "1.25", "30", "https://www.watermelon.org/wp-content/uploads/2019/12/Seedless-Watermelon-Slice-2000x1500.jpg","Fruits")
    clickInventory(driver)
    clickAddProduct(driver)
    addProduct(driver, "Lamb Chop", "2.00", "2.25", "15", "https://www.themeatguy.jp/media/wysiwyg/cookingstudio/recipe/36/36_lamb_00.jpg","Frozen")
    
def addProduct(driver, itemName, price, weight, quantity, image, type):
    '''Add product to Inventory'''
    clickInventory(driver)
    clickAddProduct(driver)
    fillProductDetails(driver, itemName, price, weight, quantity)
    fillProductDescription(driver, itemName + " " + type)
    fillImageURL(driver, image)
    clickCheckbox(driver, type)
    clickSave(driver)
    
def removeProduct(driver, product_name):
    '''Find and click the Remove button for the specified product'''
    removeXpath = f"//td[text()='{product_name}']/following-sibling::td/button[contains(text(), 'Remove')]"
    removeButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, removeXpath))
    )
    removeButton.click()
    
def fillProductDetails(driver, product_name, price, weight, quantity):
    '''Find and fill in product details'''
    fillProductName(driver, product_name)
    fillProductPrice(driver, price)
    fillProductWeight(driver, weight)
    fillProductQuantity(driver, quantity)
    
# def removeEmployee(driver, employeeId):
#     '''Find and remove an employee by ID'''
#     try:
#         # Find the employee ID element
#         employeeIdElement = WebDriverWait(driver, 10).until(
#             EC.visibility_of_element_located((By.XPATH, f"//div[contains(text(), 'ID #{employeeId}')]"))
#         )
#         # Find the dropdown button using the provided class
#         dropdownButton = employeeIdElement.find_element(By.CLASS_NAME, "css-26wy9z")
#         # Click the dropdown button
#         dropdownButton.click()
        
#         # Find and click the "Remove" option
#         removeOption = WebDriverWait(driver, 10).until(
#             EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Remove')]"))
#         )
#         removeOption.click()
#         print(f"Employee with ID #{employeeId} has been removed successfully.")
#     except:
#         print(f"Employee with ID #{employeeId} was not found.")

"""Test Customer Action"""
def testOrderOutOfRange(driver):
    '''Test Case location Out Of Range'''
    
    testSearchBar(driver, "Milk")
    changeQuantity(driver, 1)
    clickButton(driver, "Add To Cart")
    clickOk(driver)
    
    addToCart(driver, "Pasta", 1)
    # payment = ["Test Card One", "3321 567898 65678", "02/26", "1234", "95112"]
    address = ["39035 Fremont Hub", "", "Fremont", "CA", "94538"] # invalid address
    
    goToCart(driver)
    clickButtonByText(driver, 'Checkout')
    fillDeliveryInfo(driver, address[0], address[2], address[2], address[3], address[4])
    clickNext(driver)
    clickOkay(driver)
    clickLogo(driver)
    
def addMoreOrders(driver):
    '''CheckOut multiple orders'''
    address0 = ["140 E San Carlos St", "", "San Jose", "CA", "95112"]
    payment0 = ["Test Card", "4321 5678 1234 5678", "02/26", "123", "95112"]
    address1 = ["777 Story Rd", "", "San Jose", "CA", "95122"]
    payment1 = ["Test Card One", "3321 567898 65678", "02/26", "1234", "95112"]
    address2 = ["1750 Story Rd", "", "San Jose", "CA", "95122"]
    payment2 = ["Test Card Two", "4321 5678 1234 5678", "02/29", "123", "93212"]
    address3 = ["535 N 5th St", "", "San Jose", "CA", "95112"]
    payment3 = ["Test Card Three", "5321 5678 1234 5678", "02/27", "123", "92148"]
    address4 = ["5095 Almaden Expy", "", "San Jose", "CA", "95118"]
    payment4 = ["Test Card Four", "4321 5678 1234 5678", "02/26", "123", "95123"]
    address5 = ["2200 Eastridge Loop", "Suite 1103", "San Jose", "CA", "95122"]
    payment5 = ["Test Card Five", "4321 5678 1234 5678", "02/28", "123", "95111"]
    
    address6 = ["87 N San Pedro St", "", "San Jose", "CA", "95110"]
    payment6 = ["Test Card", "4321 5678 1234 5678", "02/26", "123", "95112"]
    address7 = ["111 W Alma Ave", "", "San Jose", "CA", "95110"] 
    payment7 = ["Test Card One", "3321 567898 65678", "02/26", "1234", "95112"]
    address8 = ["325 Willow St", "", "San Jose", "CA", "95110"]
    payment8 = ["Test Card Two", "4321 5678 1234 5678", "02/29", "123", "93212"]
    address9 = ["87 N San Pedro St", "", "San Jose", "CA", "95110"]
    payment9 = ["Test Card", "4321 5678 1234 5678", "02/26", "123", "95112"]
    address10 = ["111 W Alma Ave", "", "San Jose", "CA", "95110"] 
    payment10 = ["Test Card One", "3321 567898 65678", "02/26", "1234", "95112"]
    address11 = ["325 Willow St", "", "San Jose", "CA", "95110"]
    payment11 = ["Test Card Two", "4321 5678 1234 5678", "02/29", "123", "93212"]
    
    clickButton(driver, "Fruits")
    addToCart(driver, "Orange", 3)
    addToCart(driver, "Salmon Fillet", 2)
    checkOut(driver, address0, payment0)
    
    addToCart(driver, "Salmon Fillet", 3)
    addToCart(driver, "Pasta", 1)
    checkOut(driver, address1, payment1)
    
    addToCart(driver, "Brown Eggs", 3)
    addToCart(driver, "Onions", 1)
    addToCart(driver, "Bell Peppers", 1)
    checkOut(driver, address2, payment2)
    
    addToCart(driver, "Green Beans", 2)
    addToCart(driver, "Pork Chop", 2)
    checkOut(driver, address3, payment3)
    
    addToCart(driver, "Milk", 2)
    addToCart(driver, "Pasta", 1)
    checkOut(driver, address4, payment4)
    
    addToCart(driver, "Potatoes", 1)
    addToCart(driver, "Chicken Breast", 1)
    checkOut(driver, address5, payment5)

def testEditProfile(driver):
    '''Customer Edit Name'''
    clickProfile(driver)
    fillName(driver, "Change Name")
    clickSave(driver)

def testCreateOrder(driver):
    '''Successfully create a test Order'''
    address = ["400 S Third St", "", "San Jose", "CA", "95112"]
    payment = ["Test Card Two", "4321 5678 1234 5678", "02/29", "123", "93212"]
    clickButton(driver, "Meat")
    addToCart(driver, "Beef", 3)
    addToCart(driver, "Milk", 1)
    checkOut(driver, address, payment)
    
def checkOut(driver, address, payment):
    '''Check Out an Order in Cart'''
    goToCart(driver)
    clickButtonByText(driver, 'Checkout')
    fillDeliveryInfo(driver, address[0], address[2], address[2], address[3], address[4])
    
    clickNext(driver)
    clickConfirm(driver)
    fillInPayment(driver, payment[0], payment[1], payment[2], payment[3], payment[4])
    
    clickNext(driver)
    clickConfirm(driver)
    pause()
    clickLogo(driver)
    
def fillInPayment(driver, cardName, cardNo, exp, cvv, zipcode):
    '''Fill in payment information'''
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
def createAccount(driver, name, email):
    '''Create an account'''
    fillUsername(driver, name)
    fillEmail(driver, email)
    fillPassword(driver, "P@$$w0rd")
    fillConfirmPassword(driver, "P@$$w0rd")
    clickSubmit(driver)
    
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
    clickOk(driver)
    
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
    
def clickEditProduct(driver, product_name):
    '''Find and click the Edit button for the specified product'''
    editXpath = f"//td[text()='{product_name}']/following-sibling::td/a/button[contains(text(), 'Edit')]"
    editButton = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, editXpath))
    )
    editButton.click()

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
    pause()
    button.click()
    
def clickBySelector(driver, selector):
    '''Find and click the button based on the given selector'''
    # Wait for the button to be clickable
    button = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.CSS_SELECTOR, selector)))
    pause()
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

"""Find checkbox and click"""

def clickCheckbox(driver, value):
    '''Find and click a checkbox by its value'''
    checkbox = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, f"//input[@value='{value}']"))
    )
    pause()
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

def scrollPage(driver, duration):
    # Get the initial scroll position
    last_scroll_position = driver.execute_script("return document.body.scrollHeight")
    
    # Calculate the increment for scrolling
    scroll_increment = 100  # Adjust this value for slower or faster scrolling
    
    # Scroll down the page slowly until reaching the bottom
    while True:
        # Scroll down by a small increment
        driver.execute_script(f"window.scrollBy(0, {scroll_increment});")
        
        # Wait for a short time to simulate slow scrolling
        time.sleep(0.1)  # Adjust this value for smoother or slower scrolling
        
        # Get the current scroll position
        current_scroll_position = driver.execute_script("return window.pageYOffset;")
        
        # Check if we've reached the bottom of the page
        if current_scroll_position == last_scroll_position:
            break
        
        last_scroll_position = current_scroll_position
    
    # Wait for the specified duration
    time.sleep(duration)
    
    # Scroll back up to the top of the page
    driver.execute_script("window.scrollTo(0, 0);")
    
def testSearchBar(driver, itemName):
    ''' Use Search bar to find the given itemName'''
    wait = WebDriverWait(driver, 10)
    searchBar = wait.until(EC.visibility_of_element_located((By.ID, "react-select-3-input")))
    searchBar.send_keys(itemName)
    pause()
    searchBar.send_keys(Keys.ENTER)
    
def pause():
    time.sleep(PAUSE_TIME)
    
if __name__ == '__main__':
    main()
