import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Genius Society Hotel</h3>
            <p className="text-gray-400 mb-4">
              Experience luxury and comfort at its finest. Your perfect getaway awaits.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">GSH</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/rooms" className="text-gray-400 hover:text-white transition-colors">
                  Rooms & Suites
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="text-gray-400 hover:text-white transition-colors">
                  Facilities
                </Link>
              </li>
              <li>
                <Link to="/my-bookings" className="text-gray-400 hover:text-white transition-colors">
                  Bookings
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>24/7 Room Service</li>
              <li>Spa & Wellness</li>
              <li>Business Center</li>
              <li>Concierge Service</li>
              <li>Airport Transfer</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-2 text-gray-400">
              <p className="flex items-center">
                <span className="font-medium text-white mr-2">Phone:</span>
                +1 (555) 123-4567
              </p>
              <p className="flex items-center">
                <span className="font-medium text-white mr-2">Email:</span>
                info@geniussocietyhotel.com
              </p>
              <p className="flex items-center">
                <span className="font-medium text-white mr-2">Address:</span>
                123 Luxury Ave, Paradise City
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Genius Society Hotel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
