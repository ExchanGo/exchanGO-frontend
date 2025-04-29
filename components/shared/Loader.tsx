"use client";
import "../../styles/spinner.css";

function Loader() {
  return (
    <div className="fixed flex place-content-center inset-0 z-50">
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="flex flex-col place-content-center">
        <div className="loader"></div>
        <p className="text-white text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default Loader;
