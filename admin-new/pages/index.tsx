import { useState, useEffect } from "react";
import AuthForm from "@/components/AuthForm";
import BackgroundElements from "@/components/BackgroundElements";
import Logo3D from "@/components/Logo3D";
const Index = () => {
  const [mounted, setMounted] = useState(false);

  // This ensures that animations trigger after the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const opacityClass = mounted ? "opacity-100" : "opacity-0";
  const translateClass = mounted ? "translate-y-0" : "translate-y-4";

  return (
    <div className="min-h-screen w-full flex flex-col">
      {" "}
      <BackgroundElements />
      <header className="flex justify-around items-center py-8">
        <div
          className={`transition-all duration-700 ease-out ${opacityClass} ${translateClass} delay-100`}
        >
          <div className="animate-spin-slow">
            <Logo3D />
          </div>
        </div>

        <nav
          className={`transition-all duration-700 ease-out ${opacityClass} ${translateClass} delay-200`}
        >
          <ul className="flex space-x-6">
            <li>
              <a
                href="#features"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#about"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main className="flex-1 flex flex-col md:flex-row items-center justify-center md:justify-around py-12 md:py-24">
        {/* Hero Content */}
        <div className="w-full md:w-1/2 mb-12 md:mb-0 md:pr-8">
          <div
            className={`space-y-6 transition-all duration-700 ease-out ${opacityClass} ${translateClass} delay-300`}
          >
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Powerful Admin Dashboard for{" "}
              <span className="text-gradient">Seamless Management</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-md">
              Unlock the full potential of your application with our intuitive
              admin interface.
            </p>
            <ul className="space-y-2">
              {[
                "Real-time data visualization",
                "User management & permissions",
                "Advanced analytics & reporting",
                "Customizable dashboard widgets",
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center text-gray-300"
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full bg-blue-500/20 text-blue-400">
                    ✓
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Auth Form */}
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out ${opacityClass} ${translateClass} delay-[700ms]`}
        >
          <AuthForm />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">
        <p
          className={`transition-all duration-700 ease-out ${opacityClass} ${translateClass} delay-[800ms]`}
        >
          © {new Date().getFullYear()} Admin Panel. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Index;
