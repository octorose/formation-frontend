import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ConfirmationSteps = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step > 0) {
      showConfirmAlert();
    }
  }, [step]);

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleConfirm = () => {
    window.location.href = "/TestLogic";
  };

  const showConfirmAlert = () => {
    let title, message;

    switch (step) {
      case 1:
        title = 'Confirmation';
        message = 'Le test logique contient 30 minutes. Cliquez sur Suivant pour continuer.';
        break;
      case 2:
        title = 'Confirmation';
        message = 'Le test logique contient 20 questions en ordre séquentiel. Cliquez sur Suivant pour continuer.';
        break;
      case 3:
        title = 'Confirmation';
        message = 'Vous devez respecter le temps pour chaque question. Cliquez sur Suivant pour continuer.';
        break;
      case 4:
        title = 'Confirmation';
        message = 'Êtes-vous sûr de vouloir commencer le test logique?';
        break;
      default:
        return;
    }

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div style={{ 
            borderRadius: '10px', 
            padding: '50px', 
            background: '#fff', 
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', 
            fontFamily: 'Arial, sans-serif',
            width: '600px', // Adjust the width
            margin: 'auto' // Center align
          }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>{title}</h1>
            <p style={{ fontSize: '18px', marginBottom: '30px' }}>{message}</p>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <button
                onClick={() => {
                  if (step < 4) {
                    handleNextStep();
                  } else {
                    handleConfirm();
                  }
                  onClose();
                }}
                className="button"
              >
                {step < 4 ? 'Suivant' : 'Oui'}
              </button>
              <button
                onClick={onClose}
                className="button button-secondary"
              >
                Non
              </button>
            </div>
          </div>
        );
      }
    });
  };

  return (
    <button onClick={() => setStep(1)}>
      Commencer le Test Logique
    </button>
  );
};

export default ConfirmationSteps;
