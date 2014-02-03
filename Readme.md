# OpenAutomation

## Development

Install node modules:

```
npm install
```

Install client-side [component](http://component.io) modules:

```
component install
```

Install opencv and other OS packages:

```
brew tap homebrew/science
brew install opencv
```

### Build on file change

```
component build && mv build/build.js public/javascripts/
```

## Resources

- https://github.com/facebook/react-page-middleware
- https://github.com/facebook/react-page/