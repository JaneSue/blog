{% extends '../layouts/main.swig' %}

{% block title %}注册页面{% endblock %}

{% block css_placeholder %}
	<style type="text/css">
		.form-box{
			width: 300px;
			padding: 20px;
			margin: 150px auto 0 auto;
			border: 1px solid #ccc;
		}
		.form-box .rela{
			overflow: hidden;
			margin-bottom: 12px;
		}
		.form-box .title{
			padding: 0 0 20px 0;
			font-size: 14px;
			text-align: center;
		}
		.form-box label{
			width: 60px;
			float: left;
			line-height: 26px;
		}

		.form-box input{
			float: left;
			line-height: 26px;
			height: 26px;
			padding-left: 10px;
		}

		.apply-btn{
			width: 100px;
			color: #fff;
			background: #00c8be;
			height: 26px;
			border-radius: 2px;
			line-height: 26px;
			text-align: center;
			margin-left: 60px;
			cursor: pointer;
		}
	</style>
{% endblock %}

{% block content %}
	<div class="form-box">
		<div class="title">blog注册</div>
		<div class="rela username">
			<label>用户名</label>
			<input id="username" type="text" placeholder="请输入用户名">
		</div>
		<div class="rela password">
			<label>密码</label>
			<input id="password" type="password" placeholder="请输入密码">
		</div>
		<div class="Apply_Btn apply-btn">提交</div>
	</div>
{% endblock %}

{% block js_placeholder %}
	{% parent %}
	<script type="text/javascript">
		(function(window){
			var usernameEl = $("#username");
			var passwordEl = $("#password");
			var applyBtn = $(".Apply_Btn");
			applyBtn.on("click", function(){
				$.ajax({
					"type": "POST",
					"url": "/auth/register-ajax",
					"dataType": "json",
					"data": {
						username: usernameEl.val(),
						password: passwordEl.val()
					},
					"success": function(data){
						if(data.success){
							window.location.href = data.url;
						}else{
							console.log(data.error)
						}
					}
				})
			});
		})(window);
	</script>
{% endblock %}