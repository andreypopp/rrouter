PATH := ./node_modules/.bin:$(PATH)

lint:
	@eslint-jsx lib

docs::
	@$(MAKE) --no-print-directory -C docs/ html
