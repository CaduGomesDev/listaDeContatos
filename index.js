const readline = require('readline');

// Configuração para entrada e saída no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Array que vai funcionar como o nosso banco de dados em memória
const listaDeContatos = [];

// --- FUNÇÕES DE VALIDAÇÃO ---

function validarNome(nome) {
    if (!nome || nome.trim().length < 3) {
        return "O nome precisa ter pelo menos 3 letras.";
    }
    return null;
}

function validarTelefone(telefone) {
    // Aceita números limpos ou formatados (Ex: 42999998888 ou (42) 99999-8888)
    const formatoTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
    if (!formatoTelefone.test(telefone.trim())) {
        return "Telefone inválido. Digite com o DDD (ex: 42999998888).";
    }
    return null;
}

function validarEmail(email) {
    // Validação padrão de estrutura de e-mail (texto + @ + texto + .com)
    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formatoEmail.test(email.trim())) {
        return "E-mail inválido. Digite um formato correto (ex: nome@email.com).";
    }
    return null;
}

// --- FLUXO PRINCIPAL DO SISTEMA ---

function mostrarMenu() {
    console.log("\n--- SISTEMA DE CONTATOS ---");
    console.log("1 - Cadastrar Novo Contato");
    console.log("2 - Listar Todos os Contatos");
    console.log("3 - Sair do Programa");
    console.log("---------------------------");

    rl.question("Escolha uma opcao: ", (opcao) => {
        if (opcao.trim() === '1') {
            cadastrarContato();
        } else if (opcao.trim() === '2') {
            mostrarContatos();
        } else if (opcao.trim() === '3') {
            console.log("\nEncerrando o sistema...");
            rl.close();
        } else {
            console.log("\nOpcao incorreta! Escolha 1, 2 ou 3.");
            mostrarMenu();
        }
    });
}

function cadastrarContato() {
    console.log("\n[ NOVO CADASTRO ]");

    rl.question("Digite o nome: ", (nome) => {
        const erroNome = validarNome(nome);
        if (erroNome) {
            console.log("Erro:", erroNome);
            return mostrarMenu(); // Retorna ao menu caso dê erro
        }

        rl.question("Digite o telefone: ", (telefone) => {
            const erroTelefone = validarTelefone(telefone);
            if (erroTelefone) {
                console.log("Erro:", erroTelefone);
                return mostrarMenu();
            }

            rl.question("Digite o e-mail: ", (email) => {
                const erroEmail = validarEmail(email);
                if (erroEmail) {
                    console.log("Erro:", erroEmail);
                    return mostrarMenu();
                }

                // Insere o objeto com os dados validados dentro do array
                listaDeContatos.push({
                    nome: nome.trim(),
                    telefone: telefone.trim(),
                    email: email.trim().toLowerCase()
                });

                console.log("\nContato salvo com sucesso!");
                mostrarMenu();
            });
        });
    });
}

function mostrarContatos() {
    console.log("\n[ LISTA DE CONTATOS CADASTRADOS ]");
    
    if (listaDeContatos.length === 0) {
        console.log("Nenhum contato foi salvo ainda.");
    } else {
        listaDeContatos.forEach((contato, i) => {
            console.log(`${i + 1}. Nome: ${contato.nome} | Tel: ${contato.telefone} | E-mail: ${contato.email}`);
        });
    }
    mostrarMenu();
}

// Inicialização do script
mostrarMenu();