all:
	echo "Don't forget to increase version"
	tsc
ifneq ("$(wildcard ./remaining-time.zip)", "")
		rm remaining-time.zip
endif
	cp manifest.json build/
	cd build && zip ../remaining-time.zip *.js manifest.json

clean:
	rm -r build
	rm remaining-time.zip