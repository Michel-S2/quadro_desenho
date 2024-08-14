//====================DADOS INICIAIS===========================================================================
//variavel para armazenar o elemento canvas do html
let canvas = document.querySelector('canvas');

//variavel que pega o contexto do canvas
let ctx = canvas.getContext('2d');

//variavel que armazena o elemento do input color
let inputColor = document.querySelector('.inputColor');

//variavel para armazenar os botões de pincel e borracha no html
let ferramentas = document.querySelectorAll('.buttonTool');

//variavel para armazenar os botões de tamanho no html
let botaoTamanho = document.querySelectorAll('.buttonSize');

//variavel que armazenar o botão de limpar o canvas no html
let limpar = document.querySelector('.optionClear');

//variavel para armazenar o botão de salvar o desenho no html
let salvar = document.querySelector('.optionSave');

//variavel para armazenar o tamnho do pincel
let tamanhoPincel = 20;

//variavel que indica qual ferramenta está ativa no momento
let ferramentaAtiva = 'brush';

//variavel que indica se podemos desenhar ou não
let desenhoStart = false;

//variável que armazena o pontoX da página
let mouseX = 0;

//variavel que armazena o pontoY da pagina
let mouseY = 0;

desenhar() //função para iniciar o desenho


//============================EVENTOS DE CLIQUES===============================================================

//pegamos os elementos que tem em ferramentas e adicionamos um evento de clique em cada um
ferramentas.forEach(item => {
    item.addEventListener('click', ferramentaClicada);
})


//pegamos os elementos de tamanhos que tem em botaoTamanho e adicionamos um evento de clique em cada um
botaoTamanho.forEach(item => {
    item.addEventListener('click', tamanhoClicado);
})


//pegamos o elemento que limpa a tela e adicionamos um evento de clique
limpar.addEventListener('click', limparTela);


//pegamos o elemento que salva o desenho e adicionamos o evento de clique nele
salvar.addEventListener('click', salvarDesenho);


//pegamos o input color e adicionamos o evento de mudar de cor
inputColor.addEventListener('change', mudarCor)


//pegamos o elemento canvas e adiconamos o evento de apertar com o mouse
canvas.addEventListener('mousedown', mouseDown);


//pegamos o elemento canvas e adiconamos o evento de mover com o mouse
canvas.addEventListener('mousemove', mouseMove);


//pegamos o elemento canvas e adiconamos o evento de soltar o botão do mouse
canvas.addEventListener('mouseup', mouseUp);


//==================================FUNÇÕES===============================================================

//função para saber em qual botão de tamanho de pincel clicou e fazer a alteração
function tamanhoClicado(e) {

//cada vez que clicamos em algum botão de tamanho removemos a classe (active) de todos
    botaoTamanho.forEach(item => {
        item.classList.remove('active')
    })

//variavel que armazena o elemento clicado do botao clicado. Esse closest pega o elemento mais proximo que tenha button
    let tamanhoClicado = e.target.closest('button');

//essa variavel armazena o atributo data-size dos nosso botões de tamanhos
    const size = tamanhoClicado.getAttribute('data-size');

//mudamos a classe para active em cada botão de tamanho que clicamos
    tamanhoClicado.classList.add('active')

//mudamos o tamanho do pinel de acordo com o tamanho que clicamos
    tamanhoPincel = size;
}


//função para saber em qual ferramenta pincel ou borracha iremos usar
function ferramentaClicada(e) {

//variavel que armazena o elemento em que clicamos. Esse closest serve para não pegarmos o span e sim o button
    const ferramentaClicada = e.target.closest('button');

//variavel que armazena o atributo data-action no caso passará brush, eraser ou nulo
    const acao = ferramentaClicada.getAttribute('data-action');

//se a variavel receber um valor que não seja nulo executará esse trecho de codigo
    if(acao) {

//fazemos um forEach em todos os itens de ferramenta no caso 'brush' e 'eraser' quando clicamos neles remove a classe
        ferramentas.forEach(item => {
            item.classList.remove('active')
        })

//ferramenta ativa no momento receberá acao dependendo do clique do usuario vai ser 'eraser' ou 'borracha'
        ferramentaAtiva = acao;

//de acordo com o clique do usuario mudaremos a classe do elemento clicado para active
        ferramentaClicada.classList.add('active');
    }
}



