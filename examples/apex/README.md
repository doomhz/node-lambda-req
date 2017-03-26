
To run the example first setup your [AWS Credentials](http://apex.run/#aws-credentials), and ensure "role" in ./project.json is set to your Lambda function ARN.

Install NPM dependencies:

```
$ npm install
```

Initialize the function role:
```
$ apex init
```

Add extra options from `project.json_stub` to generated `project.json` to include the runtime, handler and hook  options.

Deploy the functions:

```
$ apex deploy
```

Try it out:

```
$ apex invoke hello < event.json
```
