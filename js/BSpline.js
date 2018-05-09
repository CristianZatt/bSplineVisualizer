function tamanhoObjeto (obj) {
    var tamanho = 0, key
    for (key in obj) {
        if (obj.hasOwnProperty(key)) tamanho++
    }
    return tamanho
};

var BSpline = function(pontos,grau){
    this.pontos = pontos
    this.grau = grau
    this.dimensao = tamanhoObjeto(pontos[0])
    this.baseFunc = this.grauBase3
    this.baseFuncRangeInt = 2
};

BSpline.prototype.seqAt = function(dim){
    var pontos = this.pontos
    var margin = this.grau + 1
    return function(n){
        if(n < margin){
            if(dim == 0){
                return pontos[0].x
            } else {
                return pontos[0].y
            }
        }else if(pontos.length + margin <= n){
            if(dim == 0){
                return pontos[pontos.length-1].x
            } else {
                return pontos[pontos.length-1].y
            }
        }else{
            if(dim == 0){
                return pontos[n-margin].x
            } else {
            return pontos[n-margin].y
            }
        }
    };
};

BSpline.prototype.grauBase3 = function(x){
    if(-1 <= x && x < 0){
        return 2.0/3.0 + (-1.0 - x/2.0)*x*x
    }else if(1 <= x && x <= 2){
        return 4.0/3.0 + x*(-2.0 + (1.0 - x/6.0)*x)
    }else if(-2 <= x && x < -1){
        return 4.0/3.0 + x*(2.0 + (1.0 + x/6.0)*x)
    }else if(0 <= x && x < 1){
        return 2.0/3.0 + (-1.0 + x/2.0)*x*x
    }else{
        return 0
    }
};

BSpline.prototype.getInterpol = function(seq,t){
    var f = this.baseFunc
    var rangeInt = this.baseFuncRangeInt
    var tInt = Math.floor(t)
    var result = 0
    for(var i = tInt - rangeInt;i <= tInt + rangeInt;i++){
        result += seq(i)*f(t-i)
    }
    return result;
};

BSpline.prototype.calcAt = function(t){
    t = t*((this.grau+1)*2+this.pontos.length)
   if(this.dimensao == 2){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t)]
    }else if(this.dimensao == 3){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t),this.getInterpol(this.seqAt(2),t)]
    }else{
        var res = []
        for(var i = 0;i<this.dimensao;i++){
            res.push(this.getInterpol(this.seqAt(i),t))
        }
        return res
    }
};



/*// ---------------------------------------------------------------------
controles
--------------------------------------------------------------------------
*/
//configurações do canvas
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

// define a precisão no desenho da reta
var precisao = 1000

//array de pontos de controle
var pontos = []
//variável indica que o ponto está sendo movido
var move = false

var exibirPontos = true
var exibirPoligonal = true
var exibirCurva = true

//manipulação dos cliques para exibição do desenho
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

jQuery( "#reset" ).click(function() {
    pontos = []
    desenhar()
});

//cria o ponto se clicar fora de outros pontos e faz o desenho
canvas.addEventListener("click", function(e) {
    if(findPoint(e) === false){
        var d = {
            x: "",
            y: ""
        };
        d.x = e.offsetX
        d.y = e.offsetY
        pontos.push(d)
        desenhar()
    }

});

//verifica se o click foi no raio de um ponto
function findPoint(click){
    for(var i = 0; i < pontos.length; i++){
        var v = {
            x: pontos[i].x - click.x,
            y: pontos[i].y - click.y
        };
        if(Math.sqrt(v.x * v.x + v.y * v.y) <= 5){
            return pontos[i]
        }
    }
    return false
}

//se der double click num ponto, exclui ele do array e refaz o desenho
canvas.addEventListener('dblclick', function(e){
    var point = findPoint(e)
    if(point !== false){
        pontos.splice(pontos.indexOf(point), 1)
        desenhar()
    }
});

//se clicou num ponto, habilita a variável move
canvas.addEventListener('mousedown', function(e) {
    move = findPoint(e)
});

//se o ponto estiver clicado, calcula as novas coordenadas e refaz o desenho
canvas.addEventListener('mousemove', function(e) {
    if (move !== false) {
        move.x = e.offsetX
        move.y = e.offsetY
        desenhar()
    }
});

//libera a variável move
canvas.addEventListener('mouseup', function() {
    move = false
    desenhar()
});

//desenha os pontos de acordo com o array pontos que contem as coordenadas
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

function ligarPontos(pontos) {
    for(var z = 0; z < pontos.length - 1; z++){
        ctx.beginPath()
        ctx.moveTo(pontos[z].x, pontos[z].y)
        ctx.lineTo(pontos[z+1].x, pontos[z+1].y)
        ctx.stroke()
        ctx.closePath()
    }
}

//Desenha as retas ligando os pontos registrados
function desenharRetas() {
    ctx.strokeStyle = "white"
    ligarPontos(pontos)
}

//Desenha a curva b-spline
function desenharSpline() {
    ctx.strokeStyle = "yellow"
    if(pontos.length == 0) {
        return;
    }
    var spline = new BSpline(pontos,3)
    ctx.beginPath()
    var antx,anty,x,y
    antx = spline.calcAt(0)[0]
    anty = spline.calcAt(0)[1]
    for(var t = 0;t <= 1;t += (1/precisao)){
        ctx.moveTo(antx,anty)
        var interpol = spline.calcAt(t)
        x = interpol[0]
        y = interpol[1]
        ctx.lineTo(x,y)
        antx = x
        anty = y
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
    if (exibirCurva && !move) {
        desenharSpline()
    }
}
