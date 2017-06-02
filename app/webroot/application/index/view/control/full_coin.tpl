{extend name="base/base"/}
{block name="body"}
    <div class="row">
        <div class="col-xs-6 col-xs-offset-3">
            <form action="{:url('control/full_coin')}" method="post">
                <div class="form-group">
                    <label for="" class="control-label">
                        QQ账号：
                    </label>
                    <input type="text" class="form-control" name="account_no">
                </div>
                <div class="form-group">
                    <label for="" class="control-label">
                        QQ密码：
                    </label>
                    <input type="text" class="form-control" name="account_pwd">
                </div>
                <div class="form-group">
                    <label for="" class="control-label">
                        平台类型ID(1.android,2.ios)：
                    </label>
                    <input type="text" class="form-control" name="platform">
                </div>
                <div class="form-group">
                    <label for="" class="control-label">请输入链接：</label>
                    <textarea name="account_link" id="" cols="30" rows="10" class="form-control"></textarea>
                </div>
                <div class="form-group">
                    <button class="btn btn-block btn-lg btn-primary" type="submit">提交</button>
                </div>
            </form>
        </div>
    </div>
{/block}