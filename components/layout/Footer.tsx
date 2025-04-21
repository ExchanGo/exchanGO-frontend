import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-exchango-green-bold text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ExchangGo24</h3>
            <p className="text-sm text-gray-300">
              Real-time currency exchange rate comparison platform with bidding system for exchange offices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/exchange-rates" className="text-sm text-gray-300 hover:text-white">
                  Exchange Rates
                </Link>
              </li>
              <li>
                <Link href="/exchange-offices" className="text-sm text-gray-300 hover:text-white">
                  Exchange Offices
                </Link>
              </li>
              <li>
                <Link href="/alerts" className="text-sm text-gray-300 hover:text-white">
                  Rate Alerts
                </Link>
              </li>
              <li>
                <Link href="/post-request" className="text-sm text-gray-300 hover:text-white">
                  Post Exchange Request
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Features</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">Real-time Rate Comparison</li>
              <li className="text-sm text-gray-300">WhatsApp Alerts</li>
              <li className="text-sm text-gray-300">Interactive Filtering</li>
              <li className="text-sm text-gray-300">Bidding System</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-300 hover:text-white">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-gray-300 hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} ExchangGo24. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-sm text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-300 hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 