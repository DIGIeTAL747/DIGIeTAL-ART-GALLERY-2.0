import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- MOCK DATA ---
const mockArtworks = [
  {
    id: '1',
    title: 'Solitude',
    artist: 'Gigi Yulo-Villamor',
    description: 'Watercolor 10in x 15in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/ycoy2jW.jpeg',
  },
  {
    id: '2',
    title: 'Sinadya',
    artist: 'Gigi Yulo-Villamor',
    description: 'Acrylic; 18in x 20in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/kwUduxc.jpeg',
  },
  {
    id: '3',
    title: 'Crazy Y Ranch',
    artist: 'Gigi Yulo-Villamor',
    description: 'Gouache',
    price: '5000',
    imageUrl: 'https://i.imgur.com/ipoGrcZ.jpeg',
  },
    {
    id: '4',
    title: 'Gilded Night',
    artist: 'Gigi Yulo-Villamor',
    description: 'Acrylic 16in x 20in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/YfPhQp1.jpeg',
  },
  {
    id: '5',
    title: 'Inasal',
    artist: 'Gigi Yulo-Villamor',
    description: 'acrylic on chopping board',
    price: '5000',
    imageUrl: 'https://i.imgur.com/GKHyZwH.jpeg',
  },
  {
    id: '6',
    title: 'Teresita',
    artist: 'Gigi Yulo-Villamor',
    description: 'Acrylic 18in x 24in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/Tvf2KAt.jpeg',
  },
{
    id: '7',
    title: 'Sunset at PeacePond',
    artist: 'Gigi Yulo-Villamor',
    description: 'Acrylic 14in x 16in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/t6ZfoEz.jpeg',
  },
  {
    id: '8',
    title: 'Sapphire Bird',
    artist: 'Gigi Yulo-Villamor',
    description: 'Colored pencils on kraft',
    price: '5000',
    imageUrl: 'https://i.imgur.com/XQ2WIN8.jpeg',
  },
{
    id: '9',
    title: 'Still Life Floral',
    artist: 'Gigi Yulo-Villamor',
    description: '9in x 5in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/XX976gx.jpeg',
  },

  {
    id: '10',
    title: 'Tree Series #3',
    artist: 'Gigi Yulo-Villamor',
    description: '14in x 9in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/VcL8Yrs.jpeg',
  },
{
    id: '11',
    title: 'Violet',
    artist: 'Gigi Yulo-Villamor',
    description: '9in x 12in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/XAu3oM5.jpeg',
  },
  {
    id: '12',
    title: 'Saffron Whispers',
    artist: 'Gigi Yulo-Villamor',
    description: 'Acrylic 18in x 24in',
    price: '5000',
    imageUrl: 'https://i.imgur.com/ipoGrcZ.jpeg',
  }
];

// --- COMPONENTS ---

const ArtworkList = ({ artworks, onSelectArtwork }) => {
  return (
    <div>
      <h2>Current Exhibition</h2>
      <div className="artwork-list">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="artwork-card" onClick={() => onSelectArtwork(artwork)} role="button" tabIndex={0} onKeyPress={(e) => e.key === 'Enter' && onSelectArtwork(artwork)}>
            <img src={artwork.imageUrl} alt={artwork.title} />
            <div className="artwork-card-info">
                <h3>{artwork.title}</h3>
                <p className="artist">by {artwork.artist}</p>
                <p className="price">${parseInt(artwork.price).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ArtworkDetail = ({ artwork, onPlaceOrder, onBack }) => {
  return (
    <div className="artwork-detail">
      <button onClick={onBack} className="back-button">&larr; Back to Gallery</button>
      <img src={artwork.imageUrl} alt={artwork.title} />
      <h2>{artwork.title}</h2>
      <p className="artist">by {artwork.artist}</p>
      <p className="description">{artwork.description}</p>
      <p className="price">${parseInt(artwork.price).toLocaleString()}</p>
      <button onClick={onPlaceOrder}>Order This Artwork</button>
    </div>
  );
};

const OrderForm = ({ artwork, onSubmitOrder, onBack }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) {
      alert("Please fill out all fields.");
      return;
    }
    onSubmitOrder({
      customerName,
      customerEmail,
      shippingAddress,
    });
  };

  return (
    <div className="form-container">
      <button onClick={onBack} className="back-button">&larr; Back to Artwork</button>
      <h2>Order: {artwork.title}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="customerName">Your Name:</label>
        <input id="customerName" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        
        <label htmlFor="customerEmail">Your Email:</label>
        <input id="customerEmail" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />

        <label htmlFor="shippingAddress">Shipping Address:</label>
        <textarea id="shippingAddress" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
        
        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
};

const OrderConfirmation = ({ onBackToHome }) => {
  return (
    <div className="confirmation-container">
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase! We will send a confirmation and shipping details to your email shortly.</p>
      <button onClick={onBackToHome}>Return to Gallery</button>
    </div>
  );
};

function App() {
  const [artworks, setArtworks] = useState([]);
  const [selectedArtwork,  setSelectedArtwork] = useState(null);
  const [currentView, setCurrentView] = useState('artworkList');
  const [loading, setLoading] = useState(true);

  // Simulate fetching data
  useEffect(() => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      setArtworks(mockArtworks);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSelectArtwork = (artwork) => {
    setSelectedArtwork(artwork);
    setCurrentView('artworkDetail');
  };

  const handleBackToList = () => {
      setSelectedArtwork(null);
      setCurrentView('artworkList');
  }
  
  const handleBackToDetail = () => {
      setCurrentView('artworkDetail');
  }

  const handlePlaceOrderClick = () => {
    setCurrentView('orderForm');
  };
  
  const handleBackToHome = () => {
      setSelectedArtwork(null);
      setCurrentView('artworkList');
  }

  const handleSubmitOrder = (orderDetails) => {
    console.log('Order Submitted:', {
        ...orderDetails,
        artworkId: selectedArtwork.id,
        artworkTitle: selectedArtwork.title,
        orderDate: new Date(),
    });
    setCurrentView('orderConfirmation');
  };

  if (loading) {
    return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'artworkList':
        return <ArtworkList artworks={artworks} onSelectArtwork={handleSelectArtwork} />;
      case 'artworkDetail':
        return <ArtworkDetail artwork={selectedArtwork} onPlaceOrder={handlePlaceOrderClick} onBack={handleBackToList} />;
      case 'orderForm':
        return <OrderForm artwork={selectedArtwork} onSubmitOrder={handleSubmitOrder} onBack={handleBackToDetail} />;
      case 'orderConfirmation':
        return <OrderConfirmation onBackToHome={handleBackToHome} />;
      default:
        return <ArtworkList artworks={artworks} onSelectArtwork={handleSelectArtwork} />;
    }
  }

  return (
    <>
      <header className="main-header">
        <h1>DIGIeTAL ART GALLERY</h1>
      </header>
      <main>
        {renderView()}
      </main>
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
