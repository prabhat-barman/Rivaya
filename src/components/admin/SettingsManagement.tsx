import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, MessageCircle } from 'lucide-react';
import { adminAPI } from '../../utils/api';
import { useAdmin } from '../../context/AdminContext';

interface SettingsManagementProps {
    onNavigate: (page: string) => void;
}

export function SettingsManagement({ onNavigate }: SettingsManagementProps) {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { token } = useAdmin();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await adminAPI.getSettings(token!);
            setSettings(res.settings);
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            await adminAPI.updateSettings(token, settings);
            alert('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => onNavigate('admin-dashboard')}
                            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-black"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to Dashboard</span>
                        </button>
                        <h1 className="text-xl tracking-wider">SETTINGS</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSave} className="space-y-8">

                    {/* General Settings */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg tracking-wide mb-4 border-b pb-2">GENERAL INFORMATION</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Site Name</label>
                                <input
                                    type="text"
                                    value={settings?.siteName || ''}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Tagline</label>
                                <input
                                    type="text"
                                    value={settings?.tagline || ''}
                                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg tracking-wide mb-4 border-b pb-2">CONTACT DETAILS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Contact Email</label>
                                <input
                                    type="email"
                                    value={settings?.contactEmail || ''}
                                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Contact Phone</label>
                                <input
                                    type="text"
                                    value={settings?.contactPhone || ''}
                                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">WhatsApp Number</label>
                                <input
                                    type="text"
                                    value={settings?.whatsapp || ''}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-gray-600 mb-1">Address</label>
                                <textarea
                                    value={settings?.address || ''}
                                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Notification Settings */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 border-b border-green-200 pb-2">
                            <MessageCircle className="w-5 h-5 text-green-600" />
                            <h2 className="text-lg tracking-wide text-green-800">AUTOMATIC WHATSAPP NOTIFICATIONS</h2>
                        </div>

                        <p className="text-sm text-green-700 mb-4">
                            To receive automatic order notifications on your WhatsApp, you need a free API key from CallMeBot.
                        </p>

                        <div className="bg-white p-4 rounded border border-green-200 mb-4 text-sm space-y-2">
                            <p className="font-medium">Setup Instructions:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-700">
                                <li>Add the number <strong>+34 644 66 32 62</strong> to your phone contacts (Name it "CallMeBot").</li>
                                <li>Send the message <code>I allow callmebot to send me messages</code> to that number via WhatsApp.</li>
                                <li>Wait for the reply containing your <strong>API Key</strong>.</li>
                                <li>Enter the API Key below.</li>
                            </ol>
                        </div>

                        <div>
                            <label className="block text-sm text-green-800 mb-1 font-medium">CallMeBot API Key</label>
                            <input
                                type="text"
                                value={settings?.whatsappApiKey || ''}
                                onChange={(e) => setSettings({ ...settings, whatsappApiKey: e.target.value })}
                                placeholder="Enter your API Key here"
                                className="w-full px-3 py-2 border border-green-300 rounded focus:outline-none focus:border-green-500"
                            />
                        </div>
                    </div>

                    {/* Shipping Settings */}
                    <div className="bg-white rounded-lg p-6 shadow-sm">
                        <h2 className="text-lg tracking-wide mb-4 border-b pb-2">SHIPPING & PAYMENTS</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Shipping Charges (₹)</label>
                                <input
                                    type="number"
                                    value={settings?.shippingCharges || ''}
                                    onChange={(e) => setSettings({ ...settings, shippingCharges: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Free Shipping Above (₹)</label>
                                <input
                                    type="number"
                                    value={settings?.freeShippingAbove || ''}
                                    onChange={(e) => setSettings({ ...settings, freeShippingAbove: parseInt(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="flex items-center space-x-2 bg-black text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            <span>SAVE SETTINGS</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
