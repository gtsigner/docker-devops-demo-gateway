<?php

namespace app\index\controller;

use think\Controller;

class Base extends Controller
{
    protected $page_limit = 20;

    protected function _initialize()
    {

        $seo = [
            'title' => '愚公移山',
            'desc' => '',
            'keywords' => '',
        ];
        $this->assign('_seo', $seo);
    }
}
