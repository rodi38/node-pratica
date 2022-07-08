//pratica simples com o nodeJS para comprimir uma imagem e rotacionar ela

const sharp = require("sharp");
const compress_images = require("compress-images");
const fs = require('fs');

let path = process.argv[2];
let width = Number(process.argv[3]);
let caminho = './temp/output_resize.jpg';

//

function resize(inputPath, outputPath, width) {

    sharp(inputPath).rotate(-540).resize({ width: width })
        .toFile(outputPath, (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Imagem comprimida");
                // caso não dê erro vai chamar o compress images com o parametros da imagem do temp e o do compressed
                compress(outputPath, "./compressed/");
                
            }
        })
}

function compress(inputPath, outputPath) {

    compress_images(inputPath, outputPath, { compress_force: false, statistic: true, autoupdate: true }, false,
        { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
        { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
        { svg: { engine: "svgo", command: "--multipass" } },
        { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
        (error, completed, statistic) => {
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");


            //usando o filesystem para excluir o arquivo temporario já que não é mais util.
            fs.unlink(inputPath, (error)=> {
                if(error){
                    console.log(error);
                }else{
                    console.log(inputPath, " Apagado");
                }
            })
        }
    );


}

resize(path, caminho, width);