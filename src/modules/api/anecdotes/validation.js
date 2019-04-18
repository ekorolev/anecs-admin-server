const Joi = require('joi')

const STATUSES = [
	'FOR_PUBLICATION',
	'PUBLISHED'
]

const anecdote = Joi.object({
	text: Joi.string().required(),
	author: Joi.string().required(),
	status: Joi.string().valid(STATUSES).required(),
	createdAt: Joi.date().required(),
	publishedAt: Joi.date(),
	_id: Joi.required()
})

const createAnecdotePayload = Joi.object({
	text: Joi.string().required(),
	status: Joi.string().valid(STATUSES).required()
})

const updateAnecdotePayload = Joi.object({
	text: Joi.string().required()
})

const anecdotes = Joi.array().items(anecdote)

exports.list = anecdotes
exports.createAnecdotePayload = createAnecdotePayload