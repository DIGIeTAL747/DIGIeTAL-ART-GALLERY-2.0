import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// --- MOCK DATA ---
const mockArtworks = [
  {
    id: '1',
    title: 'Aloe Vera',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/U35hBPZ.jpeg',
  },
  {
    id: '2',
    title: 'Courtyard',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/hzsqdnU.jpeg',
  },
  {
    id: '3',
    title: 'Bird’s Nest Fern',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/PZCMO07.jpeg',
  },
    {
    id: '4',
    title: 'Dead Trunk',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in',
    price: '500',
    imageUrl: 'https://i.imgur.com/ooMgBuu.jpeg',
  },
  {
    id: '5',
    title: 'Taro',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in',
    price: '500',
    imageUrl: 'https://i.imgur.com/EfyQ2OG.jpeg',
  },
  {
    id: '6',
    title: 'Mango',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/OCGZjoO.jpeg',
  },
{
    id: '7',
    title: 'Walis Tingting',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/IvFpyeG.jpeg',
  },
  {
    id: '8',
    title: 'Aloe Vera Pots',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/WDOxaza.jpeg',
  },
{
    id: '9',
    title: 'Gripo',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/Xm3DXQ3.jpeg',
  },

  {
    id: '10',
    title: 'Life Thru Cracks',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/aD9KH1z.jpeg',
  },
{
    id: '11',
    title: 'Jesse',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/5RZWhB3.jpeg',
  },
  {
    id: '12',
    title: 'Diony',
    artist: 'Diony Villamor Jr',
    description: '66 in. x 80 in.',
    price: '500',
    imageUrl: 'https://i.imgur.com/feRPvRt.jpeg',
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
  const [critique, setCritique] = useState('');
  const [isLoadingCritique, setIsLoadingCritique] = useState(false);
  const [error, setError] = useState('');

  const handleGetCritique = async () => {
    if (!process.env.API_KEY) {
      setError("API key is not set. Please configure it in your environment.");
      return;
    }

    setIsLoadingCritique(true);
    setError('');
    setCritique('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Fetch the image from the URL and convert it to a base64 string
      const imageResponse = await fetch(artwork.imageUrl);
      if (!imageResponse.ok) {
          throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      const blob = await imageResponse.blob();
      
      const base64data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });

      const imagePart = {
          inlineData: {
            mimeType: blob.type,
            data: base64data,
          },
      };

      const textPart = {
        text: `You are an eloquent and insightful art critic. Provide a short, one-paragraph critique of this painting titled "${artwork.title}" by ${artwork.artist}. Focus on the mood, technique, and emotional impact.`,
      };

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ parts: [imagePart, textPart] }],
      });
      
      setCritique(response.text);

    } catch (e) {
      console.error(e);
      setError('Could not generate a critique at this time. Please try again later.');
    } finally {
      setIsLoadingCritique(false);
    }
  };

  return (
    <div className="artwork-detail">
      <button onClick={onBack} className="back-button">&larr; Back to Gallery</button>
      <img src={artwork.imageUrl} alt={artwork.title} />
      <h2>{artwork.title}</h2>
      <p className="artist">by {artwork.artist}</p>
      <p className="description">{artwork.description}</p>
      <p className="price">${parseInt(artwork.price).toLocaleString()}</p>
      <div className="actions">
        <button onClick={onPlaceOrder}>Order This Artwork</button>
        <button onClick={handleGetCritique} disabled={isLoadingCritique} className="ai-critique-button">
          Get AI Critique
        </button>
      </div>
      {(isLoadingCritique || critique || error) && (
        <div className="critique-container">
          {isLoadingCritique && <div className="critique-loader"></div>}
          {critique && <p>{critique}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      )}
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