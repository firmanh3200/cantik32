import * as Chart from 'chart.js';
import * as L from 'leaflet';
import { config } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation functionality
    initNavigation();
    
    // Initialize map
    initMap();
    
    // Initialize charts
    initCharts();
    
    // Populate overview data
    populateOverviewData();
    
    // Add event listeners
    document.getElementById('explore-btn').addEventListener('click', () => {
        document.getElementById('geografi').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('download-btn').addEventListener('click', () => {
        alert('Fitur unduh akan segera tersedia!');
    });
});

function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Menu toggle functionality
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Smooth scrolling for navigation links
    // biome-ignore lint/complexity/noForEach: <explanation>
            navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            navMenu.classList.remove('active');
            
            // Get target section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active link
                // biome-ignore lint/complexity/noForEach: <explanation>
                                                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        
        // biome-ignore lint/complexity/noForEach: <explanation>
                document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        // biome-ignore lint/complexity/noForEach: <explanation>
                navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

function initMap() {
    // Create a map centered on Desa Panenjoan (approximate coordinates)
    const map = L.map('map').setView([-6.9862, 107.8231], 14);
    
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker for the village center
    L.marker([-6.9862, 107.8231])
        .addTo(map)
        .bindPopup('<b>Desa Panenjoan</b><br>Kecamatan Cicalengka')
        .openPopup();
        
    // Add a polygon for the approximate village boundary
    const desaBoundary = [
        [-6.9762, 107.8131],
        [-6.9762, 107.8331],
        [-6.9962, 107.8331],
        [-6.9962, 107.8131]
    ];
    
    L.polygon(desaBoundary, {
        color: '#3b7a57',
        fillColor: '#5a9775',
        fillOpacity: 0.3
    }).addTo(map)
    .bindPopup('Batas Desa Panenjoan (Perkiraan)');
    
    // Fix map display issues
    setTimeout(() => {
        map.invalidateSize();
    }, 100);
}

