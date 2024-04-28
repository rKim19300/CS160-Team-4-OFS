from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time
from clickable import Click

PAUSE_TIME = 2
testCounter = 0

class Tester:
    '''Include all test cases for OFS website using Selenium'''
    def __init__(self) -> None:
        self._URL = "http://localhost:3000"
        self._service = Service(executable_path="./chromedriver.exe")
        self._driver = webdriver.Chrome(service=self._service)
        self._click = Click(self._driver)
        self._fill = FillIn(self._driver)
        
    def testRun(self):
        '''All Pages Test Cases'''
        # Landing
        self._driver.get(self._URL)
        
        # Log In Page
        self._click.sign_in()
        self.pause()
        
        self._fill.email("admin@admin.com")
        self._fill.password("admin")
        self.pause()
        self._click.continue_()
        # self._click.sign_up()
        # self._fill.fill_email("test@test.com")
        # self._fill.fill_password("P@$$w0rd")
        # self._click.start_now()
        # self._click.submit()
        self._driver.quit()
        
    def pause(self):
        time.sleep(PAUSE_TIME)

class FillIn:
    '''Find all field and send User's input'''
    def __init__(self, driver):
        '''Create object and link to server'''
        self.__driver = driver
        
    """ LOG IN HELPER FUNCTIONS"""

    def email(self, email):
        '''Find email box and type in email'''
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        
        # Locate email input fields and fill in test email
        emailInput = self.__driver.find_element(By.XPATH, "//input[@type='email']")
        emailInput.clear()
        # emailInput.send_keys(Keys.CONTROL, 'a')
        # emailInput.send_keys(Keys.DELETE)
        emailInput.send_keys(email)

    def password(self, password):
        '''Find password box and type in password'''
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        
        # Locate password input fields and fill in test password
        passwordInput = self.__driver.find_element(By.XPATH, "//input[@type='password']")
        passwordInput.clear()
        # passwordInput.send_keys(Keys.CONTROL, 'a')
        # passwordInput.send_keys(Keys.DELETE)
        passwordInput.send_keys(password)
        
    def fill_username(self, username):
        '''Find Name Field and type in userName'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "userName")))
        # Locate name input fields and fill in user name
        username_field = self.__driver.find_element(By.NAME, "userName")
        # username_field.clear()
        username_field.send_keys(Keys.CONTROL, 'a')
        username_field.send_keys(Keys.DELETE)
        username_field.send_keys(username)

    def fill_email(self, email):
        '''Find Email Field and type in email'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))
        # Locate email input fields and fill in test email
        email_field = self.__driver.find_element(By.NAME, "email")
        email_field.send_keys(Keys.CONTROL, 'a')
        email_field.send_keys(Keys.DELETE)
        # email_field.clear()
        email_field.send_keys(email)

    def fill_password(self, password):
        '''Find Password Field and type in password'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "password")))
        # Locate password input fields and fill in password
        password_field = self.__driver.find_element(By.NAME, "password")
        # password_field.clear()
        password_field.send_keys(Keys.CONTROL, 'a')
        password_field.send_keys(Keys.DELETE)
        password_field.send_keys(password)

    def fill_confirm_password(self, confirmPassword):
        '''Find Password Field and type in confirmPassword'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "confirmPassword")))
        # Locate confirm password input fields and fill in password
        confirm_password_field = self.__driver.find_element(By.NAME, "confirmPassword")
        # confirm_password_field.clear()
        confirm_password_field.send_keys(Keys.CONTROL, 'a')
        confirm_password_field.send_keys(Keys.DELETE)
        confirm_password_field.send_keys(confirmPassword)

class Click:
    '''include all clickable button in OFS'''
    def __init__(self, driver):
        '''Create object and link to server'''
        self.__driver = driver
        
    def click_button(self, xpath):
        '''Find and click button by XPath'''
        WebDriverWait(self.__driver, 5).until(
            EC.element_to_be_clickable((By.XPATH, xpath))
        ).click()

    def start_now(self):
        '''Find and click Start Now button'''
        self.click_button("//*[contains(text(), 'Start Now')]")

    def sign_in(self):
        '''Find and click Sign In button'''
        self.click_button("//*[contains(text(), 'Sign In')]")

    def continue_(self):
        '''Find and click Continue button'''
        self.click_button("//*[contains(text(), 'Continue')]")

    def ok(self):
        '''Find and click OK button'''
        self.click_button("//*[contains(text(), 'OK')]")

    def submit(self):
        '''Find and click Submit button'''
        self.click_button("//*[contains(text(), 'Submit')]")

    def sign_up(self):
        '''Find and click link to Sign Up Page'''
        self.click_button("//*[contains(text(), 'Create Account')]")

    def go_to_cart(self):
        '''Find and click Cart'''
        self.click_button("//button[contains(text(),'Cart')]")

    def check_out(self):
        '''Find and click Cart'''
        self.click_button("//button[contains(text(),'Checkout')]")

    def add_quantity(self, amount):
        '''Add amount of item'''
        increase_button = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div/div[3]/div[2]/div/div/div/div[2]/div/div/div[1]"))
        )
        for _ in range(amount):
            increase_button.click()

    def add_to_cart(self):
        '''Find and click Add To Cart'''
        self.click_button("//button[contains(text(),'Add To Cart')]")
        
        
if __name__ == '__main__':
    OFS = Tester()
    OFS.testRun()