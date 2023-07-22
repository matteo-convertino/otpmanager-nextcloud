# SPDX-FileCopyrightText: Bernhard Posselt <dev@bernhard-posselt.com>
# SPDX-License-Identifier: AGPL-3.0-or-later

# Generic Makefile for building and packaging a Nextcloud app which uses npm and
# Composer.
#
# Dependencies:
# * make
# * which
# * curl: used if phpunit and composer are not installed to fetch them from the web
# * tar: for building the archive
# * npm: for building and testing everything JS
#
# If no composer.json is in the app root directory, the Composer step
# will be skipped. The same goes for the package.json which can be located in
# the app root or the js/ directory.
#
# The npm command by launches the npm build script:
#
#    npm run build
#
# The npm test command launches the npm test script:
#
#    npm run test
#
# The idea behind this is to be completely testing and build tool agnostic. All
# build tools and additional package managers should be installed locally in
# your project, since this won't pollute people's global namespace.
#
# The following npm scripts in your package.json install and update the bower
# and npm dependencies and use gulp as build system (notice how everything is
# run from the node_modules folder):
#
#    "scripts": {
#        "test": "node node_modules/gulp-cli/bin/gulp.js karma",
#        "prebuild": "npm install && node_modules/bower/bin/bower install && node_modules/bower/bin/bower update",
#        "build": "node node_modules/gulp-cli/bin/gulp.js"
#    },

app_name=$(notdir $(CURDIR))
build_tools_directory=$(CURDIR)/build/tools
source_build_directory=$(CURDIR)/build/artifacts/source
source_package_name=$(source_build_directory)/$(app_name)
appstore_build_directory=$(CURDIR)/build/artifacts/appstore
appstore_tar_file=$(appstore_build_directory)/$(app_name).tar.gz
appstore_sign_directory=$(appstore_build_directory)/$(app_name)
npm=$(shell which npm 2> /dev/null)
composer=$(shell which composer 2> /dev/null)

all: build

# Fetches the PHP and JS dependencies and compiles the JS. If no composer.json
# is present, the composer step is skipped, if no package.json or js/package.json
# is present, the npm step is skipped
.PHONY: build
build:
ifneq (,$(wildcard $(CURDIR)/composer.json))
	make composer
endif
ifneq (,$(wildcard $(CURDIR)/package.json))
	make npm
endif
ifneq (,$(wildcard $(CURDIR)/js/package.json))
	make npm
endif

# Installs and updates the composer dependencies. If composer is not installed
# a copy is fetched from the web
.PHONY: composer
composer:
ifeq (, $(composer))
	@echo "No composer command available, downloading a copy from the web"
	mkdir -p $(build_tools_directory)
	curl -sS https://getcomposer.org/installer | php
	mv composer.phar $(build_tools_directory)
	php $(build_tools_directory)/composer.phar install --prefer-dist
else
	composer install --prefer-dist
endif

# Installs npm dependencies
.PHONY: npm
npm:
ifeq (,$(wildcard $(CURDIR)/package.json))
	cd js && $(npm) run build
else
	npm run build
endif

# Removes the appstore build
.PHONY: clean
clean:
	rm -rf ./build

# Same as clean but also removes dependencies installed by composer, bower and
# npm
.PHONY: distclean
distclean: clean
	rm -rf vendor
	rm -rf node_modules
	rm -rf js/vendor
	rm -rf js/node_modules

# Builds the source and appstore package
.PHONY: dist
dist:
	make source
	make appstore

# Builds the source package
.PHONY: source
source:
	rm -rf $(source_build_directory)
	mkdir -p $(source_build_directory)
	tar cvzf $(source_package_name).tar.gz ../$(app_name) \
	--exclude-vcs \
	--exclude="../$(app_name)/build" \
	--exclude="../$(app_name)/js/node_modules" \
	--exclude="../$(app_name)/node_modules" \
	--exclude="../$(app_name)/*.log" \
	--exclude="../$(app_name)/js/*.log" \

# Builds the source package for the app store, ignores php and js tests
.PHONY: appstore
appstore:
	rm -rf $(appstore_build_directory)
	mkdir -p $(appstore_sign_directory)
	rsync -a \
	--cvs-exclude \
	--exclude="/build" \
	--exclude="/tests" \
	--exclude="/Makefile" \
	--exclude="/*.log" \
	--exclude="/phpunit*xml" \
	--exclude="/composer.*" \
	--exclude="/js/node_modules" \
	--exclude="/js/tests" \
	--exclude="/js/test" \
	--exclude="/js/*.log" \
	--exclude="/js/package.json" \
	--exclude="/js/bower.json" \
	--exclude="/js/karma.*" \
	--exclude="/js/protractor.*" \
	--exclude="/package.json" \
	--exclude="/bower.json" \
	--exclude="/karma.*" \
	--exclude="/protractor\.*" \
	--exclude="/.*" \
	--exclude="/js/.*" \
	--exclude=babel.config.js \
	--exclude=docs \
	--exclude=.drone.jsonnet \
	--exclude=.drone.yml \
	--exclude=.eslintignore \
	--exclude=.eslintrc.js \
	--exclude=.git \
	--exclude=.gitattributes \
	--exclude=.github \
	--exclude=.gitignore \
	--exclude=jest.config.js \
	--exclude=jest.global.setup.js \
	--exclude=.l10nignore \
	--exclude=mkdocs.yml \
	--exclude=node_modules \
	--exclude=package-lock.json \
	--exclude=.php-cs-fixer.cache \
	--exclude=.php-cs-fixer.dist.php \
	--exclude=.php_cs.cache \
	--exclude=.php_cs.dist \
	--exclude=psalm.xml \
	--exclude=README.* \
	--exclude=.stylelintignore \
	--exclude=stylelint.config.js \
	--exclude=.tx \
	--exclude=tsconfig.json \
	--exclude=vendor/bamarni \
	--exclude=vendor/bin \
	--exclude=vendor-bin \
	--exclude=vendor/ \
	--exclude=webpack.common.config.js \
	--exclude=webpack.config.js \
	. $(appstore_sign_directory)
	@if [ -f ../../otpmanager.key ]; then \
		echo "Signing app files..."; \
		php ../../occ integrity:sign-app \
			--privateKey=otpmanager.key\
			--certificate=otpmanager.crt\
			--path=$(appstore_sign_directory); \
	fi
	tar cvzf $(appstore_tar_file) -C $(appstore_build_directory) $(app_name)
	@if [ -f ../../otpmanager.key ]; then \
		echo "Signing package..."; \
		openssl dgst -sha512 -sign ../../otpmanager.key $(appstore_tar_file) | openssl base64; \
	fi

.PHONY: test
test: composer
	$(CURDIR)/vendor/phpunit/phpunit/phpunit -c phpunit.xml
	$(CURDIR)/vendor/phpunit/phpunit/phpunit -c phpunit.integration.xml