function initCharts() {
    // Chart for land use (Penggunaan Lahan)
    const lahanCtx = document.getElementById('lahan-chart').getContext('2d');
    new Chart.Chart(lahanCtx, {
        type: 'pie',
        data: {
            labels: ['Pemukiman', 'Sawah', 'Perkebunan', 'Fasilitas Umum', 'Lainnya'],
            datasets: [{
                data: [25, 45, 18, 7, 5],
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#3b7a57',
                    '#FFCE56',
                    '#9966FF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Chart for administrative divisions (Pembagian Wilayah)
    const wilayahCtx = document.getElementById('wilayah-chart').getContext('2d');
    new Chart.Chart(wilayahCtx, {
        type: 'bar',
        data: {
            labels: ['Dusun 1', 'Dusun 2', 'Dusun 3', 'Dusun 4', 'Dusun 5'],
            datasets: [{
                label: 'Jumlah RT',
                data: [11, 9, 8, 12, 8],
                backgroundColor: '#36A2EB'
            }, {
                label: 'Jumlah RW',
                data: [3, 2, 2, 3, 2],
                backgroundColor: '#FF6384'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Chart for population distribution (Distribusi Penduduk)
    const pendudukCtx = document.getElementById('penduduk-chart').getContext('2d');
    new Chart.Chart(pendudukCtx, {
        type: 'doughnut',
        data: {
            labels: ['Laki-laki', 'Perempuan'],
            datasets: [{
                data: [4182, 4063],
                backgroundColor: [
                    '#36A2EB', 
                    '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Chart for population pyramid (Piramida Penduduk)
    const piramidaCtx = document.getElementById('piramida-chart').getContext('2d');
    new Chart.Chart(piramidaCtx, {
        type: 'bar',
        data: {
            labels: ['0-4', '5-9', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54', '55-59', '60+'],
            datasets: [{
                label: 'Laki-laki',
                data: [320, 345, 365, 380, 375, 325, 315, 300, 280, 245, 210, 170, 552],
                backgroundColor: '#36A2EB'
            }, {
                label: 'Perempuan',
                data: [310, 335, 355, 370, 360, 320, 305, 290, 270, 240, 215, 175, 518],
                backgroundColor: '#FF6384'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: {
                x: {
                    stacked: false,
                }
            }
        }
    });
    
    // Chart for religion distribution (Distribusi Agama)
    const agamaCtx = document.getElementById('agama-chart').getContext('2d');
    new Chart.Chart(agamaCtx, {
        type: 'pie',
        data: {
            labels: ['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'],
            datasets: [{
                data: [94.5, 2.8, 1.9, 0.3, 0.3, 0.1, 0.1],
                backgroundColor: [
                    '#36A2EB',
                    '#FF6384',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
    
    // Chart for education level (Tingkat Pendidikan)
    const pendidikanCtx = document.getElementById('pendidikan-chart').getContext('2d');
    new Chart.Chart(pendidikanCtx, {
        type: 'bar',
        data: {
            labels: ['Tidak Sekolah', 'SD/Sederajat', 'SMP/Sederajat', 'SMA/Sederajat', 'Diploma', 'Sarjana', 'Pascasarjana'],
            datasets: [{
                label: 'Tingkat Pendidikan Penduduk',
                data: [8.5, 34.2, 27.5, 22.3, 3.8, 3.2, 0.5],
                backgroundColor: '#3b7a57'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Persentase (%)'
                    }
                }
            }
        }
    });
    
    // Chart for school participation rate (Angka Partisipasi Sekolah)
    const apsCtx = document.getElementById('aps-chart').getContext('2d');
    new Chart.Chart(apsCtx, {
        type: 'line',
        data: {
            labels: ['7-12 th', '13-15 th', '16-18 th', '19-24 th'],
            datasets: [{
                label: 'Angka Partisipasi Sekolah',
                data: [99.2, 95.8, 81.5, 23.7],
                backgroundColor: 'rgba(247, 180, 44, 0.2)',
                borderColor: '#f7b42c',
                tension: 0.2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Persentase (%)'
                    }
                }
            }
        }
    });
    
    // Chart for child nutrition status (Status Gizi Balita)
    const giziCtx = document.getElementById('gizi-chart').getContext('2d');
    new Chart.Chart(giziCtx, {
        type: 'pie',
        data: {
            labels: ['Baik', 'Cukup', 'Kurang', 'Buruk'],
            datasets: [{
                data: [68.5, 24.8, 5.9, 0.8],
                backgroundColor: [
                    '#3b7a57',
                    '#FFCE56',
                    '#FF9F40',
                    '#FF6384'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Chart for basic immunization (Imunisasi Dasar)
    const imunisasiCtx = document.getElementById('imunisasi-chart').getContext('2d');
    new Chart.Chart(imunisasiCtx, {
        type: 'bar',
        data: {
            labels: ['BCG', 'DPT', 'Polio', 'Campak', 'Hepatitis B'],
            datasets: [{
                label: 'Cakupan Imunisasi',
                data: [95.2, 92.8, 93.5, 90.7, 91.2],
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Persentase (%)'
                    }
                }
            }
        }
    });
    
    // Chart for agricultural production (Produksi Pertanian)
    const produksiCtx = document.getElementById('produksi-chart').getContext('2d');
    new Chart.Chart(produksiCtx, {
        type: 'bar',
        data: {
            labels: ['Padi', 'Jagung', 'Kedelai', 'Kopi', 'Sayuran', 'Buah-buahan'],
            datasets: [{
                label: 'Produksi (ton/tahun)',
                data: [850, 320, 75, 65, 290, 185],
                backgroundColor: '#3b7a57'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Produksi (ton/tahun)'
                    }
                }
            }
        }
    });
    
    // Chart for occupation (Mata Pencaharian)
    const pekerjaanCtx = document.getElementById('pekerjaan-chart').getContext('2d');
    new Chart.Chart(pekerjaanCtx, {
        type: 'pie',
        data: {
            labels: ['Petani', 'Buruh Tani', 'PNS/TNI/Polri', 'Pedagang', 'Industri Rumah Tangga', 'Swasta', 'Lainnya'],
            datasets: [{
                data: [42.5, 18.7, 5.3, 12.8, 7.2, 8.9, 4.6],
                backgroundColor: [
                    '#3b7a57',
                    '#5a9775',
                    '#36A2EB',
                    '#FFCE56',
                    '#FF6384',
                    '#9966FF',
                    '#C9CBCF'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                }
            }
        }
    });
}

function populateOverviewData() {
    // Populate overview statistics
    document.getElementById('total-penduduk').textContent = '8,245';
    document.getElementById('luas-wilayah').textContent = '3.25 km²';
    document.getElementById('total-kk').textContent = '2,134';
    document.getElementById('total-dusun').textContent = '5';
}

