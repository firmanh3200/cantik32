document.addEventListener('DOMContentLoaded', () => {
    // Page Navigation System
    const menuItems = document.querySelectorAll('.sidebar-dropdown .dropdown-item');
    const pages = document.querySelectorAll('.page');
    
    function switchToPage(pageId) {
        // Remove active class from all menu items and pages
        // biome-ignore lint/complexity/noForEach: <explanation>
                menuItems.forEach(item => item.classList.remove('active'));
        // biome-ignore lint/complexity/noForEach: <explanation>
        pages.forEach(page => page.classList.remove('active'));
        
        // Find and activate the selected menu item
        const selectedMenuItem = document.querySelector(`.sidebar-dropdown .dropdown-item[data-page="${pageId}"]`);
        if (selectedMenuItem) {
            selectedMenuItem.classList.add('active');
        }
        
        // Find and activate the corresponding page
        const selectedPage = document.getElementById(`${pageId}-page`);
        if (selectedPage) {
            selectedPage.classList.add('active');
            
            // Safely get the current year from year select elements
            const yearSelectElements = [
                document.getElementById('year-select'),
                document.getElementById('economy-year-select'),
                document.getElementById('penduduk-year-select'),
                document.getElementById('pendidikan-year-select'),
                document.getElementById('kesehatan-year-select'),
                document.getElementById('infrastruktur-year-select'),
                document.getElementById('geografi-year-select'),
                document.getElementById('industri-year-select'),
                document.getElementById('perdagangan-year-select'),
                document.getElementById('pertanian-year-select')
            ];
            
            const currentYear = yearSelectElements.find(el => el)?.value || '2024';
            
            // Initialize charts for specific pages
            switch(pageId) {
                case 'dashboard':
                    initializeCharts(currentYear);
                    break;
                case 'statistics':
                    initializeStatisticsCharts();
                    break;
                case 'penduduk':
                    initializePendudukCharts();
                    break;
                case 'pemerintahan':
                    initializePemerintahanCharts();
                    break;
                case 'ekonomi':
                    initializeEkonomiCharts();
                    initializeUMKMTable();
                    break;
                case 'pendidikan':
                    initializePendidikanCharts();
                    break;
                case 'kesehatan':
                    initializeKesehatanCharts();
                    break;
                case 'infrastruktur':
                    initializeInfrastrukturCharts();
                    break;
                case 'geografi':
                    initializeGeografiCharts();
                    break;
                case 'industri':
                    initializeIndustriCharts();
                    break;
                case 'perdagangan':
                    initializePerdaganganCharts();
                    break;
                case 'pertanian':
                    initializePertanianCharts();
                    break;
            }
        }
    }
    
    // Add click event to menu items
    // biome-ignore lint/complexity/noForEach: <explanation>
            menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageId = this.getAttribute('data-page');
            switchToPage(pageId);
            
            // Close dropdown on mobile
            const dropdown = document.querySelector('.sidebar-dropdown');
            const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
            bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
        });
    });
    
    // Initialize with dashboard page
    switchToPage('dashboard');
    
    // Toggle sidebar on mobile
    const sidebarHeader = document.querySelector('.sidebar-header');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarHeader && sidebar) {
        sidebarHeader.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                sidebar.classList.toggle('expanded');
            }
        });
    }
    
    // Initialize DataTable
    const populationTable = $('#populationTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print', 'colvis'
        ],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang cocok",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        }
    });
});

