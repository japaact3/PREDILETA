let carrinho = [];

let tamanhoSelecionado = ""

let maxSabores = 1;

let precoSelecionado = 0;

let taxaEntregaAtual = 0;

const bairros = [
    {nome:"Eduardo Gomes", taxa:3},
    {nome:"Rosa Elze", taxa:3},
    {nome:"Rosa Maria", taxa:3},
    {nome:"Madre Paulina", taxa:5}
];

/* DIVISÃO DE SABORES, TRADICIONAI, ESPECIAIS E PREMIUM*/

const sabores = [
    {nome:"Calabresa", categoria:"Tradicional"},
    {nome:"Portuguesa", categoria:"Tradicional"},

    {nome:"Romena", categoria:"Especial"},
    {nome:"4 Queijos", categoria:"Especial"},

    {nome:"Camarão", categoria:"Premium"},
    {nome:"Arretada", categoria:"Premium"}
];

/* PREÇOS POR CATEGORIA */
const precos = {

    Pequena:{
        Tradicional:25,
        Especial:30,
        Premium:35
    },

    Média:{
        Tradicional:30,
        Especial:35,
        Premium:40
    },

    Grande:{
        Tradicional:40,
        Especial:45,
        Premium:50
    }

};


const precosBorda = {

    Pequena: 6,

    Média: 8,

    Grande: 10

};



const bebidas = [

    {nome:"Coca-Cola 1L", preco:8, imagem:"img/coca1l.jfif"},

    {nome:"Guaraná 1L", preco:7, imagem:"img/guarana1l.jfif"},

    {nome:"Fanta 2L", preco:10, imagem:"img/guarana1l.jfif"}

];



/*  FUNÇÃO PARA COBRAR DO SABOR MAIS CARO */

function categoriaMaisCara(categorias){

    const ordem = {
        Tradicional:1,
        Especial:2,
        Premium:3
    };

    let maisCara = categorias[0];

    categorias.forEach(cat => {

        if(ordem[cat] > ordem[maisCara]){
            maisCara = cat;
        }

    });

    return maisCara;
} 



/*  FUNÇÃO PARA CONFIRMAR A PIZZA */

function confirmarPizza(){

    let marcados =
    document.querySelectorAll(
        '#listaSabores input:checked'
    );

    if(marcados.length === 0){

        alert("Escolha pelo menos um sabor");

        return;
    }

    if(marcados.length > maxSabores){

        alert(
            `Você pode escolher no máximo ${maxSabores} sabores`
        );

        return;
    }

    let saboresEscolhidos = [];
    let categorias = [];

    marcados.forEach(item => {

        saboresEscolhidos.push(item.value);

        let sabor =
        sabores.find(
            s => s.nome === item.value
        );

        categorias.push(
            sabor.categoria
        );

    });

    let categoriaCobrada =
    categoriaMaisCara(categorias);

    let preco =
    precos[tamanhoSelecionado][categoriaCobrada];


    let borda =
    document.getElementById("borda").value;

    let valorBorda = 0;

    if(borda !== ""){

        valorBorda =
        precosBorda[tamanhoSelecionado];

        preco += valorBorda;
    }


    carrinho.push({

    tamanho:tamanhoSelecionado,

    sabores:saboresEscolhidos,

    categoria:categoriaCobrada,

    borda:borda,

    valorBorda:valorBorda,

    preco:preco

    });

    atualizarCarrinho();

    document
        .querySelectorAll(
            '#listaSabores input'
        )
        .forEach(c => c.checked = false);


    Swal.fire({
    icon: "success",
    title: "Pizza adicionada!",
    text: "Item adicionado ao carrinho.",
    timer: 1500,
    showConfirmButton: false
    });


    fecharModal();
}





function adicionar(nome, botao){

    let card = botao.parentElement;

    let select =
    card.querySelector(".tamanho");

    let preco =
    parseFloat(select.value);

    let tamanho =
    select.options[
    select.selectedIndex
    ].text;

    carrinho.push({
        nome,
        tamanho,
        preco
    });

    atualizarCarrinho();
}


