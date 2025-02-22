FROM jekyll/jekyll:pages

# Install Poole dependencies
RUN gem install jekyll jekyll-gist jekyll-sitemap jekyll-seo-tag

# Docker side
ENV PROJECT_ROOTDIR=/srv/jekyll
WORKDIR /srv/jekyll

# Copy only Gemfile related files first to enable dependency caching
COPY Gemfile* /srv/jekyll/
RUN bundle install

# Copy the rest of the source
COPY . /srv/jekyll/

# Open necessary ports
EXPOSE 4000

# Set environment variables
ENV HOST=0.0.0.0
ENV JEKYLL_ENV=docker

# Start the server
CMD ["bundle", "exec", "jekyll", "serve", "--host=0.0.0.0", "--force_polling"]