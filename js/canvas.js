
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var divCanvas = document.querySelector('.area__canvas');
var spanMouseX = document.getElementById('mouseX');
var spanMouseY = document.getElementById('mouseY');
var spanPointX = document.getElementById('pointX');
var spanPointY = document.getElementById('pointY');
var spanA = document.getElementById('A');
var spanB = document.getElementById('B');
var spanC = document.getElementById('C');
canvas.width = divCanvas.offsetWidth;
canvas.height = divCanvas.offsetHeight;
var btnsFunc = document.querySelectorAll(".btn-func");
var btnsFuncParent = document.querySelector('.area__func-btns');
var btnsObj = document.querySelectorAll(".btn-obj");
var btnsObjParent = document.querySelector('.area__obj-btns');
var btnsSystemCoord = document.querySelectorAll(".btn-xy");
var btnsSystemCoordParent = document.querySelector('.coord_system__buttons');
var bgCanvas = document.querySelector('.area__canvas');
var btnSwitch = document.querySelector('.switch-btn');
var btnOperation = document.getElementById('btn-operation');
var btnCoordMenu = document.getElementById('btn_coord-menu');
var localCoordX, localCoordY;
var isLocalSystem = false;
function inRad(num) { return num * Math.PI / 180; }
var centreObjectX, centreObjectY;
var centreX = canvas.width / 2, centreY = canvas.height / 2;

btnOperation.addEventListener('click', () => {
    var input_m = document.getElementById("input_m");
    var m = +input_m.value; input_m.value = '';
    var input_n = document.getElementById("input_n");
    var n = +input_n.value; input_n.value = '';
    var input_k = document.getElementById("input_l");
    var k = +input_k.value; input_k.value = '';
    var input_a = document.getElementById("input_a");
    var a = +input_a.value; input_a.value = '';
    var input_d = document.getElementById("input_d");
    var d = +input_d.value; input_d.value = '';
    var input_e = document.getElementById("input_e");
    var e = +input_e.value; input_e.value = '';

    var input_degX = document.getElementById("input_Rx");
    var degX = +input_degX.value; input_degX.value = '';
    var input_degY = document.getElementById("input_Ry");
    var degY = +input_degY.value; input_degY.value = '';
    var input_degZ = document.getElementById("input_Rz");
    var degZ = +input_degZ.value; input_degZ.value = '';

    var input_x = document.getElementById("input_x");
    var zX = input_x.checked; input_x.checked = false;
    var input_y = document.getElementById("input_y");
    var zY = input_y.checked; input_y.checked = false;
    var input_z = document.getElementById("input_z");
    var zZ = input_z.checked; input_z.checked = false;
    if(btnSwitch.classList.contains('switch-on')) { isLocalSystem = true; } else { isLocalSystem = false; }
    var i;
    for(i = 0; i < arrayObject.length; i++) {
        if(arrayObject[i].isObjectSelected) {
            translateObject(arrayObject[i], m, n, k);
            scaleObject(arrayObject[i], a, d, e, zX, zY, zZ, isLocalSystem);
            //rotateObject(arrayObject[i], deg, isLocalSystem);
            rotateAxisObject(arrayObject[i], degX, degY, degZ, isLocalSystem);
        }
    }
    selectedArea.x1 = 3000; selectedArea.x2 = 3000;
    selectedArea.x2 = 3000; selectedArea.y2 = 3000;
});
btnSwitch.addEventListener('click', function(){
    btnSwitch.classList.toggle('switch-on');  
});
var checkingExitScreen = function(mtx) {
    var fl = true;
    for(i = 0; i < mtx.length; i++) {
        if(mtx[i][0] > centreX || mtx[i][0] < - centreX || mtx[i][1] > centreY || mtx[i][1] < - centreY) {
            fl = false; alert('Хозяин! Вылетело за экран! Я откатил обратно, хозяин!');
        }
    }
    return fl;
};

//=============ФУНКЦИЯ ФОКУС-ГРУППА=================//
var selectedArea = { x1: null, x2: null, y1: null, y2: null };
var isDrawingSelectedArea = false;
 
function drawSelectedArea() {
    if(isDrawingSelectedArea) {
        ctx.strokeStyle = 'rgba(43, 45, 66, 1)';
        ctx.lineWidth = 1;
        ctx.setLineDash([10, 3]);
        ctx.strokeRect(selectedArea.x1, - selectedArea.y1, mouse.x - selectedArea.x1, - (mouse.y - selectedArea.y1));
    }
}
//=============ФУНКЦИЯ ФОКУС-ГРУППА=================//

