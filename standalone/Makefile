.DELETE_ON_ERROR:
.INTERMEDIATE: rrouter.prod.js
REPO = $(shell git config --local --get remote.origin.url)
BRANCH = master

TARGETS = rrouter.js rrouter.min.js

PATH := ./node_modules/.bin:../node_modules/.bin:$(PATH)

build: $(TARGETS)

rrouter.js:
	$(call browserify,development)

rrouter.prod.js:
	$(call browserify,production)

rrouter.min.js: rrouter.prod.js
	@cat $< | uglifyjs -cm > $@

clean:
	@rm -f $(TARGETS)
	@rm -f rrouter-build-*.tgz
	@rm -rf ./themes
	@rm -rf ./package

README.md LICENSE:
	cp -r ../$@ ./$@

# called by npm
prepublish: clean build themes README.md LICENSE

publish: publish-repo

pack:
	BUILD_REPO=$(REPO:%.git=%-build.git);\
	npm pack;\
	git clone $$BUILD_REPO package;\
	(cd package && git checkout $(BRANCH));\
	tar xzf rrouter-build-*.tgz;\
	rm -rf ./package/*;\
	tar xzf rrouter-build-*.tgz;\

publish-repo: pack
	cd package;\
	git add --all .;\
	git commit -m "Build.";\
	git push origin $(BRANCH);

define browserify
	@NODE_ENV=$(1) browserify -t [ reactify --es6 ] . \
		| sed -E 's/function\(require/function(__browserify__/g' \
		| sed -E 's/require\(/__browserify__(/g' \
		>> $@
endef
