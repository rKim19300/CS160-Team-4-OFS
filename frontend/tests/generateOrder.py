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
    orderNum = 11    # orders / run (MAX = 11)
    ItemToAdd = 3    # items / order
    testEmail = "test@test.com"
    testPassword = "P@$$w0rd"

    addressList = initializeAddress()
    paymentList = initializePayment()
    itemList = ["Banana", "Salmon Fillet", "Brown Rice", 
                "Orange", "Orange Juice", "Apple Juice", "Pasta",
                "Broccoli", "Brown Eggs", "White Eggs", 
                "Beef", "Pork Chop", "Chicken Breast", 
                "Milk", "Corn", "Onions", "Potatoes", 
                "Bell Peppers", "Green Beans"]
    
    # Create WebDriver instance and open webpage
    service = Service(executable_path="./chromedriver.exe")
    driver = webdriver.Chrome(service=service)
    driver.get(URL)
    # Log In
    clickButton(driver, "Sign In")
    signIn(driver, testEmail, testPassword)
    # Add orders
    for order in range(orderNum):
        for i in range(ItemToAdd):
            addToCart(driver, itemList[i + order], i + 1)
        checkOut(driver, addressList[order], paymentList[order])
    
    print("Done adding " + str(orderNum) + " orders (" + str(ItemToAdd) + " items/order)")
    signOut(driver)
    driver.quit()

''' CUSTOMER ACTION '''
def addToCart(driver, item, amount):
    '''Add item To Cart'''
    clickButton(driver, item)
    changeQuantity(driver, amount)
    clickButton(driver, "Add To Cart")
    clickOk(driver)

def changeQuantity(driver, amount):
    '''Find the Quantity field and fill in the specified amount'''
    fillInInput(driver, By.CSS_SELECTOR, ".chakra-numberinput__field", str(amount))
    
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
    clickLogo(driver)

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
    
''' CUSTOMER INFORMATION'''
def initializeAddress():
    addressList = [0 for x in range(11)]
    addressList[0] = ["140 E San Carlos St", "", "San Jose", "CA", "95112"]
    addressList[1] = ["777 Story Rd", "", "San Jose", "CA", "95122"]
    addressList[2] = ["1750 Story Rd", "", "San Jose", "CA", "95122"]
    addressList[3] = ["535 N 5th St", "", "San Jose", "CA", "95112"]
    addressList[4] = ["5095 Almaden Expy", "", "San Jose", "CA", "95118"]
    addressList[5] = ["2200 Eastridge Loop", "Suite 1103", "San Jose", "CA", "95122"]
    addressList[6] = ["87 N San Pedro St", "", "San Jose", "CA", "95110"]
    addressList[7] = ["111 W Alma Ave", "", "San Jose", "CA", "95110"] 
    addressList[8] = ["325 Willow St", "", "San Jose", "CA", "95110"]
    addressList[9] = ["515 S 10th St", "", "San Jose", "CA", "95112"]
    addressList[10] = ["360 E Reed St", "", "San Jose", "CA", "95112"] 
    return addressList
    
def initializePayment():
    cardList = [0 for x in range(11)]
    cardList[0] = ["Test Card", "4321 5678 1234 5678", "04/25", "123", "95112"]
    cardList[1] = ["Test Card One", "3321 567898 65678", "02/26", "1234", "95112"]
    cardList[2] = ["Test Card Two", "4321 5678 1234 5678", "02/29", "123", "93212"]
    cardList[3] = ["Test Card Three", "5321 5678 1234 5678", "03/27", "123", "92148"]
    cardList[4] = ["Test Card Four", "4321 5678 1234 5678", "11/26", "123", "95123"]
    cardList[5] = ["Test Card Five", "4321 5678 1234 5678", "12/28", "123", "95111"]
    cardList[6] = ["Test Card Six", "4321 5678 1234 5678", "02/26", "123", "95112"]
    cardList[7] = ["Test Card Seven", "3321 567898 65678", "06/24", "1234", "95112"]
    cardList[8] = ["Test Card Eight", "4321 5678 1234 5678", "02/29", "123", "93212"]
    cardList[9] = ["Test Card Nine", "4321 5678 1234 5678", "07/26", "123", "94112"]
    cardList[10] = ["Test Card Ten", "3321 567898 65678", "09/28", "1234", "95148"]
    return cardList

'''FIND BUTTON AND CLICK'''
def clickLogo(driver):
    '''Find and click the logo on the top left of the website'''
    logo = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CSS_SELECTOR, '.NavBarCustomer_logoImg__j26-K'))
    )
    logo.click()
    
def goToCart(driver):
    '''Find and click Cart'''
    clickButtonByText(driver, 'Cart')
    
def clickOk(driver):
    '''Find and click OK button'''
    clickButton(driver, "OK")

def clickNext(driver):
    '''Find and click Next button'''
    clickButton(driver, "Next")
    
def clickContinue(driver):
    '''Find and click Continue button'''
    clickButton(driver, "Continue")
    
def clickConfirm(driver):
    '''Find and click Confirm'''
    clickButtonByText(driver, 'Confirm')
    
def clickSubmit(driver):
    '''Find and click Submit button'''
    clickButton(driver, "Submit")

def clickButtonByText(driver, buttonText):
    '''Find and click a button with specified text'''
    button = waitForElement(driver, By.XPATH, f"//button[contains(text(),'{buttonText}')]")
    time.sleep(PAUSE_TIME)
    button.click()
    
def clickButton(driver, text):
    '''Find and click a button with dynamic text'''
    button = waitForElement(driver, By.XPATH, f"//*[contains(text(), '{text}')]")
    time.sleep(PAUSE_TIME)
    button.click()

def waitForElement(driver, by, locator, timeout=10):
    '''Wait for element to be present and visible'''
    return WebDriverWait(driver, timeout).until(EC.presence_of_element_located((by, locator)))
    
'''FIND FIELD AND SEND INPUT'''
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
    
def fillNameOnCard(driver, name):
    '''Fill in the Name on Card input field'''
    fillInInput(driver, By.NAME, "nameOnCard", name)

def fillCardNumber(driver, number):
    '''Fill in the Card Number input field'''
    fillInInput(driver, By.NAME, "cardNumber", number)

def fillExpiryDate(driver, expiry_date):
    '''Fill in the Expiry Date input field'''
    fillInInput(driver, By.NAME, "exp", expiry_date)

def fillCVV(driver, cvv):
    '''Fill in the CVV input field'''
    fillInInput(driver, By.NAME, "cvv", cvv)
    
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
    
def fillInInput(driver, by, locator, value):
    '''Find input box of specified type and type in value'''
    # Wait for page elements to load
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((by, locator)))
    # Locate input field and fill in the value
    inputField = driver.find_element(by, locator)
    inputField.send_keys(Keys.CONTROL, 'a')
    inputField.send_keys(Keys.DELETE)
    inputField.send_keys(value)

if __name__ == '__main__':
    main()