const Joi = require('joi')

const anecdote = Joi.object({
	text: Joi.string().required(),
	author: Joi.string().required(),
	status: Joi.string().valid(['FOR_PUBLICATION', 'PUBLISHED']).required(),
	createdAt: Joi.date().required(),
	publishedAt: Joi.date(),
	_id: Joi.string().required()
})

const anecdotes = Joi.array().items(anecdote)

exports.list = anecdotes