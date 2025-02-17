import { createContext, useContext, useEffect, useState } from 'react';
import { TopUpInitialData, TopupCartItem } from '../models';

type TopupContextType = {
  initialData?: TopUpInitialData;
  discount: number;
  cartItems: TopupCartItem[];
  cartTotal: number;

  //methods
  addCartItem: (item: TopupCartItem) => void;
  setDiscount: (discount: number) => void;
  setInitialData: (data: TopUpInitialData) => void;
  deleteCartItem: (item: TopupCartItem) => void;
};

const TopupContext = createContext<TopupContextType>({
  initialData: undefined,
  discount: 0,
  cartItems: [],
  cartTotal: 0,

  // methods
  addCartItem: (_: TopupCartItem) => {},
  setDiscount: (_: number) => {},
  setInitialData: (_: TopUpInitialData) => {},
  deleteCartItem: (_: TopupCartItem) => {},
});

const TopupProvider = ({ children }: any) => {
  const [initialDataState, setInitialDataState] = useState<TopUpInitialData>();
  const [discount, setDiscount] = useState<number>(0);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartItems, setCartItems] = useState<TopupCartItem[]>([]);

  const addCartItem = (item: TopupCartItem) => {
    setCartItems([...cartItems, item]);
  };

  const setInitialData = (data: TopUpInitialData) => {
    setInitialDataState(data);

    if (data.discount && data.discount > 0) {
      setDiscount(data.discount);
    }
  };

  const deleteCartItem = (item: TopupCartItem) => {
    const newCartItems = cartItems.filter((i) => i.uuid !== item.uuid);
    setCartItems(newCartItems);
  };

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => {
      return acc + Number(item.carrierRate.realAmount || 0);
    }, 0);

    setCartTotal(Math.max(total - (discount || 0), 0));
  }, [cartItems, discount]);

  return (
    <TopupContext.Provider
      value={{
        initialData: initialDataState,
        discount,
        cartItems,
        cartTotal,
        setInitialData,
        setDiscount,
        addCartItem,
        deleteCartItem,
      }}
    >
      {children}
    </TopupContext.Provider>
  );
};

export { TopupContext, TopupProvider };
export const useTopup = () => useContext(TopupContext);
