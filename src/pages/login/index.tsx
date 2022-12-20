import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { requestLogin } from "../../services";
import { useUserStore } from "../../store/user";

const Login = () => {
  const { register, handleSubmit, formState } = useForm<{
    email: string;
    password: string;
  }>({
    mode: "onChange",
  });

  const setUser = useUserStore((state) => state.setUser);
  const navigate = useNavigate();

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await requestLogin(data);
    if (res.status !== 200) return alert("Login failed");
    setUser(res.data);
    localStorage.setItem("token", res.data.access_token);
    navigate("/chat", { replace: true });
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-full h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-gray-700 rounded-lg shadow-lg px-10 py-6">
          <h1 className="text-3xl font-bold mb-5 text-center text-pink-300">
            Login
          </h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block mb-2 text-sm font-bold text-gray-100 before:content-['*'] before:mr-0.5 before:text-red-500">
                Email:
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {formState.errors.email && (
                <p className="text-red-500 text-xs italic ml-1 mt-1">
                  {formState.errors.email.message?.toString() || null}
                </p>
              )}
              <label className="block mb-2 text-sm font-bold text-gray-100 mt-4 before:content-['*'] before:mr-0.5 before:text-red-500">
                Password:
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must have at least 6 characters",
                  },
                })}
              />
              {formState.errors.password && (
                <p className="text-red-500 text-xs italic ml-1 mt-1">
                  {formState.errors.password.message?.toString() || null}
                </p>
              )}
              <div className="flex justify-between mt-2">
                <Link
                  className="text-sm text-yellow-300 hover:text-blue-700"
                  to={"/register"}
                >
                  Sign Up
                </Link>
                <a
                  className="text-sm text-yellow-300 hover:text-blue-700"
                  href="#"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="mt-5 text-center">
                <button
                  className="bg-gradient-to-l from-pink-500 via-red-500 to-yellow-500 hover:opacity-80 text-white font-bold py-2 px-16 rounded-lg disabled:opacity-50"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
