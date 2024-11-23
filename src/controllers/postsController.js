import {
    getTodosPosts,
    criarPost,
    atualizarPost
} from "../models/postsModel.js"; // Importa as funções para obter todos os posts e criar um novo post do modelo de posts
import fs from "fs"; // Importa o módulo do sistema de arquivos para realizar operações com arquivos
import gerarDescricaoComGemini from "../services/geminiService.js";

export async function listarPosts(req, res) {
    // Obtém todos os posts do banco de dados
    const posts = await getTodosPosts();
    // Envia os posts como resposta em formato JSON com status 200 (sucesso)
    res.status(200).json(posts);
}

export async function postarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição
    const novoPost = req.body;
    // Tenta criar o novo post
    try {
        const postCriado = await criarPost(novoPost);
        // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Imprime o erro no console e envia uma mensagem de erro ao cliente
        console.error(erro.message);
        res.status(500).json({
            "Erro": "Falha na requisição"
        });
    }
}

export async function uploadImagem(req, res) {
    // Cria um objeto com os dados do novo post, incluindo o nome do arquivo da imagem
    const novoPost = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };

    // Tenta criar o novo post e renomear o arquivo da imagem
    try {
        const postCriado = await criarPost(novoPost);
        // Constrói o novo nome do arquivo, usando o ID do post criado
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;
        // Renomeia o arquivo para o novo nome
        fs.renameSync(req.file.path, imagemAtualizada);
        // Envia o post criado como resposta em formato JSON com status 200 (sucesso)
        res.status(200).json(postCriado);
    } catch (erro) {
        // Imprime o erro no console e envia uma mensagem de erro ao cliente
        console.error(erro.message);
        res.status(500).json({
            "Erro": "Falha na requisição"
        });
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`

    try {
        const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imgBuffer);
        const post = {
            imgUrl: urlImagem,
            descricao: descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(postCriado);
    } catch (erro) {
        console.error(erro.message);
        res.status(500).json({
            "Erro": "Falha na requisição"
        });
    }
}