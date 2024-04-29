# CS160-Team-4-OFS

This is an online food delivery service website where users can shop online (browse through items, add to cart, place orders, etc) and simulate having their orders delivered to them by autonomous delivery robots.

## User Guide

### Installation

1. Clone this repository onto your local machine with the following command

    ```sh
    git clone https://github.com/rKim19300/CS160-Team-4-OFS.git
    ```

2. `cd` into the project directory

    ```sh
    cd CS160-Team-4-OFS
    ```

3. Open the `.env_example` file in the project root directory and follow what the comments inside the file say. Below is the contents of `.env_example` for reference

    <details>

    <summary>.env_example</summary>

    ```sh
    GOOGLE_API_KEY_BACKEND=API_KEY_HERE

    # Rename this file from ".env_example" to ".env"
    # replace API_KEY_HERE with your Google Maps API key 
    # IMPORTANT: NEVER PUSH THE .env FILE TO GITHUB
    ```

    </details>

4. Build and run the application with the command below (if you don't have Docker, you can install it [here](https://www.docker.com/get-started/))

    ```sh
    docker compose up --build
    ```

    > The first time you build the application, it will take some time to get everything up and running. This is normal

5. Open `http://localhost:3000` in your browser

### User Types

There are 3 types of users: `Managers`, `Employees`, `Customers`

**Some features on this website can only be used depending on the type of user you are logged in as.** Users with the `manager` user type can access and use everything.

Below are the credentials for the two `manager` accounts (doesn't matter which one you use)

* email: `admin@admin.com`, password: `admin`
* email: `johndoe@gmail.com`, password: `password`

> When you create an account through the signup page, you are making a `customer` account. Only `managers` can create `employee` accounts through their private dashboard
