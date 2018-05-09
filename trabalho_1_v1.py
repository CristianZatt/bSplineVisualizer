import numpy as np
import matplotlib.pyplot as plt

#Funcao para calcular x ou y em funcao de t
def calculaptfunct(pt1,pt2,t):
	ptFuncT = (1-t)*pt1+t*pt2
	return ptFuncT
	
#Funcao que calcula os pontos da curva (j) em funcao de t e dos pontos de controle
def calculaj():
	print (coords)
	if(len(coords) > 3):

		Ax = coords[0][0]
		Ay = coords[0][1]
		Bx = coords[1][0]
		By = coords[1][1]
		Cx = coords[2][0]
		Cy = coords[2][1]
		Dx = coords[3][0]
		Dy = coords[3][1]

		t = np.linspace(0,1,1001)

		Ex = calculaptfunct(Ax,Bx,t)
		Ey = calculaptfunct(Ay,By,t)
		Fx = calculaptfunct(Bx,Cx,t)
		Fy = calculaptfunct(By,Cy,t)
		Gx = calculaptfunct(Cx,Dx,t)
		Gy = calculaptfunct(Cy,Dy,t)

		Hx = calculaptfunct(Ex,Fx,t)
		Hy = calculaptfunct(Ey,Fy,t)
		Ix = calculaptfunct(Fx,Gx,t)
		Iy = calculaptfunct(Fy,Gy,t)

		Jx = calculaptfunct(Hx,Ix,t)
		Jy = calculaptfunct(Hy,Iy,t)

		plt.plot((Ax,Bx,Cx,Dx),(Ay,By,Cy,Dy),'k--',label='Pontos de Controle',marker='o',markerfacecolor='red')
		plt.plot(Jx,Jy,'b',linewidth=2.0,label='Curva B-Spline')   
		plt.legend(loc='best')
		#plt.axis([min(Ax,Bx,Cx,Dx)-1, max(Ax,Bx,Cx,Dx)+1, min(Ay,By,Cy,Dy)-1, max(Ay,By,Cy,Dy)+1]) 
		plt.axis([0, 10, 0, 10]) 
		plt.show()
		exit

#Funcao para capturar as coordenadas do clique
def onclick(event):
    global ix, iy
    ix, iy = event.xdata, event.ydata 
    global coords      
    coords.append((((ix)), ((iy))))   
    calculaj()

#Exibe a janela e chama a funcao onclick ao pressionar o botao do mouse
fig = plt.figure(1)
coords =[]

cid = fig.canvas.mpl_connect('button_press_event', onclick)

plt.plot([0,1,2,3,4,6,7,8,9,10],[0,1,2,3,4,6,7,8,9,10],linestyle='None')
plt.show(1)