//=============ФУНКЦИЯ РЕДАКТИРОВАНИЕ ТОЧКИ=================//
var outputXYZ = function(object, i) {
    document.getElementById('coord-menu__inputx').value = object.coordinateMatrix[i][0];
    document.getElementById('coord-menu__inputy').value = object.coordinateMatrix[i][1];
    document.getElementById('coord-menu__inputz').value = object.coordinateMatrix[i][2];
};
btnCoordMenu.addEventListener('click', () => {
    var x = +document.getElementById('coord-menu__inputx').value;
    document.getElementById('coord-menu__inputx').value = '';
    var y = +document.getElementById('coord-menu__inputy').value;
    document.getElementById('coord-menu__inputy').value = '';
    var z = +document.getElementById('coord-menu__inputz').value;
    document.getElementById('coord-menu__inputz').value = '';

    for(var i = 0; i < arrayObject.length; i++) {
        if(arrayObject[i].IsPointSelected) {
            if(isCursorInPoint(arrayObject[i], coordSelectedPoint[0], coordSelectedPoint[1], btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                outputXYZ(arrayObject[i], indexCoordinateArr);
                arrayObject[i].coordinateMatrix[indexCoordinateArr][0] = x;
                arrayObject[i].coordinateMatrix[indexCoordinateArr][1] = y;
                arrayObject[i].coordinateMatrix[indexCoordinateArr][2] = z;
                arrayObject[i].IsPointSelected = false;
            }
        }
    }
});
//=============--------------------=================//

//===========================СКРИПТ РАБОТЫ КНОПОК=====================================//
function unShowBtnSystCoor() {
    item.classList.remove("btn-pressed");
}
btnsSystemCoordParent.addEventListener('click', (event) => {
    var target = event.target;
    if(target && target.classList.contains('btn')) {
        btnsSystemCoord.forEach( (item, index) => {
            if(item == target) {
                btnsSystemCoord[index].classList.toggle('btn-pressed');
                if(index==0) { btnsSystemCoord[1].classList.remove('btn-pressed'); }
                if(index==1) { btnsSystemCoord[0].classList.remove('btn-pressed'); }
            }
        });
    }
});

//Отжать все кнопки
function unShowBtn() {
    btnsFunc.forEach(item => {
        item.classList.remove("btn-pressed");
    });
    btnsObj.forEach(item => {
        item.classList.remove("btn-pressed");
    });
}
//Зажать кнопку
function showBtnLine(i) {
    btnsFunc[i].classList.toggle('btn-pressed');
}
function showBtnObj(i) {
    btnsObj[i].classList.toggle('btn-pressed');
}

btnsFuncParent.addEventListener('click', (event) => {
    var target = event.target;
    if(target && target.classList.contains('btn')) {
        btnsFunc.forEach( (item, index) => {
            if(item == target) {
                unShowBtn();
                showBtnLine(index);
            }
        });
    }
    modeFocus(btnsFunc[1].classList.contains('btn-pressed'));
    modeDelete(btnsFunc[2].classList.contains('btn-pressed'));
    modeEditLine(btnsFunc[0].classList.contains('btn-pressed'));
    modeCreatLine(btnsObj[0].classList.contains('btn-pressed'));
    modeCreatTriangle(btnsObj[1].classList.contains('btn-pressed'));
    modeCreatRect(btnsObj[2].classList.contains('btn-pressed'));
});

btnsObjParent.addEventListener('click', (event) => {
    var target = event.target;
    if(target && ( target.classList.contains('btn') || target.classList.contains('btn-obj__line') || 
    target.classList.contains('btn-obj__rect') || target.classList.contains('btn-obj__triangle') ) ) {
        btnsObj.forEach( (item, index) => {
            if(item == target) {
                unShowBtn();
                showBtnObj(index);
            }
        });
    }
    modeFocus(btnsFunc[1].classList.contains('btn-pressed'));
    modeDelete(btnsFunc[2].classList.contains('btn-pressed'));
    modeEditLine(btnsFunc[0].classList.contains('btn-pressed'));
    modeCreatLine(btnsObj[0].classList.contains('btn-pressed'));
    modeCreatTriangle(btnsObj[1].classList.contains('btn-pressed'));
    modeCreatRect(btnsObj[2].classList.contains('btn-pressed'));
});
//===========================СКРИПТ РАБОТЫ КНОПОК=====================================//


ctx.translate(canvas.width / 2, canvas.height / 2);
//=================ОБНОВЛЯЕМЫЙ КОД ДЛЯ ОТРИСОВКИ ДИНАМИЧЕСКИХ ОБЪЕКТОВ========================//


//==================СОБЫТИЕ ОТСЛЕЖИВАНИЕ МЫШКИ==================
var MouseMove = function(e) {
    mouse.x = e.pageX - this.offsetLeft - centreX;
    mouse.y = - (e.pageY - this.offsetTop - centreY); 
};
//==================СОБЫТИЕ ОТСЛЕЖИВАНИЕ МЫШКИ==================


//-----==========Объявление объекта и его функции=======--------//
var 
    object = [], coordinateMatrix = [],
    coordinateArray = [], arrayObject = [],
    isDrawingObject = false, startX, middleX, endX, startY, middleY, endY,
    isFirstLineDrawing = false, isTwoLineDrawing = false,
    isDrawingTriangle = false,  isDrawingRect = false, mouse = { x: 0, y: 0 },
    indexCoordinateArr = false, selectedPoint = null, selectedObject = null,
    coordSelectedPoint = [];
var object = function(coordinateMatrix, isObjectSelected) {
    this.coordinateMatrix = coordinateMatrix;
    this.isObjectSelected = isObjectSelected;
};
object.prototype = {
    focus: function(flag = false) {
        ctx.strokeStyle = '#d49c6b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        for(var i in this.coordinateMatrix) {
            if(i == 0) {
                if(!flag) { ctx.moveTo(this.coordinateMatrix[0][0], - this.coordinateMatrix[0][1]); } 
                else { ctx.moveTo(this.coordinateMatrix[0][0], - this.coordinateMatrix[0][2]); }
            }
            if(i != 0 && i != this.coordinateMatrix.length - 1) { 
                if(!flag) { ctx.lineTo(this.coordinateMatrix[i][0], - this.coordinateMatrix[i][1]); } 
                else { ctx.lineTo(this.coordinateMatrix[i][0], - this.coordinateMatrix[i][2]); }
            }
            if(i == this.coordinateMatrix.length - 1) { 
                if(!flag) { 
                    ctx.lineTo(this.coordinateMatrix[i][0], - this.coordinateMatrix[i][1]);
                    ctx.lineTo(this.coordinateMatrix[0][0], - this.coordinateMatrix[0][1]);
                } 
                else { 
                    ctx.lineTo(this.coordinateMatrix[i][0], - this.coordinateMatrix[i][2]);
                    ctx.lineTo(this.coordinateMatrix[0][0], - this.coordinateMatrix[0][2]);
                }
            }
        }
        ctx.stroke();
    },
    focusPoint: function(i, flag = false) {
        ctx.beginPath();
        if(!flag) { ctx.arc(this.coordinateMatrix[i][0], -this.coordinateMatrix[i][1], 7, 0, 2*Math.PI, false); } 
        else { ctx.arc(this.coordinateMatrix[i][0], -this.coordinateMatrix[i][2], 7, 0, 2*Math.PI, false); }
        ctx.fillStyle = '#d49c6b';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(43, 45, 66, 1)';
        ctx.stroke();
    },
    center: function(flag = false) {
        var count = 0, allx = 0, ally = 0;
        for (var i = 0; i < this.coordinateMatrix.length; i++) {
          allx += this.coordinateMatrix[i][0];
            if(!flag) { ally += this.coordinateMatrix[i][1]; }
            else { ally += this.coordinateMatrix[i][2]; }
          
          count++;
        }
        return [allx / count, ally / count]; // Центр фигуры - [x, y]
    },
};
var tempCentrCrd = [];
var translateStartCoord = function(object) {
    tempCentrCrd = object.center(btnsSystemCoord[1].classList.contains('btn-pressed'));
    for(var i = 0; i < object.coordinateMatrix.length; i++) {
        object.coordinateMatrix[i][0] = object.coordinateMatrix[i][0] - tempCentrCrd[0];
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            object.coordinateMatrix[i][1] = object.coordinateMatrix[i][1] - tempCentrCrd[1];
        } else {
            object.coordinateMatrix[i][2] = object.coordinateMatrix[i][2] - tempCentrCrd[1];
        }
    }
};
var translateBackCoord = function(object) {
    for(var i = 0; i < object.coordinateMatrix.length; i++) {
        object.coordinateMatrix[i][0] = object.coordinateMatrix[i][0] + tempCentrCrd[0];
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            object.coordinateMatrix[i][1] = object.coordinateMatrix[i][1] + tempCentrCrd[1];
        } else {
            object.coordinateMatrix[i][2] = object.coordinateMatrix[i][2] + tempCentrCrd[1];
        }
    }
};
var translateObject = function(object, m, n, k) {
    var mtx = object.coordinateMatrix; var i = 0;
    for(i = 0; i < mtx.length; i++) {
        mtx[i][0] = mtx[i][0] + m;
        mtx[i][1] = mtx[i][1] + n;
        mtx[i][2] = mtx[i][2] + k;
    }
    if(!checkingExitScreen(mtx)) {
        for(i = 0; i < mtx.length; i++) { mtx[i][0] = mtx[i][0] - m; mtx[i][1] = mtx[i][1] - n; mtx[i][2] = mtx[i][2] - k; }
    }
};
var scaleObject = function(object, a, d, e, zX, zY, zZ, fl) {
    var mtx = object.coordinateMatrix; var i = 0;
    if(a=='') { a = 1; } if(d=='') { d = 1; } if(e=='') { e = 1; } if(zX) { a = a * -1; } if(zY) { d = d * -1; } if(zZ) { e = e * -1; } 
    if(fl) { translateStartCoord(object); }
    for(i = 0; i < mtx.length; i++) { mtx[i][0] = mtx[i][0] * a; mtx[i][1] = mtx[i][1] * d; mtx[i][2] = mtx[i][2] * e; }
    if(fl) { translateBackCoord(object); }
    if(!checkingExitScreen(mtx)) {
        for(i = 0; i < mtx.length; i++) { mtx[i][0] = mtx[i][0] / a; mtx[i][1] = mtx[i][1] / d; mtx[i][2] = mtx[i][2] / e; }
    }
};
var rotateObject = function(object, deg, fl) {
    var mtx = object.coordinateMatrix; var i = 0; var tx, ty;
    if(fl) { translateStartCoord(object); }
    for(i = 0; i < mtx.length; i++) { 
        tx = ( mtx[i][0] * Math.cos(inRad(deg)) - mtx[i][1] * Math.sin(inRad(deg)) );
        ty = ( mtx[i][0] * Math.sin(inRad(deg)) + mtx[i][1] * Math.cos(inRad(deg)) );
        mtx[i][0] = tx;
        mtx[i][1] = ty;
    }
    if(fl) { translateBackCoord(object); }
    if(!checkingExitScreen(mtx)) {
        if(fl) { translateStartCoord(object); }
        for(i = 0; i < mtx.length; i++) { 
            tx = ( mtx[i][0] * Math.cos(inRad(deg)) - mtx[i][1] * Math.sin(inRad(deg)) );
            ty = ( mtx[i][0] * Math.sin(inRad(deg)) + mtx[i][1] * Math.cos(inRad(deg)) );
            mtx[i][0] = tx;
            mtx[i][1] = ty;
        } 
        if(fl) { translateBackCoord(object); }
    }
};
var rotateAxisObject = function(object, degX, degY, degZ, fl) {
    var mtx = object.coordinateMatrix; var i = 0;
    if(fl) { translateStartCoord(object); }
    if(degX != '') {
        for(i = 0; i < mtx.length; i++) { 
            ty = ( mtx[i][1] * Math.cos(inRad(degX)) + mtx[i][2] * Math.sin(inRad(degX)) );
            tz = ( -mtx[i][1] * Math.sin(inRad(degX)) + mtx[i][2] * Math.cos(inRad(degX)) );
            mtx[i][1] = ty;
            mtx[i][2] = tz;
        }
    }
    if(degY != '') {
        for(i = 0; i < mtx.length; i++) { 
            tx = ( mtx[i][0] * Math.cos(inRad(degY)) + mtx[i][2] * Math.sin(inRad(degY)) );
            tz = ( -mtx[i][0] * Math.sin(inRad(degY)) + mtx[i][2] * Math.cos(inRad(degY)) );
            mtx[i][0] = tx;
            mtx[i][2] = tz;
        }
    }
    if(degZ != '') {
        for(i = 0; i < mtx.length; i++) { 
            tx = ( mtx[i][0] * Math.cos(inRad(degZ)) - mtx[i][1] * Math.sin(inRad(degZ)) );
            ty = ( mtx[i][0] * Math.sin(inRad(degZ)) + mtx[i][1] * Math.cos(inRad(degZ)) );
            mtx[i][0] = tx;
            mtx[i][1] = ty;
        }
    }
    if(fl) { translateBackCoord(object); }

}
function drawObject(flag = false) {
    ctx.strokeStyle = 'rgba(43, 45, 66, 1)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (var i = 0; i < arrayObject.length; ++i) {
        var obj = arrayObject[i];
        for(var j = 0; j < obj.coordinateMatrix.length; j++) {
            if(!flag) {
                if(j == 0) { ctx.moveTo(obj.coordinateMatrix[0][0], - obj.coordinateMatrix[0][1]); }
                if(j != 0 && j != obj.coordinateMatrix.length - 1) { 
                    ctx.lineTo(obj.coordinateMatrix[j][0], - obj.coordinateMatrix[j][1]); 
                }
                if(j == obj.coordinateMatrix.length - 1) { ctx.lineTo(obj.coordinateMatrix[j][0], - obj.coordinateMatrix[j][1]);
                    ctx.lineTo(obj.coordinateMatrix[0][0], - obj.coordinateMatrix[0][1]);
                }   
            } else {
                if(j == 0) { ctx.moveTo(obj.coordinateMatrix[0][0], - obj.coordinateMatrix[0][2]); }
                if(j != 0 && j != obj.coordinateMatrix.length - 1) { 
                    ctx.lineTo(obj.coordinateMatrix[j][0], - obj.coordinateMatrix[j][2]); 
                }
                if(j == obj.coordinateMatrix.length - 1) { ctx.lineTo(obj.coordinateMatrix[j][0], - obj.coordinateMatrix[j][2]);
                    ctx.lineTo(obj.coordinateMatrix[0][0], - obj.coordinateMatrix[0][2]);
                } 
            }
        }
    }
    ctx.stroke();
    if (isDrawingObject) {
        ctx.strokeStyle = '#d49c6b';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(startX, - startY);
        if(isFirstLineDrawing) {
            ctx.lineTo(mouse.x, - mouse.y);
        }
        if(isTwoLineDrawing) {
            ctx.lineTo(middleX, - middleY);
            ctx.lineTo(mouse.x, - mouse.y);
        }
        ctx.lineTo(startX, - startY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(startX, - startY);
        if(isDrawingRect) {
            ctx.lineTo(startX, - mouse.y);
            ctx.lineTo(mouse.x, - mouse.y);
            ctx.lineTo(mouse.x, - startY);            
        }
        ctx.lineTo(startX, - startY);
        ctx.stroke();
    }
}
var isCursorInPoint = function(object, x, y, flag = false) {
    var mtx = object.coordinateMatrix;
    for(var i = 0; i < object.coordinateMatrix.length; i++) {
        indexCoordinateArr = i;
        if(!flag) {
            if(mtx[i][0] >= x - 10 && mtx[i][0] <= x + 10 && mtx[i][1] >= y - 10 && mtx[i][1] <= y + 10) {
                object.focusPoint(i, btnsSystemCoord[1].classList.contains('btn-pressed')); 
                spanPointX.innerHTML = Math.floor(mtx[i][0] * 100) / 100; spanPointY.innerHTML = Math.floor(mtx[i][1] * 100) / 100;
                return true;
            }
        } else {
            if(mtx[i][0] >= x - 10 && mtx[i][0] <= x + 10 && mtx[i][2] >= y - 10 && mtx[i][2] <= y + 10) {
                object.focusPoint(i, btnsSystemCoord[1].classList.contains('btn-pressed')); 
                spanPointX.innerHTML = Math.floor(mtx[i][0] * 100) / 100; spanPointY.innerHTML = Math.floor(mtx[i][2] * 100) / 100;
                return true;
            }
        }
    } return false;
};
var isCursorInLine = function(line, x, y, flag = false) {
    var mtx = line.coordinateMatrix;
    if(!flag) {
        var D = (mtx[0][1] - mtx[1][1])*x + (mtx[1][0]-mtx[0][0])*y + (mtx[0][0]*mtx[1][1] - mtx[1][0]*mtx[0][1]);
        if( Math.abs(D) < 3000) {
            if( (x >= mtx[0][0] - 5 && x <= mtx[1][0] + 5) || (x >= mtx[1][0] - 5 && x <= mtx[0][0] + 5) ) {
                if( (y >= mtx[1][1] - 5 && y <= mtx[0][1] + 5) || (y >= mtx[0][1] - 5 && y <= mtx[1][1] + 5) ) {
                    return true;
                } 
            }
        }
    } else {
        var D = (mtx[0][2] - mtx[1][2])*x + (mtx[1][0]-mtx[0][0])*y + (mtx[0][0]*mtx[1][2] - mtx[1][0]*mtx[0][2]);
        if( Math.abs(D) < 3000) {
            if( (x >= mtx[0][0] - 5 && x <= mtx[1][0] + 5) || (x >= mtx[1][0] - 5 && x <= mtx[0][0] + 5) ) {
                if( (y >= mtx[1][2] - 5 && y <= mtx[0][2] + 5) || (y >= mtx[0][2] - 5 && y <= mtx[1][2] + 5) ) {
                    return true;
                } 
            }
        }
    }
};
var isCursorInTriangle = function(triangle, x, y, flag = false) {
    var mtx = triangle.coordinateMatrix;
    if(mtx.length == 3) {
        if(!flag) {
            var a = (mtx[0][0] - x) * (mtx[1][1] - mtx[0][1]) - (mtx[1][0] - mtx[0][0]) * (mtx[0][1] - y);
            var b = (mtx[1][0] - x) * (mtx[2][1] - mtx[1][1]) - (mtx[2][0] - mtx[1][0]) * (mtx[1][1] - y);
            var c = (mtx[2][0] - x) * (mtx[0][1] - mtx[2][1]) - (mtx[0][0] - mtx[2][0]) * (mtx[2][1] - y);
        } else {
            var a = (mtx[0][0] - x) * (mtx[1][2] - mtx[0][2]) - (mtx[1][0] - mtx[0][0]) * (mtx[0][2] - y);
            var b = (mtx[1][0] - x) * (mtx[2][2] - mtx[1][2]) - (mtx[2][0] - mtx[1][0]) * (mtx[1][2] - y);
            var c = (mtx[2][0] - x) * (mtx[0][2] - mtx[2][2]) - (mtx[0][0] - mtx[2][0]) * (mtx[2][2] - y);
        }
    if ((a >= 0 && b >= 0 && c >= 0) || (a <= 0 && b <= 0 && c <= 0)) { 
        return  true;
    } else { return false; }
    }
};
var isCursorInRect = function(rect, x, y) {
    var i, j, c = 0; var mtx = rect.coordinateMatrix;
    for(i = 0, j = mtx.length - 1; i < mtx.length; j = i++)
    {
        if ((((mtx[i][1] <= y) && (y < mtx[j][1])) || ((mtx[j][1] <= y) && (y < mtx[i][1]))) && 
            (x < (mtx[j][0] - mtx[i][0]) * (y - mtx[i][1]) / (mtx[j][1] - mtx[i][1]) + mtx[i][0]))
            c = !c;
    }
    return c;
};
//---------==============================-------------------//

