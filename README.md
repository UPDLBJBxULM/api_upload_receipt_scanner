<h1>BackEnd Services for Petty Easy</h1>

![Cloud Architecture](https://storage.googleapis.com/storage_file_updlbjb/photo/FLOW2.png)

<h2>Step by step untuk recreate backend service dari Petty Cash :</h2>

Pembuatan RESTFULL API untuk Petty Cash menggunakan Node.Js version 18.20.4 dan bisa dibuat telebih dahulu directory untuk tempat pengerjaannya nanti.

Lalu, jika directory sudah dibuat maka buka directory tersebut menggunakan VS Code dan open terminal.
- Ketikkan command berikut untuk melakukan inisiasi project:
  
        npm init --y
- Install beberapa library yang diperlukan dengan command menggunakan berikut:
  
        npm install doteenv express fs googleapis moment multer

        npm install --save-dev nodemon
  
- Setelah install library diatas, buka package.json dan ubah bagian scriptnya untuk bisa menjalankan nodemon nantinya :

        "scripts": {
          "start": "node index.js",
          "dev": "nodemon index.js"
        },
  
- Sesuaikan setiap structure folder dalam directorynya sebagai berikut :

<div align="center">
  <img src="https://storage.googleapis.com/storage_file_updlbjb/photo/structure.png" alt="Cloud Architecture">
</div>

- Copy source code yang ada pada github.

- Sesuaikan isi file .env untuk menyimpan id folder drive dan port yang digunakan

- Sesuaikan isi file service-account-key.json dengan key dari service account yang sudah dikonfigurasikan di GCP yang telah di download

- Sesuaikan isi file service-account-key.json dengan key dari service account yang sudah dikonfigurasikan di GCP

        Functions : configure a cloud functions directory and its files.

