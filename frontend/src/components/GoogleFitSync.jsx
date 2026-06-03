import React, { useState } from 'react';
import axios from 'axios';

// Pastikan Axios sudah dikonfigurasi menggunakan URL Cloudflare Laravel Anda
const API_URL = 'https://zoo-franchise-metric-moderators.trycloudflare.com/api';

const GoogleFitSync = () => {
    const [steps, setSteps] = useState(0);
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);

    // 1. Fungsi untuk mengarahkan pengguna login ke Google
    const handleConnect = () => {
    // PERBAIKAN: Arahkan ke rute baru /fit-kesehatan/auth
    window.location.href = `${API_URL}/fit-kesehatan/auth`; 
};

    // 2. Fungsi untuk mengambil data langkah kaki (Sinkronisasi)
    const handleSync = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/sync`, {
                withCredentials: true // Wajib jika Anda menggunakan session/cookie Laravel
            });
            setSteps(response.data.steps);
            setCalories(response.data.calories);
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
            <button onClick={handleConnect} style={{ marginRight: '10px', padding: '10px' }}>
                Hubungkan Akun Google
            </button>

            {/* Tombol Sinkronisasi Data */}
            <button onClick={handleSync} disabled={loading} style={{ padding: '10px' }}>
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
