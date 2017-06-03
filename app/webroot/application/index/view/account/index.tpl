{extend name="base/base" /}
{block name="title"}
    {$_seo.title}
{/block}
{block name="body"}
    <div class="row">
        <table class="table table-hover table-bordered">
            <thread>
                <tr>
                    <th>ID</th>
                    <th>账号</th>
                    <th>密码</th>
                    <th>URL</th>
                    <th>创建时间</th>
                    <th>刷钱时间</th>
                    <th>祭祀</th>
                    <th>成就</th>
                    <th>平台</th>
                    <th>余额</th>
                    <th>状态</th>
                    <th>操作</th>
                </tr>
            </thread>
            <tbody>
            {foreach $data_list as $item}
                <tr>
                    <td>{$item.id}</td>
                    <td>{$item.account_no}</td>
                    <td>{$item.account_pwd}</td>
                    <td>{$item.account_pwd}</td>
                    <td>{$item.create_time}</td>
                    <td>{:date("Y-m-d H:i:s",$item.last_flush_time)}</td>
                    <td>{$item.success_js}</td>
                    <td>{$item.success_cj}</td>
                    <td>{if $item.platform eq 1}Android{/if}{if $item.platform eq 2}IOS{/if}</td>
                    <td>{$item.coins}</td>
                    <td>{$item.coin_status}</td>
                    <td>
                        <a class="label label-success" href="{$item.account_url}" target="_blank">进入游戏</a>
                        <a class="label label-danger" href="{$item.account_url}" target="_blank">重刷</a>
                    </td>
                </tr>
            {/foreach}
            </tbody>
        </table>
        <div class="page text-center">
            {$page}
        </div>
    </div>
{/block}

