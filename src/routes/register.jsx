import RegisterForm from "../components/registerForm";

export default function Register() {
  return (
    <main
      className="w-100 bg-dark d-flex justify-content-center align-items-center top-0 position-absolute"
      style={{ minHeight: "100vh", zIndex: "1030" }}
    >
      <RegisterForm />
    </main>
  );
}
