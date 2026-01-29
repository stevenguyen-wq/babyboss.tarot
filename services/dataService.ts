import { CARDS, SHEET_API_URL } from '../constants';
import { Card, CardGroup, UserData } from '../types';

const STORAGE_KEY_PREFIX = 'babyboss_played_';

export const checkHasPlayed = (phoneNumber: string): boolean => {
  return !!localStorage.getItem(STORAGE_KEY_PREFIX + phoneNumber);
};

export const markAsPlayed = (phoneNumber: string, cardId: string) => {
  localStorage.setItem(STORAGE_KEY_PREFIX + phoneNumber, cardId);
};

export const drawCard = (): Card => {
  // Logic: 5% winner, 95% manifest
  const random = Math.random() * 100;
  
  const winners = CARDS.filter(c => c.group === CardGroup.WINNER);
  const manifests = CARDS.filter(c => c.group === CardGroup.MANIFEST);
  
  // 5% chance for winners
  if (random < 5) {
     const randomIndex = Math.floor(Math.random() * winners.length);
     return winners[randomIndex];
  } else {
     const randomIndex = Math.floor(Math.random() * manifests.length);
     return manifests[randomIndex];
  }
};

export const submitToGoogleSheet = async (user: UserData, card: Card) => {
  // Use FormData instead of JSON for better compatibility with Google Apps Script "no-cors"
  const formData = new FormData();
  formData.append('fullName', user.fullName);
  formData.append('phoneNumber', user.phoneNumber);
  formData.append('dob', user.dob);
  formData.append('cardName', card.name);
  formData.append('cardTitle', card.title);
  // Add Location Data
  formData.append('latitude', user.latitude || '');
  formData.append('longitude', user.longitude || '');
  formData.append('timestamp', new Date().toLocaleString('vi-VN'));

  // Log for debugging
  console.log("Submitting Data via FormData:", Object.fromEntries(formData));

  if (SHEET_API_URL) {
      try {
        await fetch(SHEET_API_URL, {
            method: 'POST',
            mode: 'no-cors', // Important: This prevents CORS errors but makes the response opaque
            body: formData,  // Sending FormData is more reliable for GAS than JSON
        });
        console.log("Request sent to Google Sheet");
      } catch (e) {
          console.error("Error saving to sheet", e);
      }
  } else {
      console.warn("Google Sheet API URL not set. Data logged to console only.");
  }
  
  return true;
};