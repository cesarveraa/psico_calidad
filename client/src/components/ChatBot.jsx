import { useEffect } from 'react';

const ChatBot = () => {
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript('https://cdn.botpress.cloud/webchat/v2/inject.js')
      .then(() => loadScript('https://mediafiles.botpress.cloud/a6b29c3d-352b-4d56-836f-575982c8ea7c/webchat/v2/config.js'))
      .catch((error) => console.error('Error loading Botpress scripts:', error));
  }, []);

};

export default ChatBot;