// Initialize all charts
function initializeCharts(year) {
    // Different data sets for different years
    const chartData = {
        2024: {
            population: {
                series: [8442, 8135, 8222, 8332, 8344, 8309, 8235, 8184],
                categories: ['2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']
            },
            ageDistribution: {
                female: [376, 293, 341, 426, 472, 527, 608, 679, 597, 527, 577, 567, 560, 632, 581, 421],
                categories: ['75+', '70-74', '65-69', '60-64', '55-59', '50-54', '45-49', '40-44', '35-39', '30-34', '25-29', '20-24', '15-19', '10-14', '05-09', '00-04']
            },
            education: [7, 6.5, 5.5, 16, 9, 6, 5]
        }
    };

    const data = chartData[year];

    // Clear previous charts
    document.querySelector("#populationChart").innerHTML = '';
    document.querySelector("#ageDistributionChart").innerHTML = '';
    document.querySelector("#educationChart").innerHTML = '';
    
    // Population Chart (Line Chart)
    const populationChartOptions = {
        series: [{
            name: 'Jumlah Penduduk',
            data: data.population.series
        }],
        chart: {
            type: 'line',
            height: 300,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        colors: ['#4e73df'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 3
        },
        grid: {
            borderColor: '#e0e0e0',
            row: {
                colors: ['#f8f9fc', 'transparent'],
                opacity: 0.5
            }
        },
        markers: {
            size: 5
        },
        xaxis: {
            categories: data.population.categories,
            title: {
                text: 'Tahun'
            }
        },
        yaxis: {
            title: {
                text: 'Jumlah Penduduk'
            }
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + " orang"
            }
        },
        title: {
            text: undefined
        }
    };
    const populationChart = new ApexCharts(document.querySelector("#populationChart"), populationChartOptions);
    populationChart.render();

    // Age Distribution Chart (Pyramid Chart)
    const ageDistributionChartOptions = {
        series: [{
            name: 'Jiwa',
            data: data.ageDistribution.female,
            categories: data.ageDistribution.categories
        }],
        chart: {
            type: 'bar',
            height: 300,
            stacked: true
        },
        colors: ['#4e73df', '#e74a3b'],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: '80%'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        grid: {
            xaxis: {
                lines: {
                    show: false
                }
            }
        },
        yaxis: {
            min: 0,
            max: 600,
            title: {
                text: 'Kelompok Umur'
            }
        },
        xaxis: {
            title: {
                text: 'Jumlah Penduduk'
            }
        },
        legend: {
            position: 'bottom'
        }
    };
    const ageDistributionChart = new ApexCharts(document.querySelector("#ageDistributionChart"), ageDistributionChartOptions);
    ageDistributionChart.render();

    // Education Chart (Pie Chart)
    const educationChartOptions = {
        series: data.education,
        chart: {
            type: 'pie',
            height: 300,
            width: '100%'
        },
        labels: ['RW 01', 'RW 02', 'RW 03', 'RW 04', 'RW 05', 'RW 06', 'RW 07'],
        colors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69', '#5a5c96'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px'
                }
            }
        }],
        legend: {
            position: 'bottom',
            fontSize: '12px'
        },
        title: {
            text: undefined
        }
    };
    const educationChart = new ApexCharts(document.querySelector("#educationChart"), educationChartOptions);
    educationChart.render();

    // Unemployment Chart (Radial Bar Chart)
    const unemploymentChartOptions = {
        series: [data.unemploymentRate],
        chart: {
            height: 300,
            type: 'radialBar'
        },
        plotOptions: {
            radialBar: {
                hollow: {
                    size: '70%'
                },
                dataLabels: {
                    show: true,
                    name: {
                        offsetY: -10,
                        show: true,
                        color: '#888',
                        fontSize: '14px'
                    },
                    value: {
                        // biome-ignore lint/style/useTemplate: <explanation>
                        formatter: (val) => val + "%",
                        color: '#111',
                        fontSize: '30px',
                        show: true
                    }
                }
            }
        },
        labels: ['Tingkat Pekerjaan'],
        title: {
            text: undefined
        }
    };
    const unemploymentChart = new ApexCharts(document.querySelector("#unemploymentChart"), unemploymentChartOptions);
    unemploymentChart.render();

    // Income Chart (Donut Chart)
    const incomeChartOptions = {
        series: data.income,
        chart: {
            type: 'donut',
            height: 300,
            width: '100%'
        },
        labels: ['Pertanian', 'Perdagangan', 'Jasa', 'Industri', 'Lainnya'],
        colors: ['#1cc88a', '#4e73df', '#f6c23e', '#e74a3b', '#5a5c69'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px'
                }
            }
        }],
        legend: {
            position: 'bottom',
            fontSize: '12px'
        },
        title: {
            text: undefined
        }
    };
    const incomeChart = new ApexCharts(document.querySelector("#incomeChart"), incomeChartOptions);
    incomeChart.render();

    // Infrastructure Chart (Bar Chart)
    const infrastructureSeries = [];
    const years = Object.keys(data.infrastructure);
    // biome-ignore lint/complexity/noForEach: <explanation>
    years.forEach(yearKey => {
        infrastructureSeries.push({
            name: yearKey,
            data: data.infrastructure[yearKey]
        });
    });

    const infrastructureChartOptions = {
        series: infrastructureSeries,
        chart: {
            type: 'bar',
            height: 300,
            stacked: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        colors: ['#5a5c69', '#4e73df', '#1cc88a', '#f6c23e'],
        xaxis: {
            categories: ['Jalan', 'Air Bersih', 'Listrik', 'Internet', 'Fasilitas Umum'],
        },
        yaxis: {
            title: {
                text: 'Persentase (%)'
            },
            labels: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            },
            min: 0,
            max: 100
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            }
        },
        title: {
            text: undefined
        },
        legend: {
            position: 'top'
        }
    };
    const infrastructureChart = new ApexCharts(document.querySelector("#infrastructureChart"), infrastructureChartOptions);
    infrastructureChart.render();

    // Budget Chart (TreeMap Chart)
    const budgetChartOptions = {
        series: [
            {
                data: data.budget
            }
        ],
        legend: {
            show: false
        },
        chart: {
            height: 300,
            type: 'treemap'
        },
        colors: [
            '#4e73df',
            '#1cc88a',
            '#36b9cc',
            '#f6c23e',
            '#e74a3b',
            '#5a5c69'
        ],
        plotOptions: {
            treemap: {
                distributed: true,
                enableShades: false
            }
        },
        title: {
            text: undefined
        }
    };
    const budgetChart = new ApexCharts(document.querySelector("#budgetChart"), budgetChartOptions);
    budgetChart.render();
    
    // Initialize charts for other pages if the page is active
    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        
        if (pageId === 'penduduk-page') {
            initializePendudukCharts();
        } else if (pageId === 'pendidikan-page') {
            initializePendidikanCharts();
        } else if (pageId === 'kesehatan-page') {
            initializeKesehatanCharts();
        } else if (pageId === 'infrastruktur-page') {
            initializeInfrastrukturCharts();
        } else if (pageId === 'monografi-page') {
            initializeIndustriCharts();
        } else if (pageId === 'publikasi-page') {
            initializePerdaganganCharts();
        } else if (pageId === 'pertanian-page') {
            initializePertanianCharts();
        }
    }
}

