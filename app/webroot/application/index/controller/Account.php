<?php
/**
 * Email:zhaojunlike@gmail.com
 * Date: 6/2/2017
 * Time: 11:52 AM
 */

namespace app\index\controller;


class Account extends Auth
{
    //导入账号
    public function import_account()
    {
        if ($this->request->isPost()) {
            $content = $this->request->post('content');
            $platform = $this->request->post('platform');
            $arr = explode("\n", $content);
            $succCount = 0;
            foreach ($arr as $item) {
                if (strlen($item) <= '10') {
                    continue;
                }
                $acc = explode('---', $item);
                if (count($acc) !== 3) {
                    $this->error('对不起,数据验证失败');
                }
                $account = [];
                $account['account_no'] = $acc[0];
                $account['account_pwd'] = $acc[1];
                $account['account_url'] = $acc[2];
                $account['create_time'] = time();
                $account['platform'] = $platform;
                $addRet = model('ey_coin_account')->insert($account);
                if ($addRet) {
                    $succCount++;
                }
            }
            $this->success("添加成功：{$succCount}条数据");
        } else {
            return $this->fetch();
        }
    }

    public function index()
    {
        $p = $this->request->request('p');
        $data_list = model('ey_coin_account')->where([])->order('id DESC')->paginate($this->page_limit);
        $this->assign('page', $data_list->render());
        $this->assign('data_list', $data_list);
        return $this->fetch();
    }

    //删除
    public function del()
    {

    }
}