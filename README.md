This is my personal website. It's built using [Jekyll](https://jekyllrb.com/), a static site generator.

## On Windows:

### Pre-requisites

1. Install Jekyll by following https://jekyllrb.com/docs/installation/windows/

### Run local server

From cloned repo, run:

```
bundle config set --local path 'vendor/bundle'
bundle install
bundle exec jekyll clean
bundle exec jekyll build --trace
bundle exec jekyll serve
```

This should start a server on http://localhost:4000.
