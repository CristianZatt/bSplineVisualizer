var BSpline = function(pontos){
    this.pontos = pontos
};

BSpline.prototype.calcSpline = function(t, i){

    let x1 = pontos[i-3].x
    let x2 = pontos[i-2].x
    let x3 = pontos[i-1].x
    let x4 = pontos[i].x
    let y1 = pontos[i-3].y
    let y2 = pontos[i-2].y
    let y3 = pontos[i-1].y
    let y4 = pontos[i].y

    let bx = (Math.pow((1-t),3)/6)*x1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*x2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*x3+(Math.pow(t,3)/6)*x4
    let by = (Math.pow((1-t),3)/6)*y1+((3*Math.pow(t,3)-(6*Math.pow(t,2))+4)/6)*y2+((-3*Math.pow(t,3)+3*Math.pow(t,2)+3*t+1)/6)*y3+(Math.pow(t,3)/6)*y4
    
    return [bx,by]
}



/*// ---------------------------------------------------------------------
controles
--------------------------------------------------------------------------
*/
//configura o canvas
function resizeCanvas() {
    canvas.width = parseFloat(window.getComputedStyle(canvas).width)
    canvas.height = parseFloat(window.getComputedStyle(canvas).height)
}

var canvas = jQuery('#canvas')[0]
var ctx = canvas.getContext('2d')
resizeCanvas()

jQuery(window).resize(function() {
    resizeCanvas()
    if(pontos.length >0) {
        desenhar()
    }
});

// variavel de precisão entre pontos
var precisao = 1000

//array de pontos
var pontos = []

var exibirPontos = true
var exibirPoligonal = true
var exibirCurva = true

//Evento do botão Pontos
jQuery( "#controle" ).click(function() {
    if(exibirPontos) {
        jQuery(this).removeClass('btn-success')
        jQuery(this).addClass('btn-danger')
    } else {
        jQuery(this).removeClass('btn-danger')
        jQuery(this).addClass('btn-success')
    }
    exibirPontos = !exibirPontos
    desenhar()
});


//Evento do botão Poligonal
jQuery( "#poligonal" ).click(function() {
    if(exibirPoligonal) {
        jQuery(this).removeClass('btn-success')
        jQuery(this).addClass('btn-danger')
    } else {
        jQuery(this).removeClass('btn-danger')
        jQuery(this).addClass('btn-success')
    }
    exibirPoligonal = !exibirPoligonal
    desenhar()
});

//Evento do botão Curva
jQuery( "#curva" ).click(function() {
    if(exibirCurva) {
        jQuery(this).removeClass('btn-success')
        jQuery(this).addClass('btn-danger')
    } else {
        jQuery(this).removeClass('btn-danger')
        jQuery(this).addClass('btn-success')
    }
    exibirCurva = !exibirCurva
    desenhar()
});

//Evento do botão reset
jQuery( "#reset" ).click(function() {
    pontos = []
    desenhar()
});

//Cria o ponto ao clicat na tela (se for um ponto existen te, o exclui)
canvas.addEventListener("click", function(e) {
    var d = {
        x: "",
        y: ""
    };
    d.x = e.offsetX
    d.y = e.offsetY
    pontos.push(d)
    desenhar()
});


//desenha os pontos conforme as coordenadas no array de pontos
function desenharPontos() {
    for(var i = 0; i < pontos.length; i++){
        ctx.beginPath()
        ctx.arc(pontos[i].x, pontos[i].y, 4, 0, 2*Math.PI)
        ctx.fillStyle = "rgb(173,216,230)"
        ctx.strokeStyle = "black"
        ctx.stroke()
        ctx.fill()
    }
}

//desenha as linhas conforme as coordenadas no array de pontos
function desenharRetas() {
    ctx.strokeStyle = "white"
    for(var z = 0; z < pontos.length - 1; z++){
        ctx.beginPath()
        ctx.moveTo(pontos[z].x, pontos[z].y)
        ctx.lineTo(pontos[z+1].x, pontos[z+1].y)
        ctx.stroke()
        ctx.closePath()
    }
}

//Desenha a curva b-spline
function desenharSpline() {
    ctx.strokeStyle = "yellow"
    if(pontos.length == 0) {
        return;
    }
    var spline = new BSpline(pontos)
    ctx.beginPath()
    var antx,anty,x,y
    ctx.moveTo(antx,anty)
    for (let i = 3; i < pontos.length; i++) {
        for(var t = 0;t <= 1;t += (1/precisao)){
        
            var interpol = spline.calcSpline(t,i)
            x = interpol[0]
            y = interpol[1]
            ctx.lineTo(x,y)
            antx = x
            anty = y
        }
    }
    ctx.stroke()
    ctx.closePath()
}

//desenha na tela
function desenhar(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(exibirPontos) {
        desenharPontos()
    }
    if(exibirPoligonal) {
        desenharRetas()
    }
    if (exibirCurva) {
        if(pontos.length >= 4){
            desenharSpline()
        }
    }
}