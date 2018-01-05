<!DOCTYPE html>
<html>
<head>
	<title>{% block title %}{% endblock %}</title>
	<link rel="stylesheet" type="text/css" href="/css/base.css">
	{% block css_placeholder %}
	{% endblock %}
</head>
<body>
	{% block content %}{% endblock %}
</body>
{% block js_placeholder %}
<script type="text/javascript" src="/js/jquery-1.9.1.js"></script>
{% endblock %}
</html>