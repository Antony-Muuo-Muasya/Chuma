import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/firebaseSim';
import { GlobalSettings } from '../../types';
import { Save } from 'lucide-react';

const SettingsManager: React.FC = () => {
    const [settings, setSettings] = useState<GlobalSettings | null>(null);

    useEffect(() => {
        dbService.getSettings().then(setSettings);
    }, []);

    const handleSave = async () => {
        if (settings) {
            await dbService.updateSettings(settings);
            alert("Settings Saved!");
        }
    };

    if (!settings) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl space-y-8">
            <h2 className="text-3xl font-bold text-white">Global Configuration</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-400">Hero Tagline</label>
                    <input 
                        className="w-full bg-zinc-900 border border-gray-700 p-3 rounded text-white"
                        value={settings.heroText}
                        onChange={e => setSettings({...settings, heroText: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-2 text-gray-400">Marquee Text</label>
                    <input 
                        className="w-full bg-zinc-900 border border-gray-700 p-3 rounded text-white"
                        value={settings.marqueeText}
                        onChange={e => setSettings({...settings, marqueeText: e.target.value})}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold mb-2 text-gray-400">Contact Email</label>
                        <input 
                            className="w-full bg-zinc-900 border border-gray-700 p-3 rounded text-white"
                            value={settings.contactEmail}
                            onChange={e => setSettings({...settings, contactEmail: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="block text-sm font-bold mb-2 text-gray-400">Theme Color Hex</label>
                        <input 
                            className="w-full bg-zinc-900 border border-gray-700 p-3 rounded text-white"
                            value={settings.themeColor}
                            onChange={e => setSettings({...settings, themeColor: e.target.value})}
                        />
                     </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded border border-white/10">
                    <input 
                        type="checkbox" 
                        checked={settings.maintenanceMode}
                        onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})}
                        className="w-5 h-5"
                    />
                    <span className="text-white font-bold">Enable Maintenance Mode</span>
                </div>
            </div>

            <button onClick={handleSave} className="bg-chuma-gold text-black px-8 py-3 rounded font-bold hover:scale-105 transition-transform flex items-center gap-2">
                <Save size={18} /> SAVE CHANGES
            </button>
        </div>
    );
};

export default SettingsManager;
