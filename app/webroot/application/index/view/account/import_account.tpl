{extend name="base/base"/}
{block name="body"}
    <div class="row">
        <div class="col-xs-6 col-xs-offset-3">
            <form action="{:url('account/import_account')}" method="post">
                <div class="form-group">
                    <label for="" class="control-label">请输入批量文本：</label>
                    <textarea name="content" id="" class="form-control" rows="20"></textarea>
                </div>
                <div class="form-group">
                    <label for="" class="control-label">选择平台(1:android,2:ios)：</label>
                    <select name="platform" class="form-control">
                        <option value="1">Android</option>
                        <option value="2">IOS</option>
                    </select>
                </div>
                <div class="form-group">
                    <button class="btn btn-block btn-lg btn-primary" type="submit">提交</button>
                </div>
            </form>
        </div>
    </div>
{/block}