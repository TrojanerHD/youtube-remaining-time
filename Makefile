all:
	echo "Don't forget to increase version"
	tsc
	rm remaining-time.zip
	cp manifest.json build/
	cd build && zip ../remaining-time.zip *.js manifest.json

clean:
	rm -r build
	rm remaining-time.zip