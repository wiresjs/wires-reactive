echo "******************** BROWSER TESTS **************************"
./node_modules/mocha-phantomjs/bin/mocha-phantomjs .browser-test-helpers/test.html
echo "******************** SERVER TESTS **************************"
./node_modules/mocha/bin/mocha