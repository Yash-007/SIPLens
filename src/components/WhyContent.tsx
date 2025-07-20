import CreatorSection from "./CreatorSection";

const WhyContent = () => (
    <div className="space-y-4 text-gray-600">
      <section>
        <p className="text-lg leading-relaxed">
          SIPLens brings clarity and realism to your SIP investments. Most SIP calculators only show basic returns, don't consider inflation and tax, factors that can greatly impact actual gains. SIPLens gives you the complete picture.
        </p>
      </section>

      <div className="mt-6 p-4 bg-purple-50 rounded-xl">
        <p className="text-purple-800 font-medium">
          "The best investment you can make is in understanding your investments better."
        </p>
      </div>

      {/* Creator Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-center space-y-3">
            <CreatorSection />
        </div>
      </div>
    </div>
  );

  export default WhyContent;