//função para quando o mouse for apertado, ativará o desenho e passará os parametros de X e Y da pagina
function mouseDown(posicao) {
    desenhoStart = true;

//esse canvas.offsetLeft é a distancia do elemento canvas até a parte esquerda da página
    mouseX = posicao.pageX - canvas.offsetLeft;
    mouseY = posicao.pageY - canvas.offsetTop;
}



//função pra quando o mouse for movido
function mouseMove(posicao) {

//quando o modo desenho for ativado entrará nesse laço
    if(desenhoStart) {

//se a ferramenta ativa no momento for brush executará esse laço com a função desenhar e os parametros de X e Y 
        if(ferramentaAtiva == 'brush') {
            desenhar(posicao.pageX, posicao.pageY);
        }
//se a ferramenta ativa no momento for eraser executará esse laço com a função apagar e os parametros de X e Y 
        if(ferramentaAtiva == 'eraser'){
            apagar(posicao.pageX, posicao.pageY)
        }
        
    }
}



//função para quando soltar o botão do mouse, basicamente desativa o modo desenho
function mouseUp() {
    desenhoStart = false;
}



//função para desenhar
function desenhar(x, y) {

//variavel para pegar o ponto x e y da pagina quando chamamos essa função na função de mover
    let pontoX = x - canvas.offsetLeft;
    let pontoY = y - canvas.offsetTop;

//para pararmos de apagar precisamos executar isso
    ctx.globalCompositeOperation = 'source-over';

//para começarmos a desenhar a linha
    ctx.beginPath();

//grossura da linha
    ctx.lineWidth = tamanhoPincel;

//formato da linha, fará a linha com bordas arredondadas
    ctx.lineJoin = 'round';

//mover o cursor
    ctx.moveTo(mouseX, mouseY);

//mova a linha
    ctx.lineTo(pontoX, pontoY);
    
//finalizamos a nossa linha
    ctx.closePath();

//finalizamos
    ctx.stroke();

    mouseX = pontoX; //pasamos os elementos x e y da pagina para termos um desenho continuo
    mouseY = pontoY;
}



//função apagar tem os msm atributos da função desenhar com excessao de um apenas
function apagar(x, y) {
    let pontoX = x - canvas.offsetLeft;
    let pontoY = y - canvas.offsetTop;

//para apagarmos utilizamos essa propriedade toda
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(
        pontoX,
        pontoY,
        tamanhoPincel / 2,
        0,
        2 * Math.PI
    );
    ctx.fill()
    mouseX = pontoX;
    mouseY = pontoY;
}

//função para mudarmos de cor quando clicamos no input color
function mudarCor(e) {

//para mudarmos de cor utilizamos isso e o parametro da cor
    ctx.strokeStyle = e.target.value
}


//função para limpar a tela quando clicamos no botão
function limparTela() {

//para limparmos a tela utilizamos isso
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

//função para salvar o desenho
function salvarDesenho() {

//adicionamos numa variavel o url da imagem do canvas
    let img = canvas.toDataURL("image/png");

//criamos uma variavel com o elemento a
    const link = document.createElement("a");

//pegamos essa variavel com o elemento a e adicionamos a propriedade href e colocamos o img com o url da imagem
    link.href = img;

//depois adicionamos a propriedade download para baixarmos com o nome de 'minha imagem'
    link.download = "minha-imagem.png";

//e por fim colocamos para clicar pra conseguir realizar tudo isso
    link.click();
}