# Membuat repository GitHub

Repository baru belum dapat dibuat oleh koneksi GitHub yang tersedia pada sesi ini. Setelah membuat repository kosong dengan nama `komputer-kita` pada akun `Pierr15`, unggah project ini dengan langkah berikut.

1. Buka <https://github.com/new>.
2. Pilih owner `Pierr15`, isi nama repository `komputer-kita`, tentukan visibilitas, lalu buat repository **kosong** (jangan centang penambahan README, `.gitignore`, atau license karena file tersebut sudah tersedia di project).
3. Ekstrak arsip project, buka terminal pada folder `komputer-kita`, lalu jalankan:

```bash
git init -b main
git add .
git commit -m "chore: bootstrap Komputer Kita"
git remote add origin https://github.com/Pierr15/komputer-kita.git
git push -u origin main
```

Jika Git meminta identitas commit, atur `user.name` dan `user.email` lokal sesuai identitas GitHub milikmu terlebih dahulu. Jangan memasukkan token GitHub ke file project atau commit.

Setelah push, GitHub Actions akan menjalankan typecheck, lint, dan build. Status workflow baru dapat dipastikan setelah dependency berhasil di-install pada runner GitHub.
