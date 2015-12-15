# dns-playground

dns playground

## Install

    npm i dns-playground --save-dev

## Usage

__terminal 1__
```sh
$ node serve
```

__terminal 2__
```sh
$ dig @127.0.0.1 www.google.com -p 15353 +short
127.0.0.1
127.0.0.25
```

## More

- https://github.com/tjfontaine/node-dns
- http://ss64.com/bash/dig.html
- https://www.madboa.com/geek/dig/
- https://nodejs.org/api/dns.html
