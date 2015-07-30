# brianbondy.node

The brianbondy.com website built with Node + Hapi + Babel + React.
This is the latest rewrite of my site, the last version before it was made on Google App Engine and can be found at [bbondy/brianbondy.gae](http://github.com/bbondy/brianbondy.gae).

The main goal of this server was to be as low touch as possible.  Blog posts are simple markdown files and are loaded in / cached at server start and on reloading.

## Setup

    npm install

## Running

    gulp


## Refreshing data

Just load `/refresh`.
