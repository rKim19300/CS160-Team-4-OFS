from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import  WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

PAUSE_TIME = 2
testCounter = 0

from clickable import Click

class Tester:
    '''Include all test cases for OFS website using Selenium'''
    def __init__(self) -> None:
        self._URL = "http://localhost:3000"
        self._service = Service(executable_path="./chromedriver.exe")
        self._driver = webdriver.Chrome(service=self._service)
        self._click = Click(self._driver)
        self._fill = Fill_In(self._driver)
        
    def testRun(self):
        '''All Pages Test Cases'''
        # Landing
        self._driver.get(self._URL)
        
        # Log In Page
        self._click.SignIn()
        self.pause()
        
        # self._fill.Email("admin@admin.com")
        # self._fill.Password("admin")
        self.pause()
        # self._click.Cont()
        self._click.clickSignUp()
        self._fill.fillEmail("test@test.com")
        self._fill.fillPassword("P@$$w0rd")
        # self._click.StartNow()
        # self._click.Submit()
        self._driver.quit()
        
    def pause(self):
        time.sleep(PAUSE_TIME)

class Fill_In:
    '''Find all field and send User's input'''
    def __init__(self, driver):
        '''Create object and link to server'''
        self.__driver = driver
        
    """ LOG IN HELPER FUNCTIONS"""

    def Email(self, email):
        '''Find email box and type in email'''
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='email']")))
        
        # Locate email input fields and fill in test email
        emailInput = self.__driver.find_element(By.XPATH, "//input[@type='email']")
        emailInput.clear()
        # emailInput.send_keys(Keys.CONTROL, 'a')
        # emailInput.send_keys(Keys.DELETE)
        emailInput.send_keys(email)

    def Password(self, password):
        '''Find password box and type in password'''
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.XPATH, "//input[@type='password']")))
        
        # Locate password input fields and fill in test password
        passwordInput = self.__driver.find_element(By.XPATH, "//input[@type='password']")
        passwordInput.clear()
        # passwordInput.send_keys(Keys.CONTROL, 'a')
        # passwordInput.send_keys(Keys.DELETE)
        passwordInput.send_keys(password)
        
    def fillUsername(self, username):
        '''Find Name Field and type in userName'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "userName")))
        # Locate name input fields and fill in user name
        username_field = self.__driver.find_element(By.NAME, "userName")
        # username_field.clear()
        username_field.send_keys(Keys.CONTROL, 'a')
        username_field.send_keys(Keys.DELETE)
        username_field.send_keys(username)

    def fillEmail(self, email):
        '''Find Email Field and type in email'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "email")))
        # Locate email input fields and fill in test email
        email_field = self.__driver.find_element(By.NAME, "email")
        email_field.send_keys(Keys.CONTROL, 'a')
        email_field.send_keys(Keys.DELETE)
        # email_field.clear()
        email_field.send_keys(email)

    def fillPassword(self, password):
        '''Find Password Field and type in password'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "password")))
        # Locate password input fields and fill in password
        password_field = self.__driver.find_element(By.NAME, "password")
        # password_field.clear()
        password_field.send_keys(Keys.CONTROL, 'a')
        password_field.send_keys(Keys.DELETE)
        password_field.send_keys(password)

    def fillConfirmPassword(self, confirmPassword):
        '''Find Password Field and type in confirmPassword'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 10).until(EC.presence_of_element_located((By.NAME, "confirmPassword")))
        # Locate confirm password input fields and fill in password
        confirm_password_field = self.__driver.find_element(By.NAME, "confirmPassword")
        # confirm_password_field.clear()
        confirm_password_field.send_keys(Keys.CONTROL, 'a')
        confirm_password_field.send_keys(Keys.DELETE)
        confirm_password_field.send_keys(confirmPassword)
        
if __name__ == '__main__':
    OFS = Tester()
    OFS.testRun()