//------==============CОБЫТИЯ СОЗДАНИЯ ОБЪЕКТОВ============----------//
function modeCreatLine(mode) {
    if(mode) {
        canvas.removeEventListener("mousemove", MouseMove);
        canvas.addEventListener("mousedown", creatLineMouseDown);     
        canvas.addEventListener("mousemove", creatLineMouseMove);   
        canvas.addEventListener("mouseup", creatLineMouseUp); 
    } else {
        canvas.removeEventListener("mousedown", creatLineMouseDown);  
        canvas.removeEventListener("mousemove", creatLineMouseMove);
        canvas.removeEventListener("mouseup", creatLineMouseUp); 
    }
}
function modeCreatTriangle(mode) {
    if(mode) {
        canvas.removeEventListener("mousemove", MouseMove);
        canvas.addEventListener("mousedown", creatTriangleMouseDown);     
        canvas.addEventListener("mousemove", creatTriangleMouseMove);   
        canvas.addEventListener("mouseup", creatTriangleMouseUp);
        canvas.addEventListener("contextmenu", creatTriangleСontextmenu);  
    } else {
        canvas.removeEventListener("mousedown", creatTriangleMouseDown);  
        canvas.removeEventListener("mousemove", creatTriangleMouseMove);
        canvas.removeEventListener("mouseup", creatTriangleMouseUp);
        canvas.removeEventListener("contextmenu", creatTriangleСontextmenu);  
    }
}
function modeCreatRect(mode) {
    if(mode) {
        canvas.removeEventListener("mousemove", MouseMove);
        canvas.addEventListener("mousedown", creatRectMouseDown);     
        canvas.addEventListener("mousemove", creatRectMouseMove);   
        canvas.addEventListener("mouseup", creatRectMouseUp);
    } else {
        canvas.removeEventListener("mousedown", creatRectMouseDown);
        canvas.removeEventListener("mousemove", creatRectMouseMove);
        canvas.removeEventListener("mouseup", creatRectMouseUp);
    }
}
//--------------------===============================-------------------//

