/**
 * Verzögert die Ausführung einer Funktion
 * @param {Function} func - Die zu verzögernde Funktion
 * @param {number} wait - Wartezeit in Millisekunden
 * @returns {Function} - Die verzögerte Funktion
 */
export function debounce(func, wait) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
} 