// Initialize Statistics Page Charts
function initializeStatisticsCharts() {
    // Density Chart (Area Chart)
    const densityChartOptions = {
        series: [{
            name: 'Kepadatan',
            data: [98, 105, 112, 118, 124]
        }],
        chart: {
            type: 'area',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.3
        },
        colors: ['#4e73df']
    };
    new ApexCharts(document.querySelector("#densityChart"), densityChartOptions).render();
    
    // Gender Ratio Chart (Small Pie)
    const genderRatioChartOptions = {
        series: [102, 100],
        chart: {
            type: 'donut',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        colors: ['#4e73df', '#e74a3b'],
        labels: ['Laki-laki', 'Perempuan'],
        stroke: {
            width: 2
        }
    };
    new ApexCharts(document.querySelector("#genderRatioChart"), genderRatioChartOptions).render();
    
    // Development Index Chart (Line)
    const developmentIndexChartOptions = {
        series: [{
            name: 'IPD',
            data: [0.62, 0.65, 0.68, 0.7, 0.72]
        }],
        chart: {
            type: 'line',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            curve: 'straight',
            width: 3
        },
        colors: ['#1cc88a']
    };
    new ApexCharts(document.querySelector("#developmentIndexChart"), developmentIndexChartOptions).render();
    
    // Birth Rate Chart (Column)
    const birthRateChartOptions = {
        series: [{
            name: 'Rate',
            data: [1.9, 2.0, 2.1, 2.0, 2.1]
        }],
        chart: {
            type: 'bar',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        colors: ['#f6c23e']
    };
    new ApexCharts(document.querySelector("#birthRateChart"), birthRateChartOptions).render();
    
    // Year Comparison Chart (Radar)
    const yearComparisonChartOptions = {
        series: [{
            name: '2023',
            data: [65, 72, 58, 80, 68, 74]
        }, {
            name: '2024',
            data: [72, 80, 65, 86, 75, 82]
        }],
        chart: {
            height: 350,
            type: 'radar'
        },
        colors: ['#4e73df', '#1cc88a'],
        xaxis: {
            categories: ['Ekonomi', 'Pendidikan', 'Kesehatan', 'Infrastruktur', 'Sosial', 'Lingkungan']
        },
        yaxis: {
            max: 100
        }
    };
    new ApexCharts(document.querySelector("#yearComparisonChart"), yearComparisonChartOptions).render();
    
    // Population Projection Chart
    const populationProjectionChartOptions = {
        series: [{
            name: 'Proyeksi',
            data: [3721, 3890, 4050, 4200, 4350]
        }],
        chart: {
            height: 300,
            type: 'line'
        },
        colors: ['#4e73df'],
        xaxis: {
            categories: ['2024', '2025', '2026', '2027', '2028']
        },
        title: {
            text: 'Proyeksi 5 Tahun Ke Depan'
        }
    };
    new ApexCharts(document.querySelector("#populationProjectionChart"), populationProjectionChartOptions).render();
    
    // Marriage Stats Chart
    const marriageStatsChartOptions = {
        series: [65, 20, 10, 5],
        chart: {
            height: 300,
            type: 'pie'
        },
        labels: ['Kawin', 'Belum Kawin', 'Cerai Hidup', 'Cerai Mati'],
        colors: ['#4e73df', '#1cc88a', '#e74a3b', '#f6c23e']
    };
    new ApexCharts(document.querySelector("#marriageStatsChart"), marriageStatsChartOptions).render();
    
    // Welfare Indicators Chart
    const welfareIndicatorsChartOptions = {
        series: [{
            name: 'Indikator',
            data: [78, 85, 72, 65, 88]
        }],
        chart: {
            height: 300,
            type: 'bar'
        },
        plotOptions: {
            bar: {
                distributed: true,
                borderRadius: 5
            }
        },
        colors: ['#4e73df', '#1cc88a', '#e74a3b', '#f6c23e', '#36b9cc'],
        xaxis: {
            categories: ['Perumahan', 'Sanitasi', 'Air Bersih', 'Listrik', 'Akses Jalan']
        }
    };
    new ApexCharts(document.querySelector("#welfareIndicatorsChart"), welfareIndicatorsChartOptions).render();
    
    // Education Income Chart
    const educationIncomeChartOptions = {
        series: [{
            name: 'Pendapatan Rata-rata (Rp)',
            data: [1500000, 2000000, 2800000, 3500000, 5000000, 7000000]
        }],
        chart: {
            height: 300,
            type: 'bar'
        },
        colors: ['#4e73df'],
        xaxis: {
            categories: ['Tidak Sekolah', 'SD', 'SMP', 'SMA', 'D3/S1', 'S2/S3']
        }
    };
    new ApexCharts(document.querySelector("#educationIncomeChart"), educationIncomeChartOptions).render();
}

// Initialize Pemerintahan Page Charts
function initializePemerintahanCharts() {
    // Organizational Chart
    const orgChartContainer = document.getElementById('orgChart');
    orgChartContainer.innerHTML = `
        <div class="org-chart">
            <div class="org-box org-head">
                <h4>Kepala Desa</h4>
                <p>Ahmad Sutanto</p>
            </div>
            <div class="org-level">
                <div class="org-box">
                    <h4>Sekretaris Desa</h4>
                    <p>Siti Rahayu</p>
                </div>
            </div>
            <div class="org-level">
                <div class="org-box">
                    <h4>Kaur Keuangan</h4>
                    <p>Dodi Prakoso</p>
                </div>
                <div class="org-box">
                    <h4>Kaur Perencanaan</h4>
                    <p>Nina Wati</p>
                </div>
                <div class="org-box">
                    <h4>Kaur Umum</h4>
                    <p>Budi Santoso</p>
                </div>
            </div>
            <div class="org-level">
                <div class="org-box">
                    <h4>Kasi Pemerintahan</h4>
                    <p>Hendro Wijaya</p>
                </div>
                <div class="org-box">
                    <h4>Kasi Kesejahteraan</h4>
                    <p>Rina Anggraini</p>
                </div>
                <div class="org-box">
                    <h4>Kasi Pelayanan</h4>
                    <p>Irfan Hakim</p>
                </div>
            </div>
        </div>
    `;
    
    // Add CSS for org chart
    const style = document.createElement('style');
    style.textContent = `
        .org-chart {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 30px;
            padding: 20px;
            min-width: 800px;
        }
        .org-level {
            display: flex;
            gap: 30px;
            width: 100%;
            justify-content: center;
        }
        .org-box {
            background-color: var(--primary-color);
            color: white;
            padding: 15px;
            border-radius: 8px;
            min-width: 200px;
            text-align: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .org-box h4 {
            margin: 0 0 8px 0;
            font-size: 14px;
            font-weight: 600;
        }
        .org-box p {
            margin: 0;
            font-size: 13px;
        }
        .org-head {
            background-color: var(--dark-color);
        }
    `;
    document.head.appendChild(style);
    
    // Program Prioritas Chart
    const programPrioritasChartOptions = {
        series: [{
            data: [78, 65, 82, 55, 70]
        }],
        chart: {
            type: 'bar',
            height: 300
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                distributed: true
            }
        },
        colors: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc'],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Pembangunan Jalan', 'Revitalisasi Pasar', 'Irigasi', 'Renovasi Sekolah', 'Posyandu'],
            labels: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            }
        }
    };
    new ApexCharts(document.querySelector("#programPrioritasChart"), programPrioritasChartOptions).render();
    
    // Anggaran vs Realisasi Chart
    const anggaranRealisasiChartOptions = {
        series: [{
            name: 'Anggaran',
            data: [300, 450, 200, 150, 100, 80]
        }, {
            name: 'Realisasi',
            data: [280, 420, 190, 140, 90, 70]
        }],
        chart: {
            type: 'bar',
            height: 300,
            stacked: false
        },
        colors: ['#4e73df', '#1cc88a'],
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: ['Infrastruktur', 'Pendidikan', 'Kesehatan', 'Sosial', 'Administrasi', 'Lainnya']
        },
        yaxis: {
            title: {
                text: 'Juta Rupiah'
            }
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => "Rp " + val + " juta"
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top'
        }
    };
    new ApexCharts(document.querySelector("#anggaranRealisasiChart"), anggaranRealisasiChartOptions).render();
}

