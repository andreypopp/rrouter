PATH := ./node_modules/.bin:$(PATH)
TESTS = $(shell find ./lib -name '*-test.js')

install link::
	@npm $@

test::
	@mochify $(TESTS)

ci::
	@mochify --watch $(TESTS)

lint::
	@eslint-jsx lib

docs::
	@$(MAKE) --no-print-directory -C docs/ html
