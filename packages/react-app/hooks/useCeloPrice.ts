
import { useState, useEffect } from "react";

const useCeloPrice = () => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=USD"
      );
      const data = await response.json();
      setPrice(data.celo.usd);
    };
    fetchData();
  }, []);

  return price;
};

export default useCeloPrice;