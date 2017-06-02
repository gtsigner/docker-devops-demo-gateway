{extend name="base/base"/}
{block name="body"}
    <div class="container">
        <div class="row">
            <h1 class="text-center text-primary">愚公移山-代理登陆</h1>
        </div>
        <div class="row">
            <div class="col-xs-4 col-xs-offset-4">
                <form action="{:url('protal/login')}" method="post">
                    <div class="form-group">
                        <label for="" class="control-label">
                            用户名：
                        </label>
                        <input type="text" class="form-control" name="username">
                    </div>
                    <div class="form-group">
                        <label for="" class="control-label">
                            登陆密码：
                        </label>
                        <input type="password" class="form-control" name="password">
                    </div>
                    <div class="form-group">
                        <label for="" class="control-label">
                            验证码Code：
                        </label>
                        <input type="text" class="form-control" name="verify_code">
                    </div>
                    <div class="form-group">
                        <img id="protal-login-verify" src="{:url('protal/verify_code')}" alt="验证码"
                             style="width: 100%;cursor: pointer">
                    </div>
                    <div class="form-group">
                        <button class="btn btn-primary btn-block" type="submit">登陆系统</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        $(function () {
            $("#protal-login-verify").click(function (e) {
                e.preventDefault();
                $(this).attr("src", "{:url('protal/verify_code')}?_r=" + Math.random());

            })
        });
    </script>
{/block}