<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>{block name="title"}{$_seo.title}{/block}</title>
    <link rel="stylesheet" href="{$Think.config.PUBLIC_PATH}/static/libs/bootstrap/dist/css/bootstrap.min.css">
    <script type="text/javascript" src="{$Think.config.PUBLIC_PATH}/static/libs/jquery/dist/jquery.min.js"></script>
    <link rel="stylesheet" href="{$Think.config.PUBLIC_PATH}/static/theme/home/css/common.css">
</head>
<body>
<nav class="navbar navbar-inverse">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">愚公移山-代理平台</a>
        </div>
        <ul class="nav navbar-nav">
            <li><a href="{:url('control/full_coin')}">添加账号</a></li>
            <li><a href="{:url('account/import_account')}">批量加号</a></li>
            <li><a href="{:url('account/index')}">账号管理</a></li>
            <li><a href="{:url('control/index')}">功能中心</a></li>
            <li><a href="{:url('user/index')}">个人中心</a></li>


        </ul>
    </div>
</nav>
<div style="padding: 10px">
    <div class="container-fluid">
        {block name="body"}{/block}
    </div>
</div>
<div class="container">
    {block name="footer"}{/block}
</div>
</body>
</html>