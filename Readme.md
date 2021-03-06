# OpenAutomation

## Development

Make sure you have XCode and XCode Developer Tools installed if you're on a mac, along with git and node.js.

Make sure you have node 0.11.x installed. If you want to manage multiple versions of node, I recommend https://github.com/visionmedia/n.

Then install component:

```
npm install -g component
```

Clone the repo:

```
git clone git@github.com:openautomation/openautomation.git
cd openautomation
```

Install node modules:

```
npm install
```

Install client-side [component](http://component.io) modules, and build:

```
component install
component build && mv build/build.js public/javascripts/ && mv build/build.css public/stylesheets/
```

Start the app:

```
node app
```

Visit [http://localhost:3000/index.html](http://localhost:3000/index.html)

### Build on file change

If you change any of the javascript, or add new components, make sure to rebuild:

```
component build && mv build/build.js public/javascripts/
```

### Install opencv and other OS packages (not necessary yet):

```
brew tap homebrew/science
brew install opencv
```

## Resources

- https://github.com/facebook/react-page-middleware
- https://github.com/facebook/react-page/
- http://en.wikipedia.org/wiki/G-code