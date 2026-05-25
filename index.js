const express = require('express');

const app = express();
const PORT = 3000;

// Middleware para receber JSON
app.use(express.json());

// Banco de dados em memória
const listaDeContatos = [];

// ---------------- VALIDACOES ----------------

function validarNome(nome) {
    if (!nome || nome.trim().length < 3) {
        return "O nome precisa ter pelo menos 3 letras.";
    }
    return null;
}

function validarTelefone(telefone) {
    const formatoTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;

    if (!formatoTelefone.test(telefone.trim())) {
        return "Telefone inválido. Digite com o DDD.";
    }

    return null;
}

function validarEmail(email) {
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
        return "E-mail inválido.";
    }

    return null;
}

// ---------------- ROTAS ----------------

// GET -> listar contatos
app.get('/contatos', (req, res) => {
    res.status(200).json({
        total: listaDeContatos.length,
        contatos: listaDeContatos
    });
});

// POST -> cadastrar contato
app.post('/contatos', (req, res) => {
    const { nome, telefone, email } = req.body;

    // Validacoes
    const erroNome = validarNome(nome);
    if (erroNome) {
        return res.status(400).json({
            erro: erroNome
        });
    }

    const erroTelefone = validarTelefone(telefone);
    if (erroTelefone) {
        return res.status(400).json({
            erro: erroTelefone
        });
    }

    const erroEmail = validarEmail(email);
    if (erroEmail) {
        return res.status(400).json({
            erro: erroEmail
        });
    }

    // Criacao do contato
    const novoContato = {
        id: listaDeContatos.length + 1,
        nome: nome.trim(),
        telefone: telefone.trim(),
        email: email.trim().toLowerCase()
    };

    listaDeContatos.push(novoContato);

    res.status(201).json({
        mensagem: "Contato cadastrado com sucesso!",
        contato: novoContato
    });
});

// DELETE -> remover contato
app.delete('/contatos/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = listaDeContatos.findIndex(
        contato => contato.id === id
    );

    if (index === -1) {
        return res.status(404).json({
            erro: "Contato não encontrado."
        });
    }

    const contatoRemovido = listaDeContatos.splice(index, 1);

    res.status(200).json({
        mensagem: "Contato removido com sucesso!",
        contato: contatoRemovido[0]
    });
});

// PUT -> atualizar contato
app.put('/contatos/:id', (req, res) => {
    const id = Number(req.params.id);

    const contato = listaDeContatos.find(
        contato => contato.id === id
    );

    if (!contato) {
        return res.status(404).json({
            erro: "Contato não encontrado."
        });
    }

    const { nome, telefone, email } = req.body;

    // Validacoes
    const erroNome = validarNome(nome);
    if (erroNome) {
        return res.status(400).json({
            erro: erroNome
        });
    }

    const erroTelefone = validarTelefone(telefone);
    if (erroTelefone) {
        return res.status(400).json({
            erro: erroTelefone
        });
    }

    const erroEmail = validarEmail(email);
    if (erroEmail) {
        return res.status(400).json({
            erro: erroEmail
        });
    }

    contato.nome = nome.trim();
    contato.telefone = telefone.trim();
    contato.email = email.trim().toLowerCase();

    res.status(200).json({
        mensagem: "Contato atualizado com sucesso!",
        contato
    });
});

// Inicializacao do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});