/*  FUNÇÃO PARA ATUALIZAR O CARRINHO */

function atualizarCarrinho(){

    let lista =
    document.getElementById("itens");

    lista.innerHTML = "";

    let html = ''

    let total = 0;

    carrinho.forEach(item => {

    total += item.preco;

    if(item.tipo === "bebida"){

        html += `
            <div class="item-carrinho">
                <strong>🥤 ${item.nome}</strong>
                <br>
                R$ ${item.preco.toFixed(2)}
            </div>
        `;

    }else{

        html += `
            <div class="item-carrinho">

                <strong>🍕 ${item.tamanho}</strong>

                <br>

                Sabores:
                ${item.sabores.join(" / ")}

                <br>

                Categoria:
                ${item.categoria}

                <br>

                Borda:
                ${item.borda || "Sem borda"}

                <br>

                R$ ${item.preco.toFixed(2)}

            </div>
        `;

    }

    });

    lista.innerHTML = html;












    let totalFinal =
    total + taxaEntregaAtual;

    document.getElementById("total")
    .innerHTML =

    `Total: R$ ${totalFinal.toFixed(2)}`;


    document
    .getElementById("contadorCarrinho")
    .innerText = carrinho.length;


    document
    .getElementById("contadorCarrinho")
    .innerText = carrinho.length;


    let contador =
    document.getElementById(
        "contadorCarrinho"
    );

    contador.innerText =
    carrinho.length;

    contador.style.display =
    carrinho.length > 0
    ? "flex"
    : "none";
}


/* FUNÇÃO PARA ENVIAR OS PEDIDOS PARA O WPP */

function enviarPedido(){

    if(carrinho.length === 0){

        Swal.fire({
        icon: "error",
        title: "Carrinho vazio",
        text: "Adicione pelo menos uma pizza ao carrinho"
        });

        return;
    }

    let tipo =
    document.getElementById("tipoPedido").value;

    let nome =
    document.getElementById("nome").value;

    let telefone =
    document.getElementById("telefone").value;

    let endereco =
    document.getElementById("endereco").value;

    let obs =
    document.getElementById("obs").value;

    if(nome.trim() === ""){

        Swal.fire({
            icon:"warning",
            title:"Nome",
            text:"Preencha o Campo De Nome "
        });

        return;
    }

    if(telefone.trim() === ""){

        Swal.fire({
            icon:"warning",
            title:"telefone",
            text:"preencha o Campo Telefone"
        });

        return;
    }

    if(
        tipo === "Entrega" &&
        endereco.trim() === ""
    ){

        Swal.fire({
            icon:"warning",
            title:"Endereço",
            text:"Informe o Endereço"
        });

        return;
    }


    let formaPagamento =
    document.getElementById(
        "formaPagamento"
    ).value;

    if(formaPagamento === ""){

        Swal.fire({
            icon:"warning",
            title:"Pagamento",
            text:"Selecione uma forma de pagamento"
        });

    return;
    }


    let troco =
    document.getElementById(
        "troco"
    ).value;





    let total = 0;

    let bairro =
    document.getElementById("bairro").value;

    let mensagem =
    "🍕 *NOVO PEDIDO*%0A%0A";

    carrinho.forEach(item => {

        total += item.preco;

        mensagem +=
        `🍕 ${item.tamanho}%0A`;

        mensagem +=
        `Sabores: ${item.sabores.join(" / ")}%0A`;

        mensagem +=
        `Categoria: ${item.categoria}%0A`;

        mensagem +=
        `Borda: ${item.borda || "Sem borda"}%0A`;

        mensagem +=
        `Valor: R$ ${item.preco.toFixed(2)}%0A%0A`;

    });

    mensagem +=
    "━━━━━━━━━━━━━━━%0A";

    mensagem +=
    `📦 Tipo: ${tipo}%0A`;

    mensagem +=
    `👤 Nome: ${nome}%0A`;

    mensagem +=
    `📞 Telefone: ${telefone}%0A`;

    if(tipo === "Entrega"){

    mensagem +=
    `📍 Endereço: ${endereco}%0A`;

    mensagem +=
    `🏘️ Bairro: ${bairro}%0A`;

    mensagem +=
    `🚚 Taxa: R$ ${taxaEntregaAtual.toFixed(2)}%0A`;


    mensagem +=
    `💳 Pagamento: ${formaPagamento}%0A`;

    }


    if(formaPagamento === "Dinheiro"){

        mensagem +=
        `💵 Troco para: R$ ${troco || "Não informado"}%0A`;
    }


    if(item.tipo === "bebida"){

        mensagem +=
        `🥤 ${item.nome}%0A`;

        mensagem +=
        `Valor: R$ ${item.preco.toFixed(2)}%0A%0A`;

    }



    if(obs.trim() !== ""){

        mensagem +=
        `📝 Observações: ${obs}%0A`;
    }

    mensagem +=
    "━━━━━━━━━━━━━━━%0A";

    let totalFinal =
    total + taxaEntregaAtual;

    mensagem +=
    `💰 *TOTAL: R$ ${totalFinal.toFixed(2)}*`;

    window.open(
        `https://wa.me/5579999999999?text=${mensagem}`,
        "_blank"
    );

    Swal.fire({
        icon: "success",
        title: "Pedido enviado!",
        text: "O WhatsApp foi aberto para finalizar seu pedido."
    });

}


