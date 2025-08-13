"use client"
import React from 'react';
import ProductPageTemplate from '@/app/components/product/ProductPageTemplate';
import { getProduct } from '@/lib/data/products';

export default function AffiliatePortal() {
  const product = getProduct('affiliate-portal');
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductPageTemplate product={product} />;
}