from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import  WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

class Click:
    '''include all clickable button in OFS'''
    def __init__(self, driver):
        '''Create object and link to server'''
        # service = Service(executable_path="./chromedriver.exe")
        self.__driver = driver
        
        # time.sleep(5)
        # self.__driver.quit()
        

        
    def StartNow(self):
        '''Find and click Start Now button'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Start Now')]"))
        )
        startButton = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Start Now')]")
        startButton.click()

    def SignIn(self):
        '''Find and click Sign In button'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Sign In')]"))
        )
        signInButton = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Sign In')]")
        signInButton.click()
    
    def clickContinue(self):
        '''Find and click Continue button'''
        # Wait for page elements to load
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Continue')]"))
        )
        # Find and click Continue
        continueButton = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Continue')]")
        continueButton.click()
    
    def Cont(self):
        '''Find and click Continue button'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Continue')]"))
        )
        continueButton = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Continue')]")
        
        # continueButton = WebDriverWait(self.__driver, 10).until(
        #     EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Continue')]"))
        # )
        
        continueButton.click()

    def OK(self):
        '''Find and click OK button'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'OK')]"))
        )
        confirmButton = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'OK')]")
        confirmButton.click()

    def Submit(self):
        '''Find and click Submit button'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Submit')]"))
        )
        submit = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Submit')]")
        submit.click()
    
    def clickSignUp(self):
        '''Find and click link to Sign Up Page'''
        WebDriverWait(self.__driver, 5).until(
            EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Create Account')]"))
        )
        signUp = self.__driver.find_element(By.XPATH, "//*[contains(text(), 'Create Account')]")
        signUp.click()
    
    def goToCart(self):
        '''Find and click Cart'''
        cart_button = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Cart')]"))
        )
        cart_button.click()
        
    def checkOut(self):
        '''Find and click Cart'''
        checkOut_button = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Checkout')]"))
        )
        checkOut_button.click()
        
    def addQuantity(self, amount):
        '''Add amount of item'''
        increaseButton = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//*[@id=\"root\"]/div/div[3]/div[2]/div/div/div/div[2]/div/div/div[1]"))
        )
        for i in range(amount):
            increaseButton.click()

    def addToCart(self):
        '''Find and click Add To Cart'''
        addButton = WebDriverWait(self.__driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Add To Cart')]"))
        )
        addButton.click()  
    
