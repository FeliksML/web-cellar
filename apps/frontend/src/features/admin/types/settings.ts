// Settings types for admin
export interface BusinessSettings {
    // Store Info
    store_name: string;
    store_tagline: string;
    store_email: string;
    store_phone: string;
    store_address: string;

    // Order Settings
    minimum_order_value: number;
    delivery_fee: number;
    free_delivery_threshold: number;
    pickup_available: boolean;
    delivery_available: boolean;

    // Fulfillment Settings
    default_lead_time_hours: number;
    same_day_cutoff_hour: number;
    available_time_slots: string[];

    // Notification Settings
    order_notification_email: string;
    low_stock_notification_email: string;
    notify_on_new_order: boolean;
    notify_on_low_stock: boolean;
}

export type SettingsUpdate = Partial<BusinessSettings>;