// Initialize Ekonomi Page Charts and Data
function initializeEkonomiCharts() {
    // Mini Sector Charts
    const sectorChartOptions = {
        chart: {
            type: 'area',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.3
        }
    };
    
    // Pertanian Chart
    new ApexCharts(document.querySelector("#pertanianChart"), {
        ...sectorChartOptions,
        series: [{
            name: 'Pertumbuhan',
            data: [41, 42, 44, 45, 45]
        }],
        colors: ['#1cc88a']
    }).render();
    
    // Industri Chart
    new ApexCharts(document.querySelector("#industriChart"), {
        ...sectorChartOptions,
        series: [{
            name: 'Pertumbuhan',
            data: [18, 19, 20, 21, 22]
        }],
        colors: ['#4e73df']
    }).render();
    
    // Perdagangan Chart
    new ApexCharts(document.querySelector("#perdaganganChart"), {
        ...sectorChartOptions,
        series: [{
            name: 'Pertumbuhan',
            data: [15, 16, 17, 18, 18]
        }],
        colors: ['#f6c23e']
    }).render();
    
    // Jasa Chart
    new ApexCharts(document.querySelector("#jasaChart"), {
        ...sectorChartOptions,
        series: [{
            name: 'Pertumbuhan',
            data: [12, 13, 13, 14, 15]
        }],
        colors: ['#e74a3b']
    }).render();
    
    // Perkembangan Ekonomi Chart
    const perkembanganEkonomiChartOptions = {
        series: [
            {
                name: 'PDRB Desa',
                type: 'column',
                data: [6.2, 6.8, 7.5, 8.1, 8.7]
            },
            {
                name: 'Pertumbuhan (%)',
                type: 'line',
                data: [5.2, 6.0, 7.2, 6.8, 8.2]
            }
        ],
        chart: {
            height: 350,
            type: 'line'
        },
        stroke: {
            width: [0, 4]
        },
        title: {
            text: 'PDRB dan Pertumbuhan Ekonomi'
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [1]
        },
        labels: ['2020', '2021', '2022', '2023', '2024'],
        xaxis: {
            type: 'category'
        },
        yaxis: [
            {
                title: {
                    text: 'PDRB (Miliar Rp)',
                },
            },
            {
                opposite: true,
                title: {
                    text: 'Pertumbuhan (%)'
                }
            }
        ],
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#perkembanganEkonomiChart"), perkembanganEkonomiChartOptions).render();
    
    // Distribusi Pendapatan Chart
    const pendapatanDistribusiChartOptions = {
        series: [
            {
                name: '2023',
                data: [20, 35, 25, 15, 5]
            },
            {
                name: '2024',
                data: [15, 30, 30, 20, 5]
            }
        ],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        stroke: {
            width: 1,
            colors: ['#fff']
        },
        xaxis: {
            categories: ['<1 juta', '1-2 juta', '2-3 juta', '3-5 juta', '>5 juta'],
            title: {
                text: 'Kelompok Pendapatan (Rp)'
            }
        },
        yaxis: {
            title: {
                text: 'Persentase Penduduk (%)'
            }
        },
        fill: {
            opacity: 1
        },
        legend: {
            position: 'top'
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#pendapatanDistribusiChart"), pendapatanDistribusiChartOptions).render();
}

// Initialize UMKM Table
function initializeUMKMTable() {
    if ($.fn.DataTable.isDataTable('#umkmTable')) {
        $('#umkmTable').DataTable().destroy();
    }
    
    $('#umkmTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        data: [
            [1, "Tani Makmur", "Pertanian", 12, "Rp 350 juta", "Aktif"],
            [2, "Batik Nusantara", "Kerajinan", 8, "Rp 280 juta", "Aktif"],
            [3, "Warung Sejahtera", "Kuliner", 5, "Rp 180 juta", "Aktif"],
            [4, "Bengkel Jaya", "Jasa", 3, "Rp 120 juta", "Aktif"],
            [5, "Toko Bangunan Abadi", "Perdagangan", 7, "Rp 420 juta", "Aktif"],
            [6, "Jamu Tradisional", "Pengolahan", 4, "Rp 150 juta", "Aktif"],
            [7, "Kreasi Bambu", "Kerajinan", 6, "Rp 200 juta", "Aktif"],
            [8, "Peternakan Sapi", "Peternakan", 5, "Rp 250 juta", "Aktif"],
            [9, "Budidaya Ikan", "Perikanan", 4, "Rp 180 juta", "Aktif"],
            [10, "Tukang Jahit Rapi", "Jasa", 2, "Rp 90 juta", "Aktif"]
        ],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang cocok",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        }
    });
}

// Initialize Penduduk Page Charts
function initializePendudukCharts() {
    // Komposisi Penduduk Chart (Donut)
    const komposisiPendudukChartOptions = {
        series: [48.2, 51.8],
        chart: {
            type: 'donut',
            height: 350
        },
        labels: ['Laki-laki', 'Perempuan'],
        colors: ['#4e73df', '#e74a3b'],
        legend: {
            position: 'bottom'
        },
        dataLabels: {
            // biome-ignore lint/style/useTemplate: <explanation>
            formatter: (val) => val.toFixed(1) + "%"
        }
    };
    new ApexCharts(document.querySelector("#komposisiPendudukChart"), komposisiPendudukChartOptions).render();
    
    // Perkembangan Bulanan Chart (Line)
    const perkembanganBulananChartOptions = {
        series: [{
            name: 'Jumlah Penduduk',
            data: [3542, 3558, 3567, 3579, 3598, 3610, 3625, 3642, 3659, 3678, 3697, 3721]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            }
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        colors: ['#4e73df']
    };
    new ApexCharts(document.querySelector("#perkembanganBulananChart"), perkembanganBulananChartOptions).render();
    
    // Initialize Map Placeholder
    const pendudukMap = document.getElementById('pendudukMap');
    if (pendudukMap) {
        pendudukMap.innerHTML = `
            <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; background: rgba(255,255,255,0.8); border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                <svg width="60" height="60" viewBox="0 0 24 24">
                    <path fill="#4e73df" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 style="margin: 10px 0; font-size: 16px; color: #5a5c69;">Peta Sebaran Penduduk Desa</h3>
                <p style="margin: 0; text-align: center; font-size: 14px; color: #858796;">Peta interaktif sebaran penduduk berdasarkan wilayah desa</p>
            </div>
        `;
    }
}

// Initialize Pendidikan Page Charts
function initializePendidikanCharts() {
    // Tingkat Pendidikan Chart (Pie)
    const tingkatPendidikanChartOptions = {
        series: [1179, 655, 486, 953, 3394, 337, 1097, 83],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Tidak/Belum Sekolah', 'Belum Tamat SD', 'SD', 'SMP', 'SMA', 'Diploma', 'Sarjana', 'S2/S3'],
        colors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#5a5c69'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    new ApexCharts(document.querySelector("#tingkatPendidikanChart"), tingkatPendidikanChartOptions).render();
    
    // Trend Pendidikan Chart (Line)
    const trendPendidikanChartOptions = {
        series: [{
            name: 'Tidak Sekolah',
            data: [15, 14, 12, 10]
        }, {
            name: 'SD',
            data: [30, 28, 25, 22]
        }, {
            name: 'SMP',
            data: [35, 36, 37, 38]
        }, {
            name: 'SMA+',
            data: [20, 22, 26, 30]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [3, 3, 3, 3],
            curve: 'straight',
            dashArray: [0, 0, 0, 0]
        },
        title: {
            text: 'Trend Pendidikan 2021-2024',
            align: 'left'
        },
        legend: {
            // biome-ignore lint/style/useTemplate: <explanation>
            tooltipHoverFormatter: (val, opts) => val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + '%'
        },
        markers: {
            size: 0,
            hover: {
                sizeOffset: 6
            }
        },
        xaxis: {
            categories: ['2021', '2022', '2023', '2024'],
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            }
        },
        grid: {
            borderColor: '#e0e0e0',
        },
        colors: ['#5a5c69', '#f6c23e', '#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#trendPendidikanChart"), trendPendidikanChartOptions).render();
    
    // Rata-rata Nilai Chart (Bar)
    const rataRataNilaiChartOptions = {
        series: [{
            name: 'Rata-rata Nilai',
            data: [75.2, 78.5, 73.8, 82.4, 79.6, 76.3]
        }],
        chart: {
            height: 350,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '55%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Bahasa Indonesia', 'Matematika', 'IPA', 'IPS', 'Bahasa Inggris', 'Kewarganegaraan'],
        },
        yaxis: {
            title: {
                text: 'Rata-rata Nilai'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: (val) => val
            }
        },
        colors: ['#4e73df']
    };
    new ApexCharts(document.querySelector("#rataRataNilaiChart"), rataRataNilaiChartOptions).render();
}

// Initialize Kesehatan Page Charts
function initializeKesehatanCharts() {
    // Mini Charts for Kesehatan Stats
    const miniChartOptions = {
        chart: {
            type: 'area',
            height: 100,
            sparkline: {
                enabled: true
            }
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        fill: {
            opacity: 0.3
        }
    };
    
    // Harapan Hidup Chart
    new ApexCharts(document.querySelector("#harapanHidupChart"), {
        ...miniChartOptions,
        series: [{
            name: 'Pasangan Usia Subur',
            data: [850, 595, 674, 655]
        }],
        colors: ['#1cc88a']
    }).render();
    
    // Kematian Bayi Chart
    new ApexCharts(document.querySelector("#kematianBayiChart"), {
        ...miniChartOptions,
        series: [{
            name: 'Peserta KB Aktif',
            data: [486, 426, 399, 375]
        }],
        colors: ['#e74a3b']
    }).render();
    
    // Cakupan Vaksinasi Chart
    new ApexCharts(document.querySelector("#cakupanVaksinasiChart"), {
        ...miniChartOptions,
        series: [{
            name: 'Praktek Dokter',
            data: [7, 7]
        }],
        colors: ['#4e73df']
    }).render();
    
    // Angka Kesakitan Chart
    new ApexCharts(document.querySelector("#angkaKesakitanChart"), {
        ...miniChartOptions,
        series: [{
            name: 'Praktek Bidan',
            data: [1, 1]
        }],
        colors: ['#f6c23e']
    }).render();
    
    // Alat Kontrasepsi (Bar)
    const polaPenyakitChartOptions = {
        series: [{
            name: '2022',
            data: [141, 50, 170, 16, 1, 14, 5, 2, 0]
        }, {
            name: '2023',
            data: [110, 42, 195, 11, 0, 11, 3, 0, 3]
        }],
        chart: {
            type: 'bar',
            height: 350,
            stacked: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['IUD', 'PIL', 'Suntik', 'Kondom', 'MOP', 'MOW', 'Implan', 'Intravag', 'Tradisional'],
        },
        yaxis: {
            title: {
                text: 'Jumlah Peserta KB Aktif'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + " kasus"
            }
        },
        legend: {
            position: 'top'
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#polaPenyakitChart"), polaPenyakitChartOptions).render();
    
    // Program Kesehatan Chart (Radial)
    const programKesehatanChartOptions = {
        series: [85, 92, 78, 88, 95],
        chart: {
            height: 350,
            type: 'radialBar',
        },
        plotOptions: {
            radialBar: {
                dataLabels: {
                    name: {
                        fontSize: '22px',
                    },
                    value: {
                        fontSize: '16px',
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        formatter: (w) => '87.6%'
                    }
                }
            }
        },
        labels: ['Imunisasi', 'Kesehatan Ibu', 'Gizi', 'Sanitasi', 'Kesehatan Lansia'],
        colors: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#36b9cc']
    };
    new ApexCharts(document.querySelector("#programKesehatanChart"), programKesehatanChartOptions).render();
}

// Initialize Infrastruktur Page Charts
function initializeInfrastrukturCharts() {
    // Cakupan Infrastruktur Chart (Radar)
    const cakupanInfrastrukturChartOptions = {
        series: [{
            name: '2023',
            data: [80, 85, 95, 75, 90]
        }, {
            name: '2024',
            data: [89, 92, 98, 85, 95]
        }],
        chart: {
            height: 350,
            type: 'radar'
        },
        title: {
            text: 'Cakupan Infrastruktur Dasar'
        },
        xaxis: {
            categories: ['Jalan', 'Air Bersih', 'Listrik', 'Internet', 'Sanitasi']
        },
        yaxis: {
            show: false,
            min: 0,
            max: 100
        },
        fill: {
            opacity: 0.4
        },
        markers: {
            size: 4
        },
        legend: {
            position: 'bottom'
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#cakupanInfrastrukturChart"), cakupanInfrastrukturChartOptions).render();
    
    // Map placeholder
    const infrastrukturMap = document.getElementById('infrastrukturMap');
    if (infrastrukturMap) {
        infrastrukturMap.innerHTML = `
            <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; background: rgba(255,255,255,0.8); border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                <svg width="60" height="60" viewBox="0 0 24 24">
                    <path fill="#4e73df" d="M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm0-4H5V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
                </svg>
                <h3 style="margin: 10px 0; font-size: 16px; color: #5a5c69;">Peta Infrastruktur Desa</h3>
                <p style="margin: 0; text-align: center; font-size: 14px; color: #858796;">Peta interaktif sebaran infrastruktur desa</p>
            </div>
        `;
    }
    
    // Pembangunan Tahunan Chart (Column)
    const pembangunanTahunanChartOptions = {
        series: [{
            name: 'Anggaran (Juta Rp)',
            data: [450, 650, 850, 1050, 1250]
        }, {
            name: 'Realisasi (%)',
            type: 'line',
            data: [92, 90, 95, 93, 97]
        }],
        chart: {
            height: 350,
            type: 'line',
            stacked: false
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: [1, 4]
        },
        xaxis: {
            categories: ['2020', '2021', '2022', '2023', '2024'],
        },
        yaxis: [{
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: '#4e73df'
            },
            labels: {
                style: {
                    colors: '#4e73df',
                }
            },
            title: {
                text: "Anggaran (Juta Rp)",
                style: {
                    color: '#4e73df',
                }
            }
        }, {
            opposite: true,
            axisTicks: {
                show: true,
            },
            axisBorder: {
                show: true,
                color: '#1cc88a'
            },
            labels: {
                style: {
                    colors: '#1cc88a',
                },
            },
            title: {
                text: "Realisasi (%)",
                style: {
                    color: '#1cc88a',
                }
            },
            min: 80,
            max: 100
        }],
        tooltip: {
            y: [{
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => "Rp " + val + " juta"
            }, {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            }]
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#pembangunanTahunanChart"), pembangunanTahunanChartOptions).render();
}

// Initialize Geografi Page Charts
function initializeGeografiCharts() {
    // Curah Hujan Chart (Column)
    const curahHujanChartOptions = {
        series: [{
            name: 'Curah Hujan (mm)',
            data: [335, 264, 272, 215, 71, 156, 30, 53, 136, 81, 512, 90]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false
            }
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
            title: {
                text: 'Bulan'
            }
        },
        yaxis: {
            title: {
                text: 'Curah Hujan (mm)'
            }
        },
        colors: ['#36b9cc']
    };
    new ApexCharts(document.querySelector("#curahHujanChart"), curahHujanChartOptions).render();

    // Suhu Rata-rata Chart (Line)
    const suhuRataRataChartOptions = {
        series: [{
            name: 'Suhu (°C)',
            data: [24.3, 24.4, 24.3, 25, 25.3, 24.3, 23.8, 24.5, 24.9, 25.6, 23.9, 24.6]
        }],
        chart: {
            type: 'line',
            height: 350
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'],
            title: {
                text: 'Bulan'
            }
        },
        yaxis: {
            title: {
                text: 'Suhu (°C)'
            }
        },
        colors: ['#f6c23e']
    };
    new ApexCharts(document.querySelector("#suhuRataRataChart"), suhuRataRataChartOptions).render();

    // Initialize Topografi Map Placeholder
    const topografiMap = document.getElementById('topografiMap');
    if (topografiMap) {
        topografiMap.innerHTML = `
            <div style="position: absolute; top: 20px; left: 20px; right: 20px; bottom: 20px; background: rgba(255,255,255,0.8); border-radius: 5px; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 20px;">
                <svg width="60" height="60" viewBox="0 0 24 24">
                    <path fill="#4e73df" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <h3 style="margin: 10px 0; font-size: 16px; color: #5a5c69;">Peta Topografi Desa</h3>
                <p style="margin: 0; text-align: center; font-size: 14px; color: #858796;">Peta interaktif topografi wilayah desa</p>
            </div>
        `;
    }
}

// Initialize Industri Page Charts
function initializeIndustriCharts() {
    // Sektor Industri Distribution Chart (Pie)
    const sektorIndustriChartOptions = {
        series: [35, 25, 20, 12, 8],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Pengolahan Pangan', 'Kerajinan', 'Tekstil', 'Elektronik', 'Lainnya'],
        colors: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    new ApexCharts(document.querySelector("#sektorIndustriChart"), sektorIndustriChartOptions).render();

    // Pertumbuhan Industri Chart (Line)
    const pertumbuhanIndustriChartOptions = {
        series: [{
            name: 'Jumlah Unit Usaha',
            data: [25, 30, 35, 37, 42]
        }, {
            name: 'Nilai Produksi (Miliar Rp)',
            data: [5.5, 6.8, 8.2, 9.5, 11.2]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [3, 3]
        },
        title: {
            text: 'Pertumbuhan Sektor Industri',
            align: 'left'
        },
        xaxis: {
            categories: ['2020', '2021', '2022', '2023', '2024']
        },
        yaxis: [{
            title: {
                text: 'Jumlah Unit Usaha'
            }
        }, {
            opposite: true,
            title: {
                text: 'Nilai Produksi (Miliar Rp)'
            }
        }],
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#pertumbuhanIndustriChart"), pertumbuhanIndustriChartOptions).render();

    // Tenaga Kerja Industri Chart (Bar)
    const tenagaKerjaIndustriChartOptions = {
        series: [{
            name: '2023',
            data: [150, 120, 90, 60, 40]
        }, {
            name: '2024',
            data: [180, 140, 110, 75, 50]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Pengolahan Pangan', 'Kerajinan', 'Tekstil', 'Elektronik', 'Lainnya']
        },
        yaxis: {
            title: {
                text: 'Jumlah Tenaga Kerja'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + " orang"
            }
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#tenagaKerjaIndustriChart"), tenagaKerjaIndustriChartOptions).render();

    // Initialize Industri Table
    const industriTable = $('#industriTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        data: [
            [1, "Olahan Pangan Mandiri", "Pengolahan Pangan", "Rp 350 juta", "Dusun Utara", "Aktif"],
            [2, "Kerajinan Bambu Sejahtera", "Kerajinan", "Rp 280 juta", "Dusun Timur", "Aktif"],
            [3, "Batik Tradisional", "Tekstil", "Rp 420 juta", "Dusun Selatan", "Aktif"],
            [4, "Elektronik Lokal", "Elektronik", "Rp 190 juta", "Dusun Barat", "Aktif"],
            [5, "Industri Rumah Tangga Kreatif", "Lainnya", "Rp 150 juta", "Pusat Desa", "Aktif"]
        ],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang cocok",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        }
    });
}

function initializePerdaganganCharts() {
    // Distribusi Komoditas Chart (Pie)
    const komoditasChartOptions = {
        series: [35, 25, 20, 12, 8],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Pertanian', 'Perikanan', 'Peternakan', 'Kerajinan', 'Lainnya'],
        colors: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#5a5c69'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    new ApexCharts(document.querySelector("#komoditasChart"), komoditasChartOptions).render();

    // Perkembangan Usaha Dagang Chart (Line)
    const usahaDagangChartOptions = {
        series: [{
            name: 'Jumlah Usaha',
            data: [25, 30, 35, 37, 42]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Pertumbuhan Usaha Dagang',
            align: 'left'
        },
        xaxis: {
            categories: ['2020', '2021', '2022', '2023', '2024']
        },
        colors: ['#4e73df']
    };
    new ApexCharts(document.querySelector("#usahaDagangChart"), usahaDagangChartOptions).render();

    // Sektor Perdagangan Chart (Bar)
    const sektorPerdaganganChartOptions = {
        series: [{
            name: '2023',
            data: [45, 35, 25, 15, 10]
        }, {
            name: '2024',
            data: [50, 40, 30, 20, 15]
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded'
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Retail', 'Kuliner', 'Jasa', 'Online', 'Lainnya']
        },
        yaxis: {
            title: {
                text: 'Persentase Transaksi'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                // biome-ignore lint/style/useTemplate: <explanation>
                formatter: (val) => val + "%"
            }
        },
        colors: ['#4e73df', '#1cc88a']
    };
    new ApexCharts(document.querySelector("#sektorPerdaganganChart"), sektorPerdaganganChartOptions).render();

    // Initialize Perdagangan Table
    const perdaganganTable = $('#perdaganganTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        data: [
            [1, "Warung Berkah", "Retail", "Rp 350 juta", "Dusun Utara", "Aktif"],
            [2, "Resto Keluarga", "Kuliner", "Rp 420 juta", "Dusun Timur", "Aktif"],
            [3, "Jasa Bengkel", "Servis", "Rp 280 juta", "Dusun Selatan", "Aktif"],
            [4, "Toko Online", "E-commerce", "Rp 190 juta", "Dusun Barat", "Aktif"],
            [5, "Koperasi Desa", "Multipihak", "Rp 500 juta", "Pusat Desa", "Aktif"]
        ],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang cocok",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        }
    });
}

function initializePertanianCharts() {
    // Jenis Tanaman Chart (Pie)
    const jenisTanamanChartOptions = {
        series: [42, 25, 18, 10, 5],
        chart: {
            type: 'pie',
            height: 350
        },
        labels: ['Padi', 'Jagung', 'Kedelai', 'Hortikultura', 'Lainnya'],
        colors: ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b', '#5a5c69'],
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    };
    new ApexCharts(document.querySelector("#jenisTanamanChart"), jenisTanamanChartOptions).render();

    // Hasil Panen Chart (Line)
    const hasilPanenChartOptions = {
        series: [{
            name: 'Padi (ton)',
            data: [950, 1050, 1150, 1200, 1250]
        }, {
            name: 'Jagung (ton)',
            data: [580, 610, 640, 670, 700]
        }, {
            name: 'Kedelai (ton)',
            data: [320, 350, 370, 390, 420]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: [3, 3, 3]
        },
        title: {
            text: 'Produksi Tanaman Utama',
            align: 'left'
        },
        xaxis: {
            categories: ['2020', '2021', '2022', '2023', '2024']
        },
        colors: ['#4e73df', '#1cc88a', '#f6c23e']
    };
    new ApexCharts(document.querySelector("#hasilPanenChart"), hasilPanenChartOptions).render();
    
    // Program Pertanian Chart (Radar)
    const programPertanianChartOptions = {
        series: [{
            name: 'Capaian (%)',
            data: [85, 78, 92, 65, 70]
        }],
        chart: {
            height: 350,
            type: 'radar'
        },
        title: {
            text: 'Capaian Program Pertanian'
        },
        xaxis: {
            categories: ['Peningkatan Hasil', 'Alsintan', 'Pelatihan', 'Irigasi', 'Akses Pasar']
        },
        colors: ['#4e73df']
    };
    new ApexCharts(document.querySelector("#programPertanianChart"), programPertanianChartOptions).render();
    
    // Initialize Pertanian Table
    if ($.fn.DataTable.isDataTable('#pertanianTable')) {
        $('#pertanianTable').DataTable().destroy();
    }
    
    $('#pertanianTable').DataTable({
        responsive: true,
        dom: 'Bfrtip',
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        language: {
            search: "Cari:",
            lengthMenu: "Tampilkan _MENU_ data per halaman",
            zeroRecords: "Tidak ada data yang cocok",
            info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
            infoEmpty: "Tidak ada data yang tersedia",
            infoFiltered: "(difilter dari _MAX_ total data)",
            paginate: {
                first: "Pertama",
                last: "Terakhir",
                next: "Selanjutnya",
                previous: "Sebelumnya"
            }
        }
    });
}
