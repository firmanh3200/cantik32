// Configuration Settings for Monografi Desa Panenjoan Dashboard

export const config = {
    // Desa info
    desa: {
        nama: "Desa Panenjoan",
        kecamatan: "Cicalengka",
        kabupaten: "Bandung",
        provinsi: "Jawa Barat",
        luas: 3.25, // dalam km²
        jumlahPenduduk: 8245,
        jumlahKK: 2134,
        jumlahDusun: 5,
        jumlahRW: 12,
        jumlahRT: 48
    },
    
    // Geografi
    geografi: {
        koordinat: {
            lat: -6.9862,
            lng: 107.8231
        },
        ketinggian: 650, // dalam mdpl
        batas: {
            utara: "Desa Cicalengka",
            selatan: "Desa Tenjolaya",
            timur: "Desa Waluya",
            barat: "Desa Cikancung"
        },
        jarak: {
            keKecamatan: 5.2, // dalam km
            keKabupaten: 32.7 // dalam km
        }
    },
    
    // Demografi
    demografi: {
        penduduk: {
            lakilaki: 4182,
            perempuan: 4063
        },
        agama: {
            islam: 94.5,
            kristen: 2.8,
            katolik: 1.9,
            hindu: 0.3,
            buddha: 0.3,
            konghucu: 0.1,
            lainnya: 0.1
        }
    },
    
    // Penggunaan lahan (dalam persen)
    penggunaanLahan: {
        pemukiman: 25,
        sawah: 45,
        perkebunan: 18,
        fasilitasUmum: 7,
        lainnya: 5
    },
    
    // Pendidikan (dalam persen)
    pendidikan: {
        tidakSekolah: 8.5,
        sd: 34.2,
        smp: 27.5,
        sma: 22.3,
        diploma: 3.8,
        sarjana: 3.2,
        pascasarjana: 0.5
    },
    
    // Mata pencaharian (dalam persen)
    mataPencaharian: {
        petani: 42.5,
        buruhTani: 18.7,
        pns: 5.3,
        pedagang: 12.8,
        industriRumahTangga: 7.2,
        swasta: 8.9,
        lainnya: 4.6
    },
    
    // Adjust other data values as needed for your dashboard
};

