import { incrementWhyModalOpenCount } from "../utils/firebase";

const Header =  ({setIsWhyModalOpen}:{setIsWhyModalOpen: (value: boolean) => void}) => {
    return (
        <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
          SIPLens
        </h1>
        <p className="text-2xl font-tagline text-gray-700 max-w-2xl mx-auto italic leading-relaxed mb-8">
          See your SIP through the lens of reality
        </p>
        
        {/* Decorative Divider */}
        <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
          <div className="w-2 h-2 rounded-full bg-purple-600"></div>
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1"></div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
          <button 
            onClick={() => {
              incrementWhyModalOpenCount();
              setIsWhyModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <span className="text-2xl group-hover:animate-bounce">❓</span>
            <span className="font-medium">Why SIPLens?</span>
          </button>
          
          <button 
            onClick={() => {
              window.open('https://github.com/Yash-007/SIPly', '_blank');
            }}
            className="flex items-center gap-2 px-6 py-2.5 text-gray-700 bg-white hover:bg-gray-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group"
          >
            <span className="text-2xl group-hover:animate-spin">⭐</span>
            <span className="font-medium">Star on GitHub</span>
          </button>
        </div>
      </div>
    )
}

export default Header;