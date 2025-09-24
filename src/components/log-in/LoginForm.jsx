import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import useForm from "../../hooks/useForm";
import useLoading from "../../hooks/useLoading";
import {
  initialLoginFormData,
  LogInFormControls,
} from "../../config/formCongif";
import FormControl from "../common-Input/FormControl";
import { loginUser } from "../../features/user/userApi";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../helper/LoadingSpinner";
import { getUserAction } from "../../features/user/userAction";
import { GoogleLogin } from "@react-oauth/google";
const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const handleOnClickSignInWithGoogle = () => {
    window.location.href = "http://localhost:8001/api/v1/auth/google";
  };

  // const params = new URLSearchParams(location.search);
  const redirectPath = location?.search.replace("?redirect=", "") || "/";
  console.log(redirectPath);

  //useform from custom hook
  const { formData, handleOnChange, setFormData } =
    useForm(initialLoginFormData);

  //loading from custom hook
  const { isLoading, startLoading, stopLoading } = useLoading();

  //state
  const [showPassword, setShowPassword] = useState(false);

  // function handle form submit
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    startLoading();

    try {
      //api call

      const response = await loginUser(formData);
      console.log("Login response:", response);

      //destructure response
      const { payload, message, status } = response;

      // Check if the response is successful
      if (status !== "success" || !payload) {
        toast.error(message || "Invalid response from server.");
        return;
      }

      // Destructure accessJWT and refreshJWT from payload
      const { accessJWT, refreshJWT } = payload;

      // Store tokens
      sessionStorage.setItem("accessJWT", accessJWT);
      localStorage.setItem("refreshJWT", refreshJWT);

      // Dispatch user fetch
      dispatch(getUserAction());

      toast.success(response?.message || "Login successful!");
      setFormData(initialLoginFormData);

      // Go to intended page
      navigate(redirectPath);
    } catch (error) {
      console.error("Login failed.", error);
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="flex flex-col justify-center px-10 md:px-20">
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div>
          <h2 className="text-2xl font-bold text-white">Welcome back!</h2>
          <p className="text-sm  text-white">
            Enter your Credentials to access your account
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleOnSubmit} className="space-y-4" autoComplete="on">
          {LogInFormControls.map((field, index) => (
            <div key={index}>
              {field.name === "password" ? (
                <div className="relative">
                  <Label htmlFor={field.name} className="text-white">
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleOnChange}
                      placeholder={field.placeholder}
                      required
                      id={field.name}
                      className="bg-white dark:text-white block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-600 focus-visible:z-10 sm:text-sm/6"
                      autoComplete="current-password"
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3 bg-transparent cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-200" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-200" />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <FormControl
                  label={field.label}
                  handleOnChange={handleOnChange}
                  inputAttributes={{
                    type: field.type,
                    name: field.name,
                    value: formData[field.name],
                    placeholder: field.placeholder,
                    autoComplete: field.autoComplete,
                    required: true,
                    id: field.name,
                  }}
                />
              )}
            </div>
          ))}

          {/* Login button */}
          <div className="mt-6">
            <Button
              type="submit"
              className="w-full bg-green-800 hover:bg-green-900"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Login"}
            </Button>
          </div>
        </form>

        {/* Forgot password */}
        <p className="mt-8 text-center text-sm text-white">
          Forgot password?
          <a
            href="/forgot-password"
            className="ml-1 text-sm text-blue-300 hover:underline"
          >
            Click here
          </a>
        </p>
        {/* Divider */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
          <span className="h-px bg-border flex-1" />
          <span>Or</span>
          <span className="h-px bg-border flex-1" />
        </div>
        {/* Social Login Buttons start here */}

        <div className="flex  items-center justify-center space-x-5">
          <Button
            onClick={handleOnClickSignInWithGoogle}
            // onClick={handleOnClickSignInWithGoogle}
            variant="outline"
            className="w-50 flex items-center gap-2"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </Button>
          <Button variant="outline" className="w-50 flex items-center gap-2">
            <FaApple className="text-xl" />
            Sign in with Apple
          </Button>
        </div>
        {/* Sign up link */}
        <p className="text-center text-sm text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
