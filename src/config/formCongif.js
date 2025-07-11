//This is for login
export const LogInFormControls = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    autoComplete: "email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter  your password",
    autComplete: "current-password",
  },
];

//Initial forgot password form
export const initialForgotPasswordFormData = {
  email: "",
};

//This is for forgot password
export const ForgotPasswordFormControls = [
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    autoComplete: "email",
  },
];
//This is for reset password
export const ResetPasswordFormControls = [
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
    placeholder: "Enter your new password",
    autoComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your new password",
    autoComplete: "new-password",
  },
];
//Initial reset password form data
export const initialresetPasswordFormData = {
  newPassword: "",
  confirmPassword: "",
};
//initial login form
export const initialLoginFormData = {
  email: "",
  password: "",
};

export const SignupFormControls = [
  {
    name: "fName",
    label: "First Name",
    type: "text",
    placeholder: "Enter  your First Name",
    autoComplete: "given-name",
  },
  {
    name: "lName",
    label: "Last Name",
    type: "text",
    placeholder: "Enter  your Last Name",
    autoComplete: "family-name",
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter  your email address",
    autoComplete: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    type: "tel",
    placeholder: "Enter  your phone number",
    autoComplete: "tel",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter  your password",
    autComplete: "new-password",
  },
  {
    name: "confirmPassword",
    label: "ConfirmPassword",
    type: "password",
    placeholder: "Confirm  your password",
    autComplete: "new-password",
  },
];

//initial login form
export const initialSignupFormData = {
  fName: "",
  lName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
};
