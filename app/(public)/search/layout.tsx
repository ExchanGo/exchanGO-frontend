import { Navbar } from "@/components/searchResults/Navbar";
import "mapbox-gl/dist/mapbox-gl.css";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden bg-white">
      <Navbar />
      <div className="w-full max-md:max-w-full">{children}</div>
    </div>
  );
}
