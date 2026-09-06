{% assign profile = site.data.profile.locales[page.lang] %}

# {{ profile.heading }}

{{ site.data.profile.organization.locales[page.lang] }}
{% for line in profile.affiliation %}
{{ line }}
{% endfor %}
