import { useForm } from "react-hook-form";
import FieldError from "../../components/FieldError";
import { requestRegister } from "../../services";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { register, handleSubmit, formState, getValues } = useForm<FormValues>({
    mode: "onSubmit",
  });

  const onSubmit = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    const res = await requestRegister(values);
  };

  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-full h-screen">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-white rounded-lg shadow-lg px-10 py-6">
          <h1 className="text-3xl font-bold mb-5 text-center">Register</h1>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="block mb-2 text-sm font-bold text-gray-700 before:content-['*'] before:mr-0.5 before:text-red-500">
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
                <FieldError error={formState.errors.email.message as string} />
              )}
              <label className="block mb-2 text-sm font-bold text-gray-700 mt-4 before:content-['*'] before:mr-0.5 before:text-red-500">
                Full Name:
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="text"
                placeholder="Full Name"
                {...register("name", {
                  required: "Full Name is required",
                })}
              />
              {formState.errors.name && (
                <FieldError error={formState.errors.name.message as string} />
              )}
              <label className="block mb-2 text-sm font-bold text-gray-700 mt-4 before:content-['*'] before:mr-0.5 before:text-red-500">
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
                <FieldError
                  error={formState.errors.password.message as string}
                />
              )}
              <label className="block mb-2 text-sm font-bold text-gray-700 mt-4 before:content-['*'] before:mr-0.5 before:text-red-500">
                Confirm Password:
              </label>
              <input
                className="border border-gray-400 p-2 w-full"
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  minLength: {
                    value: 6,

                    message: "Confirm Password must have at least 6 characters",
                  },
                  validate: (value) => {
                    if (value !== getValues("password")) {
                      return "Confirm Password does not match";
                    }
                  },
                })}
              />
              {formState.errors.confirmPassword && (
                <FieldError
                  error={formState.errors.confirmPassword.message as string}
                />
              )}
              <div className="mt-5 text-center">
                <button
                  className="bg-pink-500 hover:opacity-80 text-white font-bold py-2 px-16 rounded-lg disabled:opacity-50"
                  type="submit"
                  disabled={!formState.isValid}
                >
                  Register
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
