import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <SignUp 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-gray-900 text-white",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "text-white",
            formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
            footerActionLink: "text-blue-400 hover:text-blue-300"
          }
        }}
      />
    </div>
  );
} 