const Message = {
    // *****************Console Messages*******************
  
    DB_CONNECTION_SUCCESSFUL: "Connected to MongoDB successfully",
    DB_CONNECTION_FAILED: "MongoBD connection failed ",
    USER_SIGNUP_SUCCESS: "User Registered successfully",
    AUTH_SUCCESS: "Authentication Successful",
    USER_NOT_FOUND:"User not found!",
    USER_EMAIL_EXIST: "This useremail is already exist",
    USEREMAIL_NOT_FOUND: "Useremail not found",
    PASSWORD_INVALID: "Password is Invalid",
    TOKEN_NOT_FOUND: "Token not found!",
    INVALID_TOKEN: "Invalid token",
    USER_FETCH_SUCCESS: "Users fetch Successfully",
    UNABLE_FETCH_USERS:"Unable to fetch users",
    ACCOUNT_BLOCK:"Your Account block temporary, Please contact administrator",
    TOKEN_MISSING: "Token is missing",
    TOKEN_NOT_ALLOW: `Forbidden - You don't have enough permission to access this resource`,
    TOKEN_EXPIRE: `Either the token is tampered or the session has been expired`,
    
    SOMETHING_WENT_WRONG: "Something went wrong. Please try again.",

    AGENCY_ALREADY_EXIST:"Agency already exists in system",
    AGENCY_CREATED:"Agency created.",
    AGENCY_CLIENTS_CREATED:"Agency & Client created.",
    CLIENT_UPDATED:"Client updated",
    CLIENT_FETCHED:"Client fetched",
    CLIENT_NOT_UPDATED:"Client not updated",
    CLIENT_NOT_FOUND:"Client not found",

    ROLE: 'User',

    //JOI VALIDATION
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_FORMAT_NOT_VALID: 'Email format is invalid',
    FIRSTNAME_REQUIRED: 'FirstName is required',
    LASTNAME_REQUIRED: 'LastName is required',
    PASSWORD_REQUIRED: 'Passord is required',
    ADDRESS_1_REQUIRED:"Address 1 required",
    PHONE_NUMBER_REQUIRED:"Phonenumber is required",
    TOTAL_BILL_REQUIRED:"Total bill is required",
    CLIENT_NAME_REQUIRED:"Client name is required"
  };
  
  export default Message;