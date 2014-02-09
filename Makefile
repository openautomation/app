
build:
	component build -d
	mv build/build.js public/javascripts/
	mv build/build.css public/stylesheets/

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean build