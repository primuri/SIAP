 SIAP
-----------------------------------------------------------------
 Instalar y correr Docker
 Abrir dos terminales, una para back y otra para front.
 Nota: El build solo se hace una vez o al cambiar dependencias.
-----------------------------------------------------------------

## Back:

 cd backend
 docker build -t djangoimage -f DockerBack .        	<- Solo la primera vez
 docker run -p 8000:8000 -v "${PWD}:/app" djangoimage

 ----------------------------------------------------------------

## Front:

 cd frontend
 docker build -t reactimage -f DockerFront .		<- Solo la primera vez
 docker run -p 5173:5173 -v "${PWD}/src:/app/src" -v "${PWD}/vite.config.js:/app/vite.config.js" reactimage

 ----------------------------------------------------------------

 Para acceder al container:

 Desde otra terminal ->
 docker ps 			<- ver nombres contenedores
 docker exec -it <nombre> bash 	<- Para entrar por bash o un comando especifico.

