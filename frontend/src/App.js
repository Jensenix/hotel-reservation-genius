import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/room-types');
      setRoomTypes(response.data.data);
    } catch (error) {
      console.error('Error fetching room types:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">Genius Society Hotel</h1>
        <p className="text-blue-100">Hotel Management System</p>
      </header>

      <main className="container mx-auto p-6">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Room Types</h2>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading room types...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((roomType) => (
                <div key={roomType.id} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{roomType.name}</h3>
                  <p className="text-gray-600 mb-4">{roomType.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      ${roomType.basePrice}/night
                    </span>
                    <span className="text-sm text-gray-500">
                      Max: {roomType.maxCapacity} guests
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
