<?php

namespace app\index\controller;


use HttpClient;
use think\captcha\Captcha;

class Protal extends Base
{


    public function login()
    {
        if ($this->request->isPost()) {
            //登陆验证
            $cap = new Captcha();
            if (!$cap->check($this->request->post('verify_code'), 1)) {
                $this->error("Error Verify");
            }
            session('login_uid', 1);
            $this->success("登陆成功", url("index/index"));
        } else {
            return $this->fetch();
        }
    }

    public function verify_code()
    {
        $captcha = new Captcha();
        return $captcha->entry(1);
    }
}
