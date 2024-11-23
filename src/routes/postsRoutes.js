import express from "express"; // Importa o framework Express para criar a aplicação web
import multer from "multer"; // Importa o middleware Multer para upload de arquivos
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200 
}

// Importa funções controladoras de posts do arquivo postsController.js
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";

// Configura o armazenamento de arquivos para o Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) { // Define a pasta de destino para os uploads
    cb(null, 'uploads/'); // Define o caminho como 'uploads/'
  },
  filename: function (req, file, cb) { // Define o nome do arquivo
    cb(null, file.originalname); // Utiliza o nome original do arquivo enviado
  }
});

// Cria uma instância do middleware Multer com as configurações de armazenamento
const upload = multer({ dest: "./uploads", storage }); // Define a pasta de destino e o armazenamento

// Função para definir as rotas da aplicação
const routes = (app) => {
  // Habilita o parser JSON para lidar com requisições com corpo em formato JSON
  app.use(express.json()); 
  app.use(cors(corsOptions));
  // Rota GET para listar todos os posts (tratada pela função listarPosts)
  app.get("/posts", listarPosts);

  // Rota POST para criar um novo post (tratada pela função postarNovoPost)
  app.post("/posts", postarNovoPost);

  // Rota POST para upload de imagem (usa o middleware 'upload' e a função uploadImagem)
  app.post("/upload", upload.single("imagem"), uploadImagem); // Aceita um arquivo 'imagem'

  app.put("/upload/:id", atualizarNovoPost)
};

export default routes; // Exporta a função 'routes' para ser usada em outros arquivos