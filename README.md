This is my personal website. It's built using [Jekyll](https://jekyllrb.com/), a static site generator.

## On Windows:

### Pre-requisites

1. Install Jekyll (https://jekyllrb.com/docs/installation)
1. Run:
   ```
   bundle config set --local path 'vendor/bundle'
   bundle install
   ```

### Run local server

1. From cloned repo, run:
   ```
   bundle exec jekyll clean
   bundle exec jekyll build --trace
   bundle exec jekyll serve
   ```
1. Open http://localhost:4000
