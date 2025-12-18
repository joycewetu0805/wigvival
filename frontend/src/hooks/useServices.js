import { useEffect, useState } from 'react';
import axios from 'axios';

export default function useServices() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/services')
      .then(res => setServices(res.data))
      .catch(console.error);
  }, []);

  return services;
}
