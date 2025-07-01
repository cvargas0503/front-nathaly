export default function LoadingComponent() {
    return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <div className="relative flex flex-col items-center">
                    {/* Creative loader: Spinning colorful rings with a bouncing lock */}
                    <div className="relative mb-6">
                      <div className="w-24 h-24 rounded-full border-8 border-t-[#2C3E50] border-b-[#3498DB] border-l-[#E67E22] border-r-[#9B59B6] animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          className="animate-bounce"
                          width="40"
                          height="40"
                          viewBox="0 0 24 24"
                          fill="#2C3E50"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect x="6" y="10" width="12" height="8" rx="2" fill="#2C3E50" />
                          <rect x="9" y="6" width="6" height="6" rx="3" fill="#3498DB" />
                          <circle cx="12" cy="15" r="1.5" fill="#fff" />
                        </svg>
                      </div>
                    </div>
                    <span className="text-xl font-bold text-white drop-shadow-lg animate-pulse">
                      Autenticando...
                    </span>
                  </div>
                </div>
    )
}