const botaoAlterarTema = document.querySelector("#botao-alterar-tema");
const body = document.querySelector("body");
const imagemBotaoTrocaDeTema = document.querySelector('.imagem-botao');
const footer = document.querySelector('footer');
const note = document.querySelector('div#notification');


botaoAlterarTema.addEventListener("click", ()=>{
    const modoAtivo = body.classList.contains("modo-escuro");
    body.classList.toggle("modo-escuro");

    if(modoAtivo){
        imagemBotaoTrocaDeTema.src = "src/imagens/sun.png";
    }else{
        imagemBotaoTrocaDeTema.src = "src/imagens/moon.png";
    }
    
});
window.addEventListener("scroll", ()=>{
    note.classList.toggle("sticky", window.scrollY < 100);
    footer.classList.toggle("sticky", window.scrollY < 100);
   
});