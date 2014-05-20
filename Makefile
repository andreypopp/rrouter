PATH := ./node_modules/.bin:$(PATH)

lint:
	@eslint-jsx lib
