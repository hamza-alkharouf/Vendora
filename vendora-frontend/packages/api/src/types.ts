import React from 'react';

export interface Order {
  id: string;
  customer: string;
  total: string;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export interface Stats {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  diff: number;
}