//-------========ФУНКЦИИ СОБЫТИЙ СОЗДАНИЯ ОБЪЕКТОВ=============------//
var creatLineMouseDown = function(e){
    if (!isDrawingObject) {
        coordinateMatrix = []; coordinateArray = [];
        startX = e.clientX - this.offsetLeft - centreX; 
        startY = - (e.pageY - this.offsetTop - centreY); 
        isDrawingObject = true; isFirstLineDrawing = true;
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            coordinateArray = [startX, startY, 0];
        } else {
            coordinateArray = [startX, 0, startY];
        }
        coordinateMatrix.push(coordinateArray);
    }
    drawObject(btnsSystemCoord[1].classList.contains('btn-pressed')); 
};
var creatLineMouseMove = function(e){   
    mouse.x = e.pageX - this.offsetLeft - centreX; 
    mouse.y = - (e.pageY - this.offsetTop - centreY);   
    if (isDrawingObject) {
        drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
    }
};
var creatLineMouseUp = function(){     
    if (isDrawingObject) {
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            coordinateArray = [mouse.x, mouse.y, 0];
        } else {
            coordinateArray = [mouse.x, 0, mouse.y];
        }
        coordinateMatrix.push(coordinateArray);
        arrayObject.push( new object (coordinateMatrix, false) );
        isDrawingObject = false; isFirstLineDrawing = false;
    }
    drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
};
var creatTriangleMouseDown = function(e){
    if(e.which == 1) {
        coordinateMatrix = [];
        if (!isDrawingObject) {
            startX = e.clientX - this.offsetLeft - centreX; 
            startY = - (e.pageY - this.offsetTop - centreY); 
            isDrawingObject = true; isFirstLineDrawing = true;
            if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                coordinateArray = [startX, startY, 0];
            } else {
                coordinateArray = [startX, 0, startY];
            }
            coordinateMatrix.push(coordinateArray);
        }
        drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
    }
};
var creatTriangleMouseMove = function(e){
    mouse.x = e.pageX - this.offsetLeft - centreX; 
    mouse.y = - (e.pageY - this.offsetTop - centreY);    
    if (isDrawingObject) {
        drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
    }
};
var creatTriangleMouseUp = function(e){   
    if(e.which == 1) {
        middleX = mouse.x; middleY = mouse.y;
        if (isDrawingObject) {
            drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
            if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                coordinateArray = [middleX, middleY, 0];
            } else {
                coordinateArray = [middleX, 0, middleY];
            }
            coordinateMatrix.push(coordinateArray);
            isFirstLineDrawing = false; isTwoLineDrawing = true;
        }
    }
};
var creatTriangleСontextmenu = function(event){
    event.preventDefault();
    if (isDrawingObject && isTwoLineDrawing) {
        coordinateArray = [mouse.x, mouse.y, 0];
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            coordinateArray = [mouse.x, mouse.y, 0];
        } else {
            coordinateArray = [mouse.x, 0, mouse.y];
        }
        coordinateMatrix.push(coordinateArray);
        arrayObject.push( new object (coordinateMatrix, false) );
        isDrawingObject = false; isTwoLineDrawing = false;
    }
};
var creatRectMouseDown = function(e){
    if (!isDrawingObject) {
        coordinateMatrix = [];
        startX = e.clientX - this.offsetLeft - centreX; 
        startY = - (e.pageY - this.offsetTop - centreY);   
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            coordinateArray = [startX, startY, 0];
        } else {
            coordinateArray = [startX, 0, startY];
        }
        coordinateMatrix.push(coordinateArray);
        isDrawingObject = true; isDrawingRect = true;
    }
    drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
};
var creatRectMouseMove = function(e){
    mouse.x = e.pageX - this.offsetLeft - centreX; 
    mouse.y = - (e.pageY - this.offsetTop - centreY);   
    if (isDrawingObject) {
        drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
    }
};
var creatRectMouseUp = function(){   
    if (isDrawingObject) {
        if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
            coordinateArray = [startX, mouse.y, 0]; coordinateMatrix.push(coordinateArray);
            coordinateArray = [mouse.x, mouse.y, 0]; coordinateMatrix.push(coordinateArray);
            coordinateArray = [mouse.x, startY, 0]; coordinateMatrix.push(coordinateArray);
        } else {
            coordinateArray = [startX, 0, mouse.y]; coordinateMatrix.push(coordinateArray);
            coordinateArray = [mouse.x, 0, mouse.y]; coordinateMatrix.push(coordinateArray);
            coordinateArray = [mouse.x, 0, startY]; coordinateMatrix.push(coordinateArray);
        }
        arrayObject.push( new object (coordinateMatrix, false) );
        isDrawingObject = false; isDrawingRect = false;
    }
    drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
};
//=================ФУНКЦИИ СОБЫТИЙ СОЗДАНИЯ ОБЪЕКТОВ========================