/* MODAL DOS SABORES PIZZA  */


function abrirModal(tamanho){

    tamanhoSelecionado = tamanho;

    if(tamanho === "Pequena"){
        maxSabores = 2;
    }

    if(tamanho === "Média"){
        maxSabores = 2;
    }

    if(tamanho === "Grande"){
        maxSabores = 3;
    }

    document.getElementById("limiteSabores").innerText =
        `Escolha até ${maxSabores} sabores`;

    document.getElementById("modal").style.display = "flex";
}


function fecharModal(){

    document.getElementById("modal").style.display = "none";

}



/* funcões de abrir e fechar o carrinho*/

function abrirCarrinho(){

    document
    .getElementById("carrinho")
    .classList.add("ativo");

    document
    .getElementById("overlay")
    .style.display = "block";

    document
    .querySelector(".carrinho-float")
    .style.display = "none";
}

function fecharCarrinho(){

    document
    .getElementById("carrinho")
    .classList.remove("ativo");

    document
    .getElementById("overlay")
    .style.display = "none";

    document
    .querySelector(".carrinho-float")
    .style.display = "flex";
}



function limparCarrinho(){

    Swal.fire({
        title: "Limpar carrinho?",
        text: "Todos os itens serão removidos.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, limpar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ff7b00"
    }).then((result) => {

        if(result.isConfirmed){

            carrinho = [];

            atualizarCarrinho();

            Swal.fire({
                icon: "success",
                title: "Carrinho limpo!",
                timer: 1500,
                showConfirmButton: false
            });

        }

    });

}




/* OPÇÃO ENTREGA OU RETIRADA*/

function selecionarTipo(tipo){

    document
    .getElementById("tipoPedido")
    .value = tipo;

    document
    .getElementById("btnEntrega")
    .classList.remove("ativa");

    document
    .getElementById("btnRetirada")
    .classList.remove("ativa");

    if(tipo === "Entrega"){

        document
        .getElementById("btnEntrega")
        .classList.add("ativa");

        document
        .getElementById("campoEndereco")
        .style.display = "block";

    }else{

        document
        .getElementById("btnRetirada")
        .classList.add("ativa");

        document
        .getElementById("campoEndereco")
        .style.display = "none";
    }
}

function atualizarTaxaEntrega(){

    const nomeBairro =
    document.getElementById("bairro").value;

    const bairro =
    bairros.find(
        b => b.nome === nomeBairro
    );

    taxaEntregaAtual =
    bairro ? bairro.taxa : 0;

    document.getElementById(
        "taxaEntrega"
    ).innerHTML =

    `🚚 Taxa de entrega: R$ ${taxaEntregaAtual.toFixed(2)}`;

    atualizarCarrinho();
}


