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

docs-publish::
	@$(MAKE) --no-print-directory -C docs/ publish

release-patch: test lint
	@$(call release,patch)

release-minor: test lint
	@$(call release,minor)

release-major: test lint
	@$(call release,major)

publish:
	@git push --tags origin HEAD:master
	@npm publish
	@$(MAKE) docs-publish

define release
	npm version $(1)
endef
