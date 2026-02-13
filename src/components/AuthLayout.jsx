const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen bg-bg-dark flex flex-col overflow-hidden">
      {/* Main card */}
      <div className="flex-1 flex">
        <div className="w-full bg-bg-card overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            {/* Left - Gradient Hero */}
            <div className="relative md:w-[55%] overflow-hidden">
              {/* Gradient background */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #f5f0ff 0%, #c4b5fd 20%, #6366f1 50%, #3730a3 80%, #1e1b4b 100%)',
                }}
              />

              {/* Decorative circles */}
              <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/10" />
              <div className="absolute -bottom-16 left-1/3 w-56 h-56 rounded-full bg-white/10" />
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/20" />

              {/* Content */}
              <div className="relative z-10 p-8 md:p-12 flex flex-col justify-between h-full">
                {/* Logo */}
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl md:text-4xl font-bold text-[#2d5016]">lem</span>
                    <span className="text-3xl md:text-4xl">🍋</span>
                    <span className="text-3xl md:text-4xl font-bold text-[#d4c724]">pay</span>
                  </div>
                  <p className="text-accent-green text-sm mt-1 ml-1">Your success is our focus</p>
                </div>

                {/* Tagline */}
                <div className="mt-auto pb-8 md:pb-12">
                  <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
                    Join 1000<sup className="text-lg">+</sup> Businesses
                  </h2>
                  <h2 className="text-accent-yellow text-3xl md:text-4xl font-bold leading-tight">
                    Powering Growth with
                  </h2>
                  <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
                    Lemonpay!
                  </h2>
                </div>
              </div>
            </div>

            {/* Right - Form */}
            <div
              className="md:w-[45%] flex items-center justify-center p-8 md:p-12"
              style={{
                background: 'linear-gradient(180deg, #4338ca 0%, #1e1b4b 100%)',
              }}
            >
              <div className="w-full max-w-sm">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
