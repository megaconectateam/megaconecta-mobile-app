import { useState } from 'react';
import { View } from 'react-native';
import { MegaCarrierRate } from '../../models';
import { TopupProduct } from './topup-product';

export type TopupProductsProps = {
  selectedId?: string;
  products: MegaCarrierRate[];
  onSelectProduct: (product: MegaCarrierRate) => void;
  onLayout?: (id: string, y: number) => void;
};

export const TopupProducts = ({
  selectedId,
  onSelectProduct,
  products,
  onLayout,
}: TopupProductsProps) => {
  const [selectedProductId, setSelectedProductId] = useState(selectedId || '');

  return (
    <View>
      {products.map((p) => (
        <TopupProduct
          key={p.id}
          isSelected={p.id === selectedProductId}
          product={p}
          onSelectProduct={() => {
            setSelectedProductId(p.id);
            onSelectProduct(p);
          }}
          onLayout={(y) => {
            onLayout && onLayout(p.id, y);
          }}
        />
      ))}
    </View>
  );
};
