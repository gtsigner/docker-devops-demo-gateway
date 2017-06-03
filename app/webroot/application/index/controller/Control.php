<?php
/**
 * Email:zhaojunlike@gmail.com
 * Date: 5/30/2017
 * Time: 3:24 PM
 */

namespace app\index\controller;


use HttpClient;
use think\Config;

class Control extends Auth
{

    public function full_coin()
    {
        if ($this->request->isPost()) {
            $url = $this->request->request('account_link');
            $account_no = $this->request->request('account_no');
            $account_pwd = $this->request->request('account_pwd');
            $data['account_url'] = $url;
            $data['account_no'] = $account_no;
            $data['account_pwd'] = $account_pwd;
            $data['create_time'] = time();
            $ret = model('ey_coin_account')->insert($data);
            if ($ret) {
                $this->success("添加成功");
            } else {
                $this->error("添加失败");
            }
        } else {
            return $this->fetch();
        }
    }



    public function get_user_info()
    {
        $id = $this->request->request('id');
        $account = model('ey_coin_account')->where(['id' => $id])->lock(true)->find();
        if (!$account) {
            $this->error("获取信息失败");
        }
        $control = new \AccountControl();
        $info = $control->get_user_api($account->account_url);
        $userCoinInfo = $control->get_user_info($info['h'], $account->platform);
        $account->score = $userCoinInfo['score'];
        $account->coins = $userCoinInfo['gc'];
        $upRet = $account->save();
        if ($upRet) {
            $this->success("金币刷新成功");
        } else {
            $this->error("金币刷新失败");
        }
    }
}