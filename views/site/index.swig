{% extends '../layouts/main.swig' %}

{% block css_placeholder %}
	<style type="text/css">
		body{
			background: #f5f5d5;
		}
		.header{
			height: 70px;
			padding: 15px 0;
			border: 1px solid #d3d3d3;
			font-size: 15px;
			line-height: 40px;
			color: #888;
		}
		.fl{
			float: left;
		}
		.fr{
			float: right;
		}
		.main{
			width: 1120px;
			margin: 0 auto;
		}

		.cate-box .cate-site-bars{
			width: 270px;
		}
	</style>
{% endblock %}

{% block content %}

<div class="header">
	<div class="main">
		{% if data.user.username %}
		<div class="fl">{{ data.user.username }}的博客</div>
		{% else %}
		<div class="fl">{{ title }}</div>
		{% endif %}
		<div class="fr">
			{% if data.user %}
			<span>欢迎登录, {{ data.user.username }}</span>
			<a href="/{{ data.user.role }}">后台</span>
			<a href="/auth/logout">退出登录</a>
			{% else %}
			<a href="/auth/login" class="login">登录</a>
			<a href="/auth/register" class="register">注册</a>
			{% endif %}
		</div>
	</div>
</div>
	
<div class="cate-box">
	<div class="main">
		<div class="fl cate-site-bars">
			<div class="title">分类</div>
			{% if data.category %}
			<ul class="cate-items">
				{% for items in data.category %}
				<li class="item">{{ items.catename }}</li>
				{% endfor %}
			</ul>
			{% else %}
			<div>该用户暂未发表文章</div>
			{% endif %}
		</div>
		<div class="fl cate-body">
			<div class="title">面包屑</div>
			{% if data.category %}
			<div>文章内容</div>
			{% else %}
			<div>该用户暂未发表文章</div>
			{% endif %}
		</div>
	</div>
</div>
{% endblock %}

{% block js_placeholder %}
	{% parent %}
	<script type="text/javascript"></script>
{% endblock %}