import { useState, useEffect } from "react";
import { useAdminSettings, useUpdateSettings, useResetSettings } from "../api/settings";
import type { BusinessSettings } from "../types/settings";
import "./admin-settings.css";

export function AdminSettings() {
    const { data: settings, isLoading, error } = useAdminSettings();
    const updateSettings = useUpdateSettings();
    const resetSettings = useResetSettings();

    const [formData, setFormData] = useState<Partial<BusinessSettings>>({});
    const [hasChanges, setHasChanges] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Initialize form when settings load
    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const handleChange = (field: keyof BusinessSettings, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleTimeSlotChange = (index: number, value: string) => {
        const slots = [...(formData.available_time_slots || [])];
        slots[index] = value;
        handleChange("available_time_slots", slots);
    };

    const addTimeSlot = () => {
        const slots = [...(formData.available_time_slots || []), ""];
        handleChange("available_time_slots", slots);
    };

    const removeTimeSlot = (index: number) => {
        const slots = (formData.available_time_slots || []).filter((_, i) => i !== index);
        handleChange("available_time_slots", slots);
    };

    const handleSave = async () => {
        await updateSettings.mutateAsync(formData);
        setHasChanges(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleReset = async () => {
        if (!confirm("Reset all settings to defaults? This cannot be undone.")) return;
        await resetSettings.mutateAsync();
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading settings...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load settings</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-settings">
            <header className="admin-page-header">
                <div className="header-content">
                    <div>
                        <h1>Settings</h1>
                        <p className="admin-page-subtitle">
                            Configure your bakery business settings
                        </p>
                    </div>
                    <div className="header-actions">
                        {saveSuccess && <span className="save-success">✓ Saved</span>}
                        <button
                            onClick={handleReset}
                            className="reset-btn"
                            disabled={resetSettings.isPending}
                        >
                            Reset to Defaults
                        </button>
                        <button
                            onClick={handleSave}
                            className="save-btn"
                            disabled={!hasChanges || updateSettings.isPending}
                        >
                            {updateSettings.isPending ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </header>

            <div className="settings-grid">
                {/* Store Information */}
                <section className="settings-section">
                    <h2>🏪 Store Information</h2>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Store Name</label>
                            <input
                                type="text"
                                value={formData.store_name || ""}
                                onChange={(e) => handleChange("store_name", e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Tagline</label>
                            <input
                                type="text"
                                value={formData.store_tagline || ""}
                                onChange={(e) => handleChange("store_tagline", e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.store_email || ""}
                                onChange={(e) => handleChange("store_email", e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone</label>
                            <input
                                type="tel"
                                value={formData.store_phone || ""}
                                onChange={(e) => handleChange("store_phone", e.target.value)}
                            />
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <input
                                type="text"
                                value={formData.store_address || ""}
                                onChange={(e) => handleChange("store_address", e.target.value)}
                            />
                        </div>
                    </div>
                </section>

                {/* Order Settings */}
                <section className="settings-section">
                    <h2>📦 Order Settings</h2>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Minimum Order Value ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.minimum_order_value || 0}
                                onChange={(e) => handleChange("minimum_order_value", parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Delivery Fee ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.delivery_fee || 0}
                                onChange={(e) => handleChange("delivery_fee", parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Free Delivery Threshold ($)</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.free_delivery_threshold || 0}
                                onChange={(e) => handleChange("free_delivery_threshold", parseFloat(e.target.value))}
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.pickup_available ?? true}
                                    onChange={(e) => handleChange("pickup_available", e.target.checked)}
                                />
                                Pickup Available
                            </label>
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.delivery_available ?? true}
                                    onChange={(e) => handleChange("delivery_available", e.target.checked)}
                                />
                                Delivery Available
                            </label>
                        </div>
                    </div>
                </section>

                {/* Fulfillment Settings */}
                <section className="settings-section">
                    <h2>🚚 Fulfillment Settings</h2>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Default Lead Time (hours)</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.default_lead_time_hours || 24}
                                onChange={(e) => handleChange("default_lead_time_hours", parseInt(e.target.value))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Same-Day Cutoff Hour (24h)</label>
                            <input
                                type="number"
                                min="0"
                                max="23"
                                value={formData.same_day_cutoff_hour || 12}
                                onChange={(e) => handleChange("same_day_cutoff_hour", parseInt(e.target.value))}
                            />
                            <span className="form-hint">Orders placed before this hour can be same-day</span>
                        </div>
                        <div className="form-group full-width">
                            <label>Available Time Slots</label>
                            <div className="time-slots">
                                {(formData.available_time_slots || []).map((slot, index) => (
                                    <div key={index} className="time-slot-row">
                                        <input
                                            type="text"
                                            value={slot}
                                            onChange={(e) => handleTimeSlotChange(index, e.target.value)}
                                            placeholder="e.g. 9:00 AM - 12:00 PM"
                                        />
                                        <button onClick={() => removeTimeSlot(index)} className="remove-slot-btn">✕</button>
                                    </div>
                                ))}
                                <button onClick={addTimeSlot} className="add-slot-btn">+ Add Time Slot</button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Notification Settings */}
                <section className="settings-section">
                    <h2>🔔 Notifications</h2>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Order Notification Email</label>
                            <input
                                type="email"
                                value={formData.order_notification_email || ""}
                                onChange={(e) => handleChange("order_notification_email", e.target.value)}
                                placeholder="Where to send new order alerts"
                            />
                        </div>
                        <div className="form-group">
                            <label>Low Stock Notification Email</label>
                            <input
                                type="email"
                                value={formData.low_stock_notification_email || ""}
                                onChange={(e) => handleChange("low_stock_notification_email", e.target.value)}
                                placeholder="Where to send low stock alerts"
                            />
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.notify_on_new_order ?? true}
                                    onChange={(e) => handleChange("notify_on_new_order", e.target.checked)}
                                />
                                Send email on new orders
                            </label>
                        </div>
                        <div className="form-group checkbox-group">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.notify_on_low_stock ?? true}
                                    onChange={(e) => handleChange("notify_on_low_stock", e.target.checked)}
                                />
                                Send email on low stock
                            </label>
                        </div>
                    </div>
                </section>
            </div>

            {hasChanges && (
                <div className="unsaved-banner">
                    You have unsaved changes
                    <button onClick={handleSave} disabled={updateSettings.isPending}>
                        {updateSettings.isPending ? "Saving..." : "Save Now"}
                    </button>
                </div>
            )}
        </div>
    );
}
