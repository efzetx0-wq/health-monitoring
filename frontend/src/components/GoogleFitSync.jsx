import React, { useState } from 'react';
// IMPORT: Panggil instance api buatan kita sendiri, jangan axios mentah lagi
import api from '../api/axios'; 

const GoogleFitSync = () => {
    const [steps, setSteps] = useState(0);
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);

    // 1. Fungsi untuk mengarahkan pengguna login ke Google
    const handleConnect = () => {
        // AMAN: Langsung arahkan ke endpoint auth Railway Anda secara absolut
        window.location.href = "https://health-monitoring-production.up.railway.app/api/google-fit/auth"; 
    };

    // 2. Fungsi untuk mengambil data langkah kaki (Sinkronisasi)
    const handleSync = async () => {
        setLoading(true);
        try {
            // AMAN: Cukup panggil '/google-fit/sync', config withCredentials otomatis ikut dari file api.js kita
            const response = await api.get('/google-fit/sync');
            
            setSteps(response.data.steps);
            setCalories(response.data.calories);
            alert('Sinkronisasi Berhasil!');
        } catch (error) {
            alert('Gagal sinkronisasi atau Google Fit belum terhubung!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Integrasi Google Fit</h3>
            
            {/* Tombol Hubungkan */}
            <button onClick={handleConnect} style={{ marginRight: '10px', padding: '10px', cursor: 'pointer' }}>
                Hubungkan Akun Google
            </button>

            {/* Tombol Sinkronisasi Data */}
            <button onClick={handleSync} disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
                {loading ? 'Menyinkronkan...' : 'Sinkronkan Langkah Hari Ini'}
            </button>

            {/* Tampilan Data */}
            <div style={{ marginTop: '20px' }}>
                <p><strong>Total Langkah:</strong> {steps} langkah</p>
                <p><strong>Kalori Terbakar:</strong> {calories} kkal</p>
            </div>
        </div>
    );
};

export default GoogleFitSync;