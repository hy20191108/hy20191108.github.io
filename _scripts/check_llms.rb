# frozen_string_literal: true

require "jekyll"
require "minitest/autorun"
require "nokogiri"

class PublishedSiteTest < Minitest::Test
  PROFILES = {"index.md" => "index.html", "en/index.md" => "en/index.html"}.freeze

  def setup
    @site_dir = ENV.fetch("SITE_DIR", "_site")
    @config = Jekyll.configuration("quiet" => true)
    @converter = Jekyll::Converters::Markdown.new(@config)
    @site_url = @config.fetch("url").chomp("/") + @config.fetch("baseurl", "").chomp("/")
  end

  def test_llms_index_points_to_both_markdown_profiles
    index = markdown("llms.txt")
    assert_equal 1, index.css("h1").length
    refute_nil index.at_css("blockquote"), "llms.txt needs a summary"
    refute_nil index.at_css("h2"), "llms.txt needs a profile section"
    assert_equal PROFILES.keys.map { |path| url(path) }, index.css("li a").map { |link| link["href"] }
  end

  def test_markdown_preserves_profile_text_links_and_structure
    PROFILES.each do |markdown_path, html_path|
      rendered = markdown(markdown_path)
      main = html(html_path).at_css("main")
      refute_nil main, "#{html_path}: missing profile"
      assert_equal visible_text(main), visible_text(rendered), "#{markdown_path}: profile text"
      assert_equal links(main), links(rendered), "#{markdown_path}: profile links"
      selector = "h1, h2, h3, table, tr"
      assert_equal main.css(selector).map(&:name), rendered.css(selector).map(&:name), "#{markdown_path}: structure"
    end
  end

  def test_html_exposes_markdown_and_llms_discovery_links
    PROFILES.each do |markdown_path, html_path|
      page = html(html_path)
      assert_equal [url("llms.txt")], page.css('head link[rel="describedby"]').map { |link| link["href"] }
      assert_equal [url(markdown_path)], page.css('head link[rel="alternate"][type="text/markdown"]').map { |link| link["href"] }
    end
  end

  def test_profiles_keep_language_metadata_and_structured_data
    {"index.html" => ["ja", ""], "en/index.html" => ["en", "en/"]}.each do |path, (language, route)|
      page = html(path)
      assert_equal language, page.at_css("html")["lang"]
      assert_equal [url(route)], page.css('link[rel="canonical"]').map { |link| link["href"] }
      assert_equal %w[en ja x-default], page.css("link[hreflang]").map { |link| link["hreflang"] }.sort
      person = JSON.parse(page.at_css('script[type="application/ld+json"]').text)
      assert_equal "Person", person.fetch("@type")
      profile = YAML.safe_load_file("_data/profile.yml")
      assert_equal profile.fetch("name"), person.fetch("name")
    end
  end

  def test_existing_language_redirects
    {"jp" => "", "ja" => "", "japanese" => "", "english" => "en/"}.each do |path, route|
      page = html("#{path}/index.html")
      assert_equal url(route), page.at_css('link[rel="canonical"]')["href"]
      assert_includes page.at_css('meta[http-equiv="refresh"]')["content"], url(route)
    end
  end

  def test_development_files_are_not_published
    %w[README.md README.html Gemfile Gemfile.lock package.json package-lock.json node_modules _scripts Dockerfile docker-compose.yml poole-for-jekyll.gemspec].each do |path|
      refute File.exist?(File.join(@site_dir, path)), "Development file was published: #{path}"
    end
  end

  private

  def url(path)
    "#{@site_url}/#{path}"
  end

  def html(path)
    Nokogiri::HTML(File.read(File.join(@site_dir, path)))
  end

  def markdown(path)
    text = File.read(File.join(@site_dir, path), encoding: "UTF-8")
    assert text.start_with?("# "), "#{path}: expected H1 without front matter"
    refute text.match?(/\{%|\{\{|<\/?[a-zA-Z][a-zA-Z0-9-]*(?:\s[^<>]*)?\/?>/), "#{path}: unrendered Liquid or HTML"
    Nokogiri::HTML.fragment(@converter.convert(text))
  end

  def visible_text(node)
    node.text.gsub(/[[:space:]]+/, "")
  end

  def links(node)
    node.css("a[href]").map { |link| [visible_text(link), link["href"]] }
  end
end