function carregarBairros(){

    const select =
    document.getElementById("bairro");

    bairros.forEach(bairro => {

        select.innerHTML += `
            <option value="${bairro.nome}">
                ${bairro.nome}
                - R$ ${bairro.taxa.toFixed(2)}
            </option>
        `;

    });

}

carregarBairros();


/* FINÇÃO PARA EXIBIR SABORES  */

function carregarSabores(){

    const lista =
    document.getElementById("listaSabores");

    lista.innerHTML = "";

    const categorias = [

        {
            nome:"Tradicional",
            titulo:"🍕 Tradicionais"
        },

        {
            nome:"Especial",
            titulo:"🧀 Especiais"
        },

        {
            nome:"Premium",
            titulo:"👑 Premium"
        }

    ];

    categorias.forEach(cat => {

        lista.innerHTML += `
            <div class="categoria">

                <h3 class="titulo-categoria">
                    ${cat.titulo}
                </h3>

                <div id="cat-${cat.nome}">
                </div>

            </div>
        `;

        const container =
        document.getElementById(
            `cat-${cat.nome}`
        );

        sabores
        .filter(
            sabor =>
            sabor.categoria === cat.nome
        )
        .forEach(sabor => {

            container.innerHTML += `

                <label
                    class="item-sabor"
                    data-nome="${sabor.nome.toLowerCase()}">

                    <input
                        type="checkbox"
                        value="${sabor.nome}">

                    ${sabor.nome}

                </label>

            `;
        });

    });

}

carregarSabores();


function filtrarSabores(){

    const busca =
    document
    .getElementById("buscarSabor")
    .value
    .toLowerCase();

    const saboresTela =
    document.querySelectorAll(
        ".item-sabor"
    );

    saboresTela.forEach(item => {

        const nome =
        item.dataset.nome;

        if(
            nome.includes(busca)
        ){

            item.style.display =
            "block";

        }else{

            item.style.display =
            "none";
        }

    });

}

let slideAtual = 0;

const slides =
document.querySelectorAll(".slide");

const dots =
document.querySelectorAll(".dot");

function trocarSlide(){

    slides[slideAtual]
    .classList.remove("ativo");

    dots[slideAtual]
    .classList.remove("ativo");

    slideAtual++;

    if(slideAtual >= slides.length){

        slideAtual = 0;
    }

    slides[slideAtual]
    .classList.add("ativo");

    dots[slideAtual]
    .classList.add("ativo");
}

setInterval(trocarSlide, 4000);

/*  FUNÇÕES DE PAGAMENTO */

function mostrarTroco(){

    const pagamento =
    document.getElementById(
        "formaPagamento"
    ).value;

    const campoTroco =
    document.getElementById(
        "campoTroco"
    );

    if(pagamento === "Dinheiro"){

        campoTroco.style.display =
        "block";

    }else{

        campoTroco.style.display =
        "none";
    }

}



/*  FUNÇÕES PARA ADD OS REFRIGERANTES */

function adicionarBebida(
    nome,
    preco
){

    carrinho.push({

        tipo:"bebida",

        nome:nome,

        preco:preco

    });

    atualizarCarrinho();

    Swal.fire({

        icon:"success",

        title:"Bebida adicionada!",

        timer:1200,

        showConfirmButton:false

    });

}

function carregarBebidas(){

    const container =
    document.getElementById("cardsBebidas");

    container.innerHTML = "";

    bebidas.forEach(bebida => {

        container.innerHTML += `

            <div class="card-bebida">

                <img src="${bebida.imagem}">

                <h3>${bebida.nome}</h3>

                <p>R$ ${bebida.preco.toFixed(2)}</p>

                <button onclick="adicionarBebida(
                    '${bebida.nome}',
                    ${bebida.preco}
                )">

                    Adicionar

                </button>

            </div>

        `;

    });

}

carregarBebidas();




/*  BOTÕES DE CATEGORIA DO HEADER */
