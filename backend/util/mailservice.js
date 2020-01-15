/**
 * Send Emails
 */

var nodemailer = require("nodemailer"),
	moment = require('moment');

const constants = require("./constants");

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: constants.EMAIL,
		pass: constants.EMAIL_PWD,
	}
});


module.exports = {
	/**
	 * Enviar mail de bienvenida si la cuenta fue creada por el Super Usuario
	 * @param {objetc} objeto user
	 * @param {string} password contraseña
	 * @param {boolean} isWebUser si es una cuenta web
	 */
	accountCreatedBySuperUser: function (user, password, isWebUser, res) {
		var mailOptions = {
			from: 'PISE',
			to: user.email,
			subject: user.name + ' ' + user.lastName + ', Bienvenid@ a PISE',
			html: '<h2><strong>Bienvenid@ a PISE</strong></h2>' +
				'<p>Se te ha creado una cuenta para acceder a PISE (Plataforma de Interoperabilidad de Servicios de Emergencia)</p>' +
				'<p>Tipo de cuenta: ' + (isWebUser ? 'WEB' : 'APP') + '</p>' +
				'<p>Ingresa los siguientes datos en la ' + (isWebUser ? 'WEB' : 'APP') + ' :</p>' +
				'<p align="center"> EMAIL: ' + user.email + '</p>' +
				'<p align="center"> CONTRASEÑA: ' + password + '</p>' +
				'<p align="center"> <strong>NO OLVIDES CAMBIAR TU CLAVE</strong> </p>' +
				'<br>' +
				'PISE.'
		};
		transporter.sendMail(mailOptions, function (err, info) {
			return res.status(201).send(user);
		});
	},

	/**
	 * Enviar email con código para válidar nuevo login
	 * @param {object} user User 
	 * @param {object} data data
	 */
	codeNewLogin: function (user, data, token, res) {
		var mailOptions = {
			from: 'PISE',
			to: user.email,
			subject: '[PISE] CONFIRMAR INGRESO A LA PLATAFORMA',
			html: '<h2><strong>Confirma el Ingreso a la plataforma</strong></h2>' +
				'<p>Se ha pedido la confirmacion para ingresar al sistema con los siguientes detalles</p>' +
				'<p> DISPOSITIVO: ' + data.device + '</p>' +
				'<p> FECHA: ' + moment(data.date).format('HH:mm DD/MM/YYYY') + '</p>' +
				'<p>Si no has sido tu, por favor cambia tu contraseña. Si tu has sido el que ha ingresado, porfavor ingresa este código de ingreso:</p>' +
				'<p> CÓDIGO DE INGRESO: ' + data.loginCode + '</p>' +
				'<br>' +
				'PISE.'
		};
		transporter.sendMail(mailOptions, function (err, info) {
			if (err) {
				console.log(err);
				return res.status(500).send({
					errors: [{
						"error": "Error al enviar email " + err
					}]
				})
			}
			return res.status(200).send({
				"token": token
			});
		});
	},

	/**
	 * 
	 * @param {*} user 
	 */
	reset: function reset(user) {
		var mailOptions = {
			from: 'Softultra Team',
			to: user.email,
			subject: '[ULTRASTOCK] RESETEO DE CONTRASEÑA',
			html: '<h2><strong>RESETEO DE CONTRASEÑA</strong></h2>' +
				'<p>Recibes este correo porque tu o alguien ha pedido restablecer tu contraseña, si no es así no hagas caso a este email</p>' +
				'<h3>Por favor, escribe este codigo en el programa: ' + user.code + '</h3>' +
				'<p>Ahora sigue los pasos en el programa</p>' +
				'<br>' +
				'Ultrastock. Un producto de Softultra'
		};
		transporter.sendMail(mailOptions, function (err, info) {});
	},

	/**
	 * Mail con notificacion de login, con el momento exacto
	 * @param {user} user 
	 */
	notifyLogin: function notifyLogin(user) {
		var mailOptions = {
			from: 'Softultra Team',
			to: user.email,
			subject: '[ULTRASTOCK] INGRESO AL SISTEMA',
			html: '<h2><strong>Ingreso al sistema</strong></h2>' +
				'<p>Se ha ingresado al sistema con tu cuenta a las <strong>' + moment().format('HH:mm, DD/MM/YYYY') + '</strong>.</p>' +
				'<p>Si no has sido tu, por favor entra y cambia tu contraseña!</p>' +
				'<br>' +
				'Ultrastock. Un producto de Softultra'
		};
		transporter.sendMail(mailOptions, function (err, info) {});
	},
}