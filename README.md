# Swipe Frontend Task

This is a React application designed to manage invoices and products. It allows users to create, edit, and delete invoices while also managing product information dynamically. The project integrates real-time currency conversion using an external API and handles various edge cases with proper error handling.

## Deployed Link
Access the live version of the application [here](https://swipefrontendtask.netlify.app/).

## Features
1. **Products Tab**
    - Displays all associated products in a new 'Products' tab using Redux.
    - Allows users to modify product information, reflecting these changes in all associated invoices.

2. **Dynamic Product Information Update**
    - Edited product details reflect in both the 'Products' tab and all existing invoices where they're used.
    - New products added to an invoice with different values update their details in the products tab and all associated invoices.

3. **Validation for Changes in Products Tab**
    - Ensures all product modifications are validated before updating the Redux store to maintain state consistency.

4. **Currency Conversion Functionality**
    - Implements real-time currency conversion using [freecurrencyapi.com](https://app.freecurrencyapi.com/dashboard).
    - Automatically updates all numbers in all pages to the selected currency.

5. **Error Handling**
    - Properly handles errors during invoice creation and provides appropriate feedback to the user.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.

### Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/shivansh1507/Swipe-.git
    cd Swipe-
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory with your API key:
    ```env
    REACT_APP_API_KEY=your_actual_api_key_here
    ```

4. Run the application:
    ```sh
    npm start
    ```

### Deployment
The application is deployed using Netlify. The `.env` file is used to manage sensitive information securely.

### Build for Production
      To create an optimized production build:
      ```sh
      npm run build


    ### Environment Variables
    Ensure that your .env file is included in the .gitignore to keep it out of your version control:
    .env

### Usage
1. **Products Tab :**
Line 15-45 in ProductsTab.js: Implements the products tab, displaying all products and allowing modifications.

2. **Dynamic Product Information Update :**
Line 20-50 in InvoiceForm.js: Ensures updates to products are reflected in associated invoices by referencing product IDs.

3. **Validation for Changes in Products Tab :**
Line 22 in ProductsTab.js: Validates product details before updating the Redux store.

4. **Currency Conversion Functionality :**
Line 20-40 in currencyConversion.js: Implements real-time currency conversion using the API key.
Line 55-75 in InvoiceForm.js: Integrates currency conversion in the invoice form.

5. **Error Handling :**
Line 85-105 in InvoiceForm.js: Handles errors during invoice creation, providing feedback to the user.

###  Technologies Used
    React
    Redux
    React Bootstrap
    Axios
    Netlify for deployment
    Freecurrencyapi for providing the currency conversion API.
