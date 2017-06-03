<?php

//愚公移山类库
class AccountControl
{
    private static $api_url = "http://ygys.gz.1251278653.clb.myqcloud.com/api.php";
    private static $api_header = [
        "User-Agent" => "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36",
        "Referer" => "http://ygys.tcdn.myqcloud.com",
        "Host" => "ygys.gz.1251278653.clb.myqcloud.com",
    ];

    //获取用户H数据
    public function get_user_api($url)
    {
        parse_str(parse_url($url, PHP_URL_QUERY), $ret);
        $package = [
            'h' => '',
            'data' => '{
                "mod":"User",
                "do": "login",
                "p": {
                    "data": {
                        "platform": ' . $ret['platform'] . ',
                        "pf": "",
                        "pfkey": "",
                        "openid": "' . $ret['openid'] . '",
                        "openkey": "' . $ret['openkey'] . '",
                        "invkey": "",
                        "iopenid": "",
                        "itime": "",
                        "source": "",
                        "app_custom": "",
                        "spid": "WB"
                    }
                }
            }',
            'v' => 'v1',
            'spid' => '',
            'sn' => "",
            'ygyssq' => '',
        ];
        $ret = \HttpHelper::http(self::$api_url, $package, "GET", self::$api_header);
        $ret = json_decode($ret, true);
        return $ret;
    }

    public function get_user_info($h, $platform)
    {
        //
        $package = [
            'h' => $h,
            'data' => '',
            'v' => 'v1',
            'yqyssq' => '0',
        ];
        $package['data'] = '{"mod":"User","do":"getZoneInfo","p":{"data":{"platform":' . $platform . ',"pf":"wanba_ts","pfkey":"","openid":"C66D1E9B4C20EDE0EF235068CFB8FF2E","openkey":"D87960AD31BD81BE25DB7CCE64597B62","invkey":"","iopenid":"","itime":"","source":"","app_custom":"","spid":"SQ"}}}';
        $ret = \HttpHelper::http(self::$api_url, $package, "GET", self::$api_header);
        $ret = json_decode($ret, true);
        return $ret;
    }

    //获取js150山的金币
    public function get_jsCoin($h, $sleep = 2)
    {
        $package = [
            'h' => $h,
            'data' => '',
            'v' => 'v1',
            'yqyssq' => '0',
        ];
        $successCount = 0;
        for ($i = 1; $i <= 155; $i++) {
            $package['data'] = '{"mod":"Achieve","do":"finish","p":{"aId":' . $i . '}}';
            $ret = \HttpHelper::http(self::$api_url, $package, "POST", self::$api_header);
            $ret = json_decode($ret, true);
            if ($ret['s'] === 0) {
                $successCount++;
            }
            sleep($sleep);
        }
        $json['msg'] = "祭祀成功刷到了:{$successCount}次金币";
        $json['count'] = $successCount;
        return $json;
    }

    public function get_shareCoin($h, $sleep = 0)
    {
        $successCount = 0;
        $package = [
            'h' => $h,
            'v' => 'v1',
            'yqyssq' => '1',
            'spid' => '',
            'inviteFrom' => '14848114416407965178203'
        ];
        for ($i = 1; $i <= 5; $i++) {
            $package['data'] = '{"mod":"Share","do":"wanbaSq","p":{"ac":"newDay","type":"","top":"0"}}';
            $ret = \HttpHelper::http('http://ygys.gz.1251278653.clb.myqcloud.com/api.php', $package, "GET", self::$api_header);
            $ret = json_decode($ret, true);
            if ($ret['s'] == 0) {
                $successCount++;
            }
        }
        $json['msg'] = "分享成功刷到了:{$successCount}次金币";
        $json['count'] = $successCount;
        return $json;

    }

    //获取成就金币
    public function get_cjCoin($h, $sleep = 2)
    {
        $successCount = 0;
        $package = [
            'h' => $h,
            'data' => '',
            'v' => 'v1',
            'yqyssq' => '0',
        ];
        for ($i = 1; $i <= 14; $i++) {
            for ($j = 1; $j <= 8; $j++) {
                $package['data'] = '{"mod":"Achieve","do":"finish","p":{"aId":' . $i . '00000' . $j . '}}';
                $ret = \HttpHelper::http('http://ygys.gz.1251278653.clb.myqcloud.com/api.php', $package, "POST", self::$api_header);
                $ret = json_decode($ret, true);
                if ($ret['s'] == 0) {
                    $successCount++;
                }
                sleep($sleep);
            }
        }
        $json['msg'] = "成就成功刷到了:{$successCount}次金币";
        $json['count'] = $successCount;
        return $json;
    }
}