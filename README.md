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

- You will be given several feature options, select

        Functions : configure a cloud functions directory and its files.
  
- You will be faced with several options, if you don't have a project you can create one or add one from an existing GCP project. If you already have a project in Firebase, choose Use an Existing Project. 
- Then, select the project where you will deploy the API later.
- You will be given two types of language choices in creating APIs using this cloud function, choose Javascript.
- Then you will be asked whether you want to use ESLint or not, please choose accordingly. But, in the creation of our API, we used it.
- Then, install dependencies using NPM by typing y.
- After a while, the installation of the dependencies is complete and write the following command to directly open your IDE to edit the source code

        code . 
  
- Open your terminal and change your directory to functions
  
        cd .\functions\
  
- After that you can install the package you need here with the command
  
        npm install your_package

- You need to generate a ServiceAccountKey.json on service account and assign it in index.js, so that we can get access to the firebase project. 
- Perform routing and handlers for each response in the API, so that when testing it can be seen whether the API can function properly or not.
- Once everything is ready and testing goes well, API can be deployed. But, before it we need to change the "lint" in package.json to
    
        "lint": "eslint"
  
- If it's done, save it and we'll move on to the command promt.
- On command promt, move to your directory that youmade before.
- Go to functions.
  
        cd .\functions\
  
- Then type this command
  
        firebase deploy
  
- It will take a while for the deployment process to complete.
- Go to your firebase console, click on functions and you can see your API with a base url that has the /app suffix. This base url that you can use for your API and use the endpoint that you have created before.
