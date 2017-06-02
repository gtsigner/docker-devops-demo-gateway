<?php

namespace app\index\controller;

class Index extends Auth
{
    public function index()
    {
        return $this->fetch();
    }
}
