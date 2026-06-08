import React, { useState } from 'react';
// IMPORT: Panggil instance api buatan kita sendiri
import api from '../api/axios'; 

const GoogleFitSync = () => {
    const [steps, setSteps] = useState(0);
    const [calories, setCalories] = useState(0);
    const [loading, setLoading] = useState(false);

    // 1. Fungsi untuk mengarahkan pengguna login ke Google
    const handleConnect = () => {
        // Tetap menggunakan ini untuk membuka gerbang Google OAuth
        window.location.href = "https://health-monitoring-production.up.railway.app/api/google-fit/auth"; 
    };

    // 2. Fungsi untuk mengambil data langkah kaki (Sinkronisasi)
    const handleSync = async () => {
        setLoading(true);
        try {
            // BENAR: Ubah menjadi api.post agar sinkron dengan rute di routes/api.php Laravel Anda
            const response = await api.post('/google-fit/sync');
            
            // Mengambil data dari response.data sesuai dengan struktur return JSON Laravel
            setSteps(response.data.steps || 0);
            setCalories(response.data.calories || 0);
            alert('Sinkronisasi Berhasil!');
        } catch (error) {
            console.error("Detail Error Sinkronisasi:", error.response);
            
            // Menampilkan pesan error spesifik dari backend jika ada
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert('Gagal mengambil data. Pastikan akun Google Fit sudah terhubung di menu /google-fit.');
            }
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