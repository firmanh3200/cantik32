$(document).ready(() => {
    // URL API
    const apiUrl = 'https://opendata.bandung.go.id/api/bigdata/kecamatan_regol/jmlh-rlss-nggrn-pppk-brdsrkn-klrhn-d-kcmtn-rgl-kt-bndng?sort=id%3Aasc&page=1&per_page=100&where=%7B%22bps_kode_desa_kelurahan%22%3A%5B%223273060007%22%5D%7D&where_or=%7B%7D';

    // Fungsi untuk mengambil data dari API
    function fetchData() {
      return $.ajax({
        url: apiUrl,
        method: 'GET'
      });
    }

    function createChart(data) {
        // 1. Kelompokkan data berdasarkan tahun
        const seriesData = Object.entries(
          data.reduce((acc, item) => {
            const tahun = item.tahun;
            if (!acc[tahun]) {
              acc[tahun] = [];
            }
            acc[tahun].push(item);
            return acc;
          }, {})
        ).map(([tahun, items]) => {
          // Urutkan items agar kategori konsisten
          items.sort((a, b) => (a.lkk + a.jenis_anggaran).localeCompare(b.lkk + b.jenis_anggaran));
          return {
            name: tahun,
            data: items.map(item => item.jumlah_anggaran),
          };
        });
      
        // 2. Buat kategori (lkk + jenis_anggaran) - Pastikan kategori diurutkan sama
        // biome-ignore lint/style/useTemplate: <explanation>
                      const categories = data.map(item => item.lkk + " - " + item.jenis_anggaran);
        // Pastikan kategori unik dan urutannya sama untuk setiap series
        const uniqueCategories = [...new Set(categories)].sort();
      
        // 3. Konfigurasi Chart ApexCharts
        // biome-ignore lint/style/noVar: <explanation>
                      var options = {
          series: seriesData, // Gunakan data yang sudah dikelompokkan
          chart: {
            type: 'bar',
            stacked: true, // Aktifkan stacked chart
            height: 350,
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: uniqueCategories, // Atur kategori
            title: {
              text: 'Nilai (Rupiah)'
            }
          },
          yaxis: {
            title: {
              text: 'LKK - Jenis Anggaran'
            }
          },
          legend: {
            position: 'bottom',
            offsetY: -7
          },
          fill: {
            opacity: 1
          }
        };
      
        // biome-ignore lint/style/noVar: <explanation>
              var chart = new ApexCharts(document.querySelector("#pippk-chart"), options);
        chart.render();
      }
    
    // Fungsi untuk membuat tabel data
    function createDataTable(data) {
      $('#tabel-pippk').DataTable({
        responsive: true,
        data: data,
        length: 5,
        columns: [
          { data: 'tahun'},
          { data: 'lkk'},
          { data: 'jenis_anggaran'},
          { data: 'jumlah_anggaran'}
        ],
        dom: 'Bfrtip', // Menambahkan tombol
        buttons: [
          'copy', 'csv', 'excel', 'pdf', 'print'
        ],
        scrollX: true, // Aktifkan scroll horizontal
        autoWidth: true, // Nonaktifkan auto width
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

    // Panggil fungsi fetchData dan proses data setelah berhasil diambil
    fetchData()
      .done((response) => {
        const data = response.data; // Ambil data dari properti 'data'
        createChart(data);
        createDataTable(data);
      })
      .fail((error) => {
        console.error('Gagal mengambil data:', error);
      });
  });