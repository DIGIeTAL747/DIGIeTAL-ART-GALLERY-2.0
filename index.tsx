import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

// Data moved from data.ts to resolve browser import issue
interface Artwork {
  id: string;
  title: string;
  artist: string;
  description: string;
  price: string;
  imageUrl: string;
}

const mockArtworks: Artwork[] = [
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

const ArtworkList = ({ artworks, onSelectArtwork }: { artworks: Artwork[], onSelectArtwork: (artwork: Artwork) => void }) => {
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

const ArtworkDetail = ({ artwork, onPlaceOrder, onBack }: { artwork: Artwork, onPlaceOrder: () => void, onBack: () => void }) => {
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

const OrderForm = ({ artwork, onSubmitOrder, onBack }: { artwork: Artwork, onSubmitOrder: (details: object) => void, onBack: () => void }) => {
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

const OrderConfirmation = ({ onBackToHome }: { onBackToHome: () => void }) => {
  return (
    <div className="confirmation-container">
      <h2>Order Confirmed!</h2>
      <p>Thank you for your purchase! We will send a confirmation and shipping details to your email shortly.</p>
      <button onClick={onBackToHome}>Return to Gallery</button>
    </div>
  );
};

interface ArtworkFormModalProps {
  artwork: Artwork | null;
  onSave: (artwork: Artwork) => void;
  onCancel: () => void;
}

const ArtworkFormModal = ({ artwork, onSave, onCancel }: ArtworkFormModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    description: '',
    price: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (artwork) {
      setFormData(artwork);
      setImagePreview(artwork.imageUrl);
    } else {
      setFormData({ title: '', artist: '', description: '', price: '', imageUrl: '' });
      setImagePreview('');
    }
  }, [artwork]);

  useEffect(() => {
    triggerRef.current = document.activeElement as HTMLElement;
    const firstInput = modalRef.current?.querySelector('input, button, textarea');
    if (firstInput) {
        (firstInput as HTMLElement).focus();
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
            return;
        }
        if (e.key === 'Tab') {
            const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusableElements) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { 
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { 
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    };
    
    const modalElement = modalRef.current;
    modalElement?.addEventListener('keydown', handleKeyDown);

    return () => {
        modalElement?.removeEventListener('keydown', handleKeyDown);
        triggerRef.current?.focus();
    };
  }, [onCancel]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData({ ...formData, imageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title || !formData.artist || !formData.price || !formData.imageUrl) {
        alert("Please fill out all fields and upload an image.");
        return;
    }
    onSave({ ...formData, id: artwork?.id || crypto.randomUUID() });
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div 
        ref={modalRef}
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title">{artwork ? 'Edit Artwork' : 'Add New Artwork'}</h2>
          <button onClick={onCancel} className="close-button" aria-label="Close modal">&times;</button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="modal-form">
          <label htmlFor="title">Title:</label>
          <input id="title" type="text" value={formData.title} onChange={handleChange} required />
          
          <label htmlFor="artist">Artist:</label>
          <input id="artist" type="text" value={formData.artist} onChange={handleChange} required />
          
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={formData.description} onChange={handleChange} />

          <label htmlFor="price">Price ($):</label>
          <input id="price" type="number" value={formData.price} onChange={handleChange} required />
          
          <label htmlFor="imageUpload">Artwork Image:</label>
          <input id="imageUpload" type="file" accept="image/*" onChange={handleFileChange} />
          {imagePreview && <img src={imagePreview} alt="Preview" className="form-image-preview" />}

          <div className="modal-footer">
            <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
            <button type="submit">{artwork ? 'Save Changes' : 'Add Artwork'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};


const AdminPanel = ({ artworks, onAdd, onEdit, onDelete }: { artworks: Artwork[], onAdd: () => void, onEdit: (artwork: Artwork) => void, onDelete: (id: string) => void }) => {
    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>Manage Artworks</h2>
                <button onClick={onAdd}>+ Add New Artwork</button>
            </div>
            <div className="admin-list">
                {artworks.map(artwork => (
                    <div key={artwork.id} className="admin-list-item">
                        <img src={artwork.imageUrl} alt={artwork.title} className="admin-list-item-img" />
                        <div className="admin-list-item-info">
                            <h3>{artwork.title}</h3>
                            <p>by {artwork.artist}</p>
                        </div>
                        <div className="admin-list-item-actions">
                            <button onClick={() => onEdit(artwork)} className="edit-btn" aria-label={`Edit ${artwork.title}`}>Edit</button>
                            <button onClick={() => onDelete(artwork.id)} className="delete-btn" aria-label={`Delete ${artwork.title}`}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [selectedArtwork,  setSelectedArtwork] = useState<Artwork | null>(null);
  const [appState, setAppState] = useState('galleryList'); // galleryList, galleryDetail, orderForm, orderConfirmation
  const [viewMode, setViewMode] = useState('gallery'); // gallery, admin
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const storedArtworks = localStorage.getItem('artworks');
        if (storedArtworks) {
          setArtworks(JSON.parse(storedArtworks));
        } else {
          setArtworks(mockArtworks);
          localStorage.setItem('artworks', JSON.stringify(mockArtworks));
        }
      } catch (error) {
        console.error("Could not parse artworks from localStorage", error);
        setArtworks(mockArtworks);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const updateAndStoreArtworks = (newArtworks: Artwork[]) => {
    setArtworks(newArtworks);
    localStorage.setItem('artworks', JSON.stringify(newArtworks));
  };
  
  const handleSelectArtwork = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setAppState('galleryDetail');
  };

  const handleBackToList = () => {
      setSelectedArtwork(null);
      setAppState('galleryList');
  }
  
  const handleBackToDetail = () => {
      setAppState('galleryDetail');
  }

  const handlePlaceOrderClick = () => {
    setAppState('orderForm');
  };
  
  const handleBackToHome = () => {
      setSelectedArtwork(null);
      setAppState('galleryList');
      setViewMode('gallery');
  }

  const handleSubmitOrder = (orderDetails) => {
    console.log('Order Submitted:', {
        ...orderDetails,
        artworkId: selectedArtwork.id,
        artworkTitle: selectedArtwork.title,
        orderDate: new Date(),
    });
    setAppState('orderConfirmation');
  };

  const handleAddArtwork = () => {
    setEditingArtwork(null);
    setIsModalOpen(true);
  };
  
  const handleEditArtwork = (artwork: Artwork) => {
    setEditingArtwork(artwork);
    setIsModalOpen(true);
  };
  
  const handleDeleteArtwork = (artworkId: string) => {
    if (window.confirm("Are you sure you want to delete this artwork?")) {
        const updatedArtworks = artworks.filter(a => a.id !== artworkId);
        updateAndStoreArtworks(updatedArtworks);
    }
  };
  
  const handleSaveArtwork = (artworkToSave: Artwork) => {
    const index = artworks.findIndex(a => a.id === artworkToSave.id);
    if (index > -1) {
        const updatedArtworks = [...artworks];
        updatedArtworks[index] = artworkToSave;
        updateAndStoreArtworks(updatedArtworks);
    } else {
        updateAndStoreArtworks([artworkToSave, ...artworks]);
    }
    setIsModalOpen(false);
    setEditingArtwork(null);
  };

  if (loading) {
    return (
        <div className="loader-container">
            <div className="loader"></div>
        </div>
    );
  }
  
  const renderGalleryView = () => {
    switch (appState) {
      case 'galleryList':
        return <ArtworkList artworks={artworks} onSelectArtwork={handleSelectArtwork} />;
      case 'galleryDetail':
        return <ArtworkDetail artwork={selectedArtwork!} onPlaceOrder={handlePlaceOrderClick} onBack={handleBackToList} />;
      case 'orderForm':
        return <OrderForm artwork={selectedArtwork!} onSubmitOrder={handleSubmitOrder} onBack={handleBackToDetail} />;
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
        <nav className="main-nav">
            <button onClick={() => setViewMode('gallery')} className={viewMode === 'gallery' ? 'active' : ''}>Gallery</button>
            <button onClick={() => setViewMode('admin')} className={viewMode === 'admin' ? 'active' : ''}>Manage Artworks</button>
        </nav>
      </header>
      <main>
        {viewMode === 'gallery' ? renderGalleryView() : <AdminPanel artworks={artworks} onAdd={handleAddArtwork} onEdit={handleEditArtwork} onDelete={handleDeleteArtwork} />}
      </main>
      {isModalOpen && <ArtworkFormModal artwork={editingArtwork} onSave={handleSaveArtwork} onCancel={() => setIsModalOpen(false)} />}
    </>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);