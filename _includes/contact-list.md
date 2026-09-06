- **E-mail:** `{{ site.data.profile.email }}`
  {% for link in site.data.profile.links %}
- **{{ link.label }}:** [{{ link.text }}]({{ link.url }})
  {% endfor %}