//=================ФУНКЦИЯ РЕДАКТИРОВАНИЯ ОБЪЕКТОВ========================
function modeEditLine(mode) {
    if(mode) {
        canvas.addEventListener("mousedown", editMouseDown);     
        canvas.addEventListener("mousemove", MouseMove);   
        canvas.addEventListener("mouseup", editMouseUp); 
        canvas.addEventListener("contextmenu", editMouseContextMenu);
    } else {
        canvas.removeEventListener("mousedown", editMouseDown);  
        canvas.removeEventListener("mouseup", editMouseUp); 
        canvas.removeEventListener("contextmenu", editMouseContextMenu);
        for(i = 0; i < arrayObject.length; i++) {
            arrayObject[i].IsPointSelected = false;
        }
        clearInputCoord();
    }
}
var editRect = false;
var clearInputCoord = function() {
    document.getElementById('coord-menu__inputx').value = '';
    document.getElementById('coord-menu__inputy').value = '';
    document.getElementById('coord-menu__inputz').value = '';
}
var editMouseDown = function(event) {
    if(event.which == 1){
        document.querySelector('.coord-menu').style.display = 'none';
        if(!selectedPoint) {
            for(i = 0; i < arrayObject.length; i++) {
                if(isCursorInPoint(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                    selectedIndex = indexCoordinateArr;
                    selectedPoint = arrayObject[i].coordinateMatrix;
                    if(arrayObject[i].coordinateMatrix.length == 4) { editRect = true; }          
                }
                arrayObject[i].IsPointSelected = false;
            }
        }
        if(!selectedObject) {
            for(i = 0; i < arrayObject.length; i++) {
                if(isCursorInLine(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                    selectedObject = arrayObject[i];
                }
                if(isCursorInTriangle(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                    selectedObject = arrayObject[i];
                }
                if(isCursorInRect(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                    selectedObject = arrayObject[i];
                }
                arrayObject[i].IsPointSelected = false;
            }
        }
    }
    var i = 0;
    clearInputCoord();
};
var editMouseUp = function() {
    selectedPoint = false; editRect = false; selectedIndex = []; 
    selectedObject = false;
};
var selectedIndexCoord = null;
var editMouseContextMenu = function(event) {
    event.preventDefault();
    if(event.which == 3) {
        coordSelectedPoint = [mouse.x, mouse.y];
        for(var i = 0; i < arrayObject.length; i++) {
            document.querySelector('.coord-menu').style.display = 'flex';
            if(isCursorInPoint(arrayObject[i], coordSelectedPoint[0], coordSelectedPoint[1], btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                arrayObject[i].IsPointSelected = true;
                outputXYZ(arrayObject[i], indexCoordinateArr);
            } else { arrayObject[i].IsPointSelected = false; }
        }
    }
};
//----------==========ФУНКЦИЯ РЕДАКТИРОВАНИЯ ОБЪЕКТОВ==========-----------

//-------========ФУНКЦИЯ УДАЛЕНИЯ ОБЪЕКТОВ========----------
function modeDelete(mode) {
    if(mode) {
        canvas.addEventListener("mousemove", MouseMove);     
        canvas.addEventListener("click", deleteMouseClick);
        canvas.addEventListener("click", deleteTriangleMouseClick);
        canvas.addEventListener("click", deleteRectMouseClick);
    } else {
        canvas.removeEventListener("click", deleteMouseClick);
        canvas.removeEventListener("click", deleteTriangleMouseClick);
        canvas.removeEventListener("click", deleteRectMouseClick);
    }
}
var deleteTriangleMouseClick = function() {
    for(var i in arrayObject) {
        if(isCursorInTriangle(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
            arrayObject.splice(i, 1);
        }
    }
};
var deleteRectMouseClick = function() {
    for(var i in arrayObject) {
        if(isCursorInRect(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
            arrayObject.splice(i, 1);
        }
    }
};
var deleteMouseClick = function() {
    for(var i in arrayObject) {
        if(isCursorInLine(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
            arrayObject.splice(i, 1);
        }
    }
};
//-------========ФУНКЦИЯ УДАЛЕНИЯ ОБЪЕКТОВ========----------

//====================ВЫДЕЛЕНИЕ ОБЪЕКТОВ ФОКУС ГРУППЫ================================//
function selectedAreaCheckObject(object) {
    //(y1-y2)*x+(x2-x1)*y+(x1*y2-x2*y1)=0
    var A1 = 0, B1 = selectedArea.x2 - selectedArea.x1, C1 = selectedArea.y1 * (selectedArea.x1 - selectedArea.x2),
        A2 = 0, B2 = selectedArea.x2 - selectedArea.x1, C2 = selectedArea.y2 * (selectedArea.x1 - selectedArea.x2),
        A3 = selectedArea.y1 - selectedArea.y2, B3 = 0, C3 = selectedArea.x1 * (selectedArea.y2 - selectedArea.y1),
        A4 = selectedArea.y1 - selectedArea.y2, B4 = 0, C4 = selectedArea.x2 * (selectedArea.y2 - selectedArea.y1);
    var eqMtx = [ [A1, B1, C1], [A2, B2, C2], [A3, B3, C3], [A4, B4, C4] ];
    var D = [], flHit = false;
    var mtx = object.coordinateMatrix;
    for(var j = 0; j < mtx.length; j++) {
        for(var k = 0; k < 4; k++) {
            if(k < 2) { D[k] = eqMtx[k][0]*mtx[j][0] + eqMtx[k][1]*mtx[j][1] +  eqMtx[k][2]; }
            if(k>=2) { D[k] = - (eqMtx[k][0]*mtx[j][0] + eqMtx[k][1]*mtx[j][1] + eqMtx[k][2]); }
        }
        if(D[0]>0 && D[1]<0 && D[2]>0 && D[3]<0 || D[0]<0 && D[1]>0 && D[2]<0 && D[3]>0) {
            flHit = true;
        } else { flHit = false; }
    }
    if(flHit) {
        if(selectedArea.x1 != selectedArea.y1 && selectedArea.y2 != selectedArea.x2) {
            object.isObjectSelected = true;
        }
    } else { object.isObjectSelected = false; }
    if(object.coordinateMatrix.length == 2) { if(isCursorInLine(object, selectedArea.x1, selectedArea.y1, btnsSystemCoord[1].classList.contains('btn-pressed'))) { object.isObjectSelected = true; } }
    if(object.coordinateMatrix.length == 3) { if(isCursorInTriangle(object,selectedArea.x1, selectedArea.y1, btnsSystemCoord[1].classList.contains('btn-pressed'))) { object.isObjectSelected = true; } }
    if(object.coordinateMatrix.length == 4) { if(isCursorInRect(object, selectedArea.x1, selectedArea.y1, btnsSystemCoord[1].classList.contains('btn-pressed'))) { object.isObjectSelected = true; } }
}
var checkedMenuOpen = function() {
    var openingMenu = false;
    var i = 0;
    for(i = 0; i < arrayObject.length; i++) {
        if(arrayObject[i].isObjectSelected) {
            arrayObject[i].focus(btnsSystemCoord[1].classList.contains('btn-pressed'));
            openingMenu = true;
        }
    }
    return openingMenu;
};
//====================ВЫДЕЛЕНИЕ ОБЪЕКТОВ ФОКУС ГРУППЫ================================//

//-------==========ФУНКЦИЯ ФОКУС-ГРУППА===========----------
function modeFocus(mode) {
    if(mode) {
        canvas.removeEventListener("mousemove", MouseMove);
        canvas.addEventListener("mousedown", focusMouseDown);     
        canvas.addEventListener("mousemove", focusMouseMove);   
        canvas.addEventListener("mouseup",focusMouseUp);
    } else {
        canvas.removeEventListener("mousedown", focusMouseDown);  
        canvas.removeEventListener("mousemove", focusMouseMove);
        canvas.removeEventListener("mouseup", focusMouseUp);
        selectedArea.x1 = 2000; 
        selectedArea.y1 = 2000; 
        selectedArea.x2 = 2000; 
        selectedArea.y2 = 2000;
        for(var i in arrayObject) {
            arrayObject[i].isObjectSelected = false;
        } 
    }
}
var focusMouseDown = function(e){ 
    if (!isDrawingSelectedArea) {
        selectedArea.x1 = e.clientX - this.offsetLeft - centreX; 
        selectedArea.y1 = - (e.pageY - this.offsetTop - centreY); 
        selectedArea.x2 = null; 
        selectedArea.y2 = null; 
        isDrawingSelectedArea = true;
    }
    drawSelectedArea();
};
var focusMouseMove = function(e){
    mouse.x = e.clientX - this.offsetLeft - centreX; 
    mouse.y = - (e.pageY - this.offsetTop - centreY); 
    if (isDrawingSelectedArea) {
        selectedArea.x2 = mouse.x; 
        selectedArea.y2 = mouse.y;
        drawSelectedArea();
    }
};
var focusMouseUp = function(){   
    if (isDrawingSelectedArea) {
        selectedArea.x2 = mouse.x;
        selectedArea.y2 = mouse.y;
        isDrawingSelectedArea = false;
    }
};
//=================ФУНКЦИЯ ФОКУС-ГРУППА========================


setInterval(function() {

    if(btnsSystemCoord[0].classList.contains('btn-pressed')) {
        bgCanvas.classList.add('area__canvas-systemCoord2');
    } else { bgCanvas.classList.remove('area__canvas-systemCoord2'); }
    if(btnsSystemCoord[1].classList.contains('btn-pressed')) {
        bgCanvas.classList.add('area__canvas-systemCoord3');
    } else { bgCanvas.classList.remove('area__canvas-systemCoord3'); }
    
    spanMouseX.innerHTML = mouse.x;
    spanMouseY.innerHTML = mouse.y;
    spanA.innerHTML = 'A';
    spanB.innerHTML = 'B';
    spanC.innerHTML = 'C';
    spanPointX.innerHTML = '0';
    spanPointY.innerHTML = '0';
    
    //=================ОБНОВЛЕНИЕ ОТРИСОВКИ========================//
    ctx.clearRect(- canvas.width / 2, - canvas.height / 2, canvas.width, canvas.height);
    ctx.lineCap = "round";
    drawObject(btnsSystemCoord[1].classList.contains('btn-pressed'));
    drawSelectedArea();
    ctx.setLineDash([]);
    
    if(checkedMenuOpen()) {
        document.getElementById('message').style.display = 'none';
        document.getElementById('operation').style.display = 'flex';
    } else { 
        document.getElementById('message').style.display = 'block';
        document.getElementById('operation').style.display = 'none'; 
    }
    //============ОТРИСОВКА ДЕЙСТВИЙ С ОБЪЕКТАМИ=============//
    for(var i = 0; i < arrayObject.length; i++) {
        
        selectedAreaCheckObject(arrayObject[i]);

        if(arrayObject[i].IsPointSelected) {
            if(isCursorInPoint(arrayObject[i], coordSelectedPoint[0], coordSelectedPoint[1], btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                arrayObject[i].focusPoint(indexCoordinateArr, btnsSystemCoord[1].classList.contains('btn-pressed'));       
            }
        }
        ///////////////////////////////////////////////////////////////////////////////////
        if(arrayObject[i].coordinateMatrix.length == 2 && !arrayObject[i].IsPointSelected) { 
            if(isCursorInLine(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                arrayObject[i].focus(btnsSystemCoord[1].classList.contains('btn-pressed'));
            }
        }
        if(arrayObject[i].coordinateMatrix.length == 3 && !arrayObject[i].IsPointSelected) { 
            if(isCursorInTriangle(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                arrayObject[i].focus(btnsSystemCoord[1].classList.contains('btn-pressed'));
            }
        }
        if(arrayObject[i].coordinateMatrix.length == 4 && !arrayObject[i].IsPointSelected) { 
            if(isCursorInRect(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
                arrayObject[i].focus(btnsSystemCoord[1].classList.contains('btn-pressed'));
            }
        }
        if(isCursorInPoint(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
            arrayObject[i].focusPoint(indexCoordinateArr, btnsSystemCoord[1].classList.contains('btn-pressed'));
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if(selectedPoint) {
            selectedPoint[selectedIndex][0] = mouse.x;
            if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                selectedPoint[selectedIndex][1] = mouse.y;
            } else { selectedPoint[selectedIndex][2] = mouse.y; } 
            if(editRect) {
                if(selectedIndex == 0) { 
                    selectedPoint[1][0] = mouse.x;
                    if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                        selectedPoint[3][1] = mouse.y;
                    } else { selectedPoint[3][2] = mouse.y; }
                }
                if(selectedIndex == 1) { 
                    selectedPoint[0][0] = mouse.x;
                    if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                        selectedPoint[2][1] = mouse.y;
                    } else { selectedPoint[2][2] = mouse.y; }
                }
                if(selectedIndex == 2) { 
                    selectedPoint[3][0] = mouse.x;
                    if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                        selectedPoint[1][1] = mouse.y;
                    } else { selectedPoint[1][2] = mouse.y; }
                }
                if(selectedIndex == 3) { 
                    selectedPoint[2][0] = mouse.x;
                    if(!btnsSystemCoord[1].classList.contains('btn-pressed')) {
                        selectedPoint[0][1] = mouse.y;
                    } else { selectedPoint[0][2] = mouse.y; }
                }
            }
        }
        if(isCursorInLine(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed')) && !isCursorInPoint(arrayObject[i], mouse.x, mouse.y, btnsSystemCoord[1].classList.contains('btn-pressed'))) {
            spanA.innerHTML = Math.floor( (arrayObject[i].coordinateMatrix[0][1] - arrayObject[i].coordinateMatrix[1][1])* 100 / 100);
            spanB.innerHTML = Math.floor( (arrayObject[i].coordinateMatrix[1][0] - arrayObject[i].coordinateMatrix[0][0])* 100 / 100);
            spanC.innerHTML = Math.floor( (arrayObject[i].coordinateMatrix[0][0] * arrayObject[i].coordinateMatrix[1][1] - 
                arrayObject[i].coordinateMatrix[1][0] * arrayObject[i].coordinateMatrix[0][1])* 100 / 100);
        }
    }
    if(selectedObject && !selectedPoint) { 
        var j; var centerObj = selectedObject.center(btnsSystemCoord[1].classList.contains('btn-pressed'));
        var difM = []; var difXY = [];
        var mx = selectedObject.coordinateMatrix;
        for(j = 0; j < mx.length; j++) {
            difXY = [centerObj[0] - mx[j][0],  centerObj[1] - mx[j][1]]
            difM[j] = difXY;
        }
        for(j = 0; j < mx.length; j++) {
            mx[j][0] = mouse.x - difM[j][0];
            mx[j][1] = mouse.y - difM[j][1];
        }
    }
}, 1);
//=================ОБНОВЛЯЕМЫЙ КОД ДЛЯ ОТРИСОВКИ ДИНАМИЧЕСКИХ ОБЪЕКТОВ========================//



//=======================СОХРАНЕНИЕ ОБЪЕКТА В ЛОКАЛЬНЫЙ ФАЙЛ======================//
document.getElementById('btnSave').addEventListener('click', function(){
    function export2txt() {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([JSON.stringify(arrayObject, null, 2)], { type: "text/javascript" }));

        var input_degX = document.getElementById("input_Rx");
        var degX = +input_degX.value; input_degX.value = '';

        a.setAttribute("download", `${document.getElementById("inputSave").value}.json`);
        document.getElementById("inputSave").value = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      export2txt();
});
//-----------===================---------------//

//==================ЗАГРУЗКА ЛОКАЛЬНЫХ ФАЙЛОВ В ОБЪЕКТ===================//
document.getElementById('btnLoad').addEventListener('click', function(){
    var input, file, fr;
    if (typeof window.FileReader !== 'function') {
      alert("The file API isn't supported on this browser yet.");
      return;
    }
    input = document.getElementById('fileinput');
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.onload = receivedText;
      fr.readAsText(file);
    }

    function receivedText(e) {
      let lines = e.target.result;
      tempArr = JSON.parse(lines);
      arrayObject = [];
      for(var i = 0; i < tempArr.length; i++) {
        arrayObject.push( new object (tempArr[i].coordinateMatrix, tempArr[i].isObjectSelected) );
      }
    }
});
//-----------===================---------------//