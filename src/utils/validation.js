const validator = require("validator");
const validateSignupData = (data) => {
  const { firstName, lastName, emailId, password } = data;
  if (!firstName) {
    throw new Error("Invalid First Name");
  } else if (!lastName) {
    throw new Error("Invalid Last Name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter the strong password");
  }
};

const validateUpdateData = (data) => {
  const AllowedEdit = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "about",
    "skills",
    "photoUrl",
  ];
  const isAllowed = Object.keys(data).every((key) => AllowedEdit.includes(key));
  if (!isAllowed) {
    throw new Error("Invalid Update request");
  }
};

module.exports = { validateSignupData, validateUpdateData };
