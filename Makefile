all:
	echo "Don't forget to increase version"
	tsc
ifneq ("$(wildcard ./remaining-time.zip)", "")
	rm remaining-time.zip
endif
	zip remaining-time.zip build/*.js manifest.json

clean:
	rm -r build
	rm remaining-time.zip