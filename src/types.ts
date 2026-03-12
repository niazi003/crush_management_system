export interface Dispatch {
  id: string;
  dispatch_date: string | null;
  buyer_name: string | null;

  vehicle_type: string | null;
  license_plate: string | null;
  vehicle_owner: string | null;
  driver_name: string | null;
  driver_contact: string | null;
  is_owner_driver: boolean;

  crush_plant: string | null;
  crush_type: string | null;
  crush_quality: string | null;
  quantity: number | null;

  destination_city: string | null;
  destination_area: string | null;

  purchase_rate: number | null;
  transport_fare: number | null;
  other_expenses: number | null;

  selling_rate: number | null;

  // Computed columns (read-only)
  total_cost: number | null;
  total_revenue: number | null;
  net_profit: number | null;

  created_at: string | null;
}

export type DispatchInsert = Omit<Dispatch, 'id' | 'total_cost' | 'total_revenue' | 'net_profit' | 'created_at'>;
export type DispatchUpdate = Partial<DispatchInsert>;
