<?php
/**
 * Email:zhaojunlike@gmail.com
 * Date: 6/3/2017
 * Time: 11:55 AM
 */

namespace app\index\controller;


class Api extends Base
{
    public function run_task()
    {
        set_time_limit(0);
        $account = model('ey_coin_account')->where(['coin_status' => 0])->order('last_flush_time ASC')->lock(true)->find();
        if (!$account || ($account->last_flush_time + 600) >= time()) {
            return "队列为空";
        }
        $account->last_flush_time = time();
        $account->save();
        $control = new \AccountControl();
        $info = $control->get_user_api($account->account_url);
        if ($info['s'] === 104) {
            return "链接已失效";
        }
        $ret = $control->get_jsCoin($info['h'], 0.7);
        $ret2 = $control->get_cjCoin($info['h'], 0.7);
        $ret3 = $control->get_shareCoin($info['h']);
        //查询余额入库
        $userCoinInfo = $control->get_user_info($info['h'], $account->platform);
        $account->coin_status = 1;
        $account->success_js += $ret['count'];
        $account->success_cj += $ret2['count'];
        $account->score = $userCoinInfo['score'];
        $account->coins = $userCoinInfo['gc'];
        $upRet = $account->save();
        if ($upRet) {
            return ("刷成功");
        } else {
            return ("刷失败");
        }
    }
}