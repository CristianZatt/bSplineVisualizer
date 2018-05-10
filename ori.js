function tamanhoObjeto (obj) {
    var tamanho = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) tamanho++;
    }
    return tamanho;
};

var BSpline = function(pontos,grau){
    this.pontos = pontos;
    this.grau = grau;
    this.dimensao = tamanhoObjeto(pontos[0]);
    this.baseFunc = this.grauBase3;
    this.baseFuncRangeInt = 2;
};

BSpline.prototype.seqAt = function(dim){
    var pontos = this.pontos;
    var margin = this.grau + 1;
    return function(n){
        if(n < margin){
            if(dim == 0){
                return pontos[0].x;
            } else {
                return pontos[0].y;
            }
        }else if(pontos.length + margin <= n){
            if(dim == 0){
                return pontos[pontos.length-1].x;
            } else {
                return pontos[pontos.length-1].y;
            }
        }else{
            if(dim == 0){
                return pontos[n-margin].x;
            } else {
            return pontos[n-margin].y;
            }
        }
    };
};

BSpline.prototype.grauBase3 = function(x){
    if(-1 <= x && x < 0){
        return 2.0/3.0 + (-1.0 - x/2.0)*x*x;
    }else if(1 <= x && x <= 2){
        return 4.0/3.0 + x*(-2.0 + (1.0 - x/6.0)*x);
    }else if(-2 <= x && x < -1){
        return 4.0/3.0 + x*(2.0 + (1.0 + x/6.0)*x);
    }else if(0 <= x && x < 1){
        return 2.0/3.0 + (-1.0 + x/2.0)*x*x;
    }else{
        return 0;
    }
};

BSpline.prototype.getInterpol = function(seq,t){
    var f = this.baseFunc;
    var rangeInt = this.baseFuncRangeInt;
    var tInt = Math.floor(t);
    var result = 0;
    for(var i = tInt - rangeInt;i <= tInt + rangeInt;i++){
        result += seq(i)*f(t-i);
    }
    return result;
};

BSpline.prototype.calcAt = function(t){
    t = t*((this.grau+1)*2+this.pontos.length);
   if(this.dimensao == 2){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t)];
    }else if(this.dimensao == 3){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t),this.getInterpol(this.seqAt(2),t)];
    }else{
        var res = [];
        for(var i = 0;i<this.dimensao;i++){
            res.push(this.getInterpol(this.seqAt(i),t));
        }
        return res;
    }
};
