import { Navbar } from "@/components/searchResults/Navbar";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      {/* Removed the overflow-hidden which was preventing proper scroll behavior */}
      <Navbar />
      {children}
    </div>
  );
}
