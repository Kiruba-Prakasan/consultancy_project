import React, { useState } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';

const StockQ: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | '' }>({
    message: '',
    type: '',
  });

  const checkStockQuantity = async () => {
    setIsLoading(true);
    setNotification({ message: '', type: '' });
    
    try {
      const token = localStorage.getItem('access_token');

      const response = await axios.get('http://localhost:8000/api/v1/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const products = response.data?.data;
      let lowStockText = '';

      if (Array.isArray(products)) {
        products.forEach((product: any) => {
          if (product.stock < 10) {
            console.log(`Product: ${product.name}, Stock: ${product.stock}`);
            lowStockText += `Product: ${product.name}, Stock: ${product.stock} units left\n`;
          }
        });
      }

      if (lowStockText) {
        const templateParams = {
          message: lowStockText,
        };

        await emailjs.send(
          'service_oqwgaw9',          
          'template_8qpqsrz',        
          templateParams,
          'olhHiL9TXIefjshUi'        
        );

        setNotification({
          message: 'Email sent with low stock details.',
          type: 'success'
        });
        console.log('Email sent with low stock details.');
      } else {
        setNotification({
          message: 'All products are sufficiently stocked.',
          type: 'success'
        });
        console.log('All products are sufficiently stocked.');
      }
    } catch (error: any) {
      setNotification({
        message: `Error: ${error.message}`,
        type: 'error'
      });
      console.error('Error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '24px',
      maxWidth: '500px',
      margin: '0 auto',
      marginTop:'200px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '16px'
      }}>
        Inventory Stock Checker
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '14px',
          color: '#666',
          marginBottom: '8px'
        }}>
          Check for low stock products and send notification emails to the inventory team.
        </p>
        
        <button 
          onClick={checkStockQuantity}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '500',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
            transition: 'background-color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <>
              <svg 
                style={{
                  animation: 'spin 1s linear infinite',
                  marginRight: '8px',
                  height: '16px',
                  width: '16px'
                }} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  style={{ opacity: 0.25 }} 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  style={{ opacity: 0.75 }} 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Processing...
            </>
          ) : (
            'Check Stock Quantity'
          )}
        </button>
      </div>

      {notification.message && (
        <div style={{
          padding: '12px',
          borderRadius: '6px',
          backgroundColor: notification.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: notification.type === 'success' ? '#166534' : '#b91c1c'
        }}>
          {notification.message}
        </div>
      )}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
};

export default StockQ;