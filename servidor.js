'use strict'
var express = require('express');
var mongoose = require('mongoose');
var bodyparser = require('body-parser');
var app = express();
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var ListaSchema = Schema({
	texto : String,
	terminado: Boolean
});


mongoose.connect('mongodb://localhost:27017/lista-angular');

var Lista = mongoose.model('Lista', ListaSchema);


app.get('env',function(){
	app.use( express.static( __dirname+ '/publico' ) );
	app.use( express.bodyParser());
});

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
//app.use(express.methodOverride());
app.use((req, res, next )=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

	next();
});

app.post('/api/lista',(peticion, respuesta)=>{
	// var params = peticion;
	// console.log(params);
	// var lista = new Lista();
	// lista.texto = params.texto;
	// console.log(lista.texto);
	Lista.create({ texto: peticion.body.texto },(error, lista)=>{
		if(error){
			respuesta.send(error);
			console.log('error');

		}
		
		Lista.find((err, lista)=>{
				if (err) {
					console.log(respuesta.send(err));
				}
				else{
					respuesta.json(lista);
					console.log('lista');
				}
			});
		
	});
});

app.get('/api/lista', (peticion, respuesta)=>{
	Lista.find((error, lista)=>{
		if(error){
			respuesta.send(error);
		}
		else{
			respuesta.json(lista);
		}
	})
});

app.delete('/api/lista/:id', (peticion, respuesta)=>{
	Lista.remove({
		_id: peticion.params.id
	}, (error, lista)=>{
		if(error){
			respuesta.send(error);
		}
		Lista.find((err,lista)=>{
			if(err){
				respuesta.send(err);
			}
			respuesta.json(lista);
		});
	});
});
app.put('/api/lista/:id', (peticion, respuesta)=>{
	Lista.findOneAndUpdate(
		{_id: peticion.params.id},
		{texto: peticion.body.texto,terminado: true},
		(error, lista)=>{
			if (error){
				respuesta.send(error);
			}
			Lista.find((err, lista)=>{
				if(err){
					respuesta.send(err);
				}
				respuesta.json(lista);
			});
		});
});

app.get('*', function( request, res){
	res.sendFile(__dirname+'/publico/index.html');
});

app.listen(8000, function(){
	console.log("servidor");
});