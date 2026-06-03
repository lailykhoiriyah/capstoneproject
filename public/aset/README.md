# Folder Aset TripWell

Semua gambar dan ikon proyek TripWell disimpan di sini.

## Struktur

```
public/aset/
├── images/          ← Gambar konten (hero background, destinasi, dsb)
│   └── hero-bg.jpg  ← Background gambar hero section
└── icons/           ← Ikon SVG dan PNG
```

## Cara Penggunaan

### Di file CSS:
```css
background: url('/aset/images/hero-bg.jpg') center/cover no-repeat;
```

### Di komponen React/JSX:
```jsx
<img src="/aset/images/nama-gambar.jpg" alt="deskripsi" />
```

## Catatan

- Gambar destinasi saat ini menggunakan URL Unsplash (eksternal).
  Untuk produksi, unduh dan simpan di `/aset/images/destinasi/`.
- Gambar hero background: simpan sebagai `/aset/images/hero-bg.jpg`
- Format yang disarankan: `.webp` untuk performa optimal, `.jpg` sebagai fallback
