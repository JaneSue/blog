{% extends './layout.swig' %}

{% block content %}
	<div>{{title}}</div>
	<div>My name is {{ data.name }}, I am {{ data.age }} years old, sex {{ data.sex }}</div>
{% endblock %}