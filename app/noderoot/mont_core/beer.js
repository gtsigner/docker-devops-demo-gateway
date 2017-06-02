//const

const http = require("http");
const querystring = require("querystring");
const restify = require('restify');
const log4js = require("log4js");

log4js.configure({
    appenders: [
        {type: 'console', category: 'normal'},
        {type: 'file', filename: `${__dirname}/runtime/task.log`, category: 'notice'}
    ]
});
const loggerNotice = log4js.getLogger("notice");
const loggerConsole = log4js.getLogger("normal");


//发送喇叭开启和关闭（0:关闭,1:开启）
let SEND_ENABLE = {
    SMALL_TAG: 1,
    SMALL_LB: 1,
    BIG_LB: 1,
};

//套餐类型


//喇叭类型
const LBType = {
    BIG_LB: 3,
    SMALL_LB: 2,
    SMALL_TAG: 1,
};

// Creates a JSON client
const apiClient = restify.createJsonClient({
    url: 'http://ygys.gz.1251278653.clb.myqcloud.com',
    headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Mobile Safari/537.36",
        "Referer": "http://ygys.tcdn.myqcloud.com",
        "Host": "ygys.gz.1251278653.clb.myqcloud.com",
    }
});

let BUILD_CHECKER = {
    isFullJinTie: 0,//是否刷精铁
    fullChildren: 0, //是否满子孙
    fullYj: 1,//是否满遗迹,
    fullStore: 1,//是否满商店,
    fullChenJiu: 1,//是否满成就,
    JiTanCount: 1,//祭坛数量,
    fullKit: 1,//满技能
    fullMount: 2,//满山,0:不做修改,1:,2:没领金币,3:领取金币(如果满山，必须满商店)
};

let BingHelper = {
    h: "",
    adminUid: "",
    currentUid: "",
    checkApiError: function (data) {
        let logs = null;
        switch (parseInt(data.s)) {
            case 1:
                logs = {msg: data.msg};
                break;
            case 104:
                logs = {msg: "数据有错,未知错误"};
                break;
            default:
                logs = null;
                break;
        }
        loggerConsole.error(logs);
        return logs;
    },
    sendLB: function (type, ct, callback) {
        let paramString = querystring.stringify({
            h: BingHelper.h,
            data: `{"mod":"Chat","do":"say","p":{"type":${type},"ct":"${ct}"}}`,
            v: 'v1',
            spid: '',
            sn: "",
            ygyssq: 0
        });
        apiClient.post("/api.php?" + paramString, function (err, req, res, data) {
            err = BingHelper.checkApiError(data);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    getLBList: function (callback) {
        let paramString = querystring.stringify({
            h: BingHelper.h,
            data: '{"mod": "Chat", "do": "getList", "p": {}}',
            v: 'v1',
            spid: '',
            sn: "",
            ygyssq: 0
        });
        apiClient.get("/api.php?" + paramString, function (err, req, res, data) {
            err = BingHelper.checkApiError(data);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    //获取h,和,code
    getHUidCode: function (params, callback) {
        let paramString = querystring.stringify({
            h: '',
            data: `{
                "mod": "User",
                "do": "login",
                "p": {
                    "data": {
                        "platform": ${params.platform},
                        "pf": "",
                        "pfkey": "",
                        "openid": "${params.openid}",
                        "openkey": "${params.openkey}",
                        "invkey": "",
                        "iopenid": "",
                        "itime": "",
                        "source": "",
                        "app_custom": "",
                        "spid": "WB"
                    }
                }
            }`,
            v: 'v1',
            spid: '',
            sn: "",
            ygyssq: '',
        });
        apiClient.get("/api.php?" + paramString, function (err, req, res, data) {
            err = BingHelper.checkApiError(data);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    //获取用户的数据信息
    getUserInfo: function (params, callback) {
        //
        let paramString = querystring.stringify({
            h: params.h,
            data: `{
                "mod": "User",
                "do": "getInfo",
                "p": {
                    "data": {
                        "platform": ${params.platform},
                        "pf": "",
                        "pfkey": "",
                        "openid": "${params.openid}",
                        "openkey": "${params.openkey}",
                        "invkey": "",
                        "iopenid": "",
                        "itime": "",
                        "source": "",
                        "app_custom": "",
                        "spid": "WB"
                    }
                }
            }`,
            v: 'v1',
            spid: '',
            sn: "",
            ygyssq: 0
        });
        apiClient.get("/api.php?" + paramString, function (err, req, res, data) {
            err = BingHelper.checkApiError(data);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    saveInfo: function (params, dt, callback) {
        let tmpData = {
            h: params.h,
            data: {
                "mod": "User",
                "do": "saveInfo",
                "p": {
                    "data": {
                        "platform": params.platform,
                        "pf": "",
                        "pfkey": "",
                        "openid": params.openid,
                        "openkey": params.openkey,
                        "invkey": "",
                        "iopenid": "",
                        "itime": "",
                        "source": "",
                        "app_custom": "",
                        "spid": "WB",
                        "saveData": dt,
                        "time": 1,
                    }
                }
            },
            v: "v1",
            spid: "",
            ygyssq: 0
        };
        tmpData.data = JSON.stringify(tmpData.data).replace(/[\n| ]/g, '');
        tmpData = querystring.stringify(tmpData);
        let post_options = {
            host: 'ygys.gz.1251278653.clb.myqcloud.com',
            port: '80',
            path: '/api.php',
            method: 'POST',
            headers: {
                'Content-length': tmpData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let post_req = http.request(post_options, function (res) {
            let tmp = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                tmp += chunk;
            });
            res.on("end", function () {
                callback(null, tmp);
            });
            res.on("error", function (err) {
                console.log(err);
            })
        });
        // post the data
        post_req.write(tmpData);
        post_req.end();
    },
    clearGame: function (params, callback) {
        let tmpData = {
            h: params.h,
            data: {
                "mod": "User",
                "do": "saveInfo",
                "p": {
                    "data": {
                        "platform": params.platform,
                        "pf": "",
                        "pfkey": "",
                        "openid": params.openid,
                        "openkey": params.openkey,
                        "invkey": "",
                        "iopenid": "",
                        "itime": "",
                        "source": "",
                        "app_custom": "",
                        "spid": "WB",
                        "saveData": {
                            "zsK": "0",
                            "akZ": 0,
                            "zsA": 0,
                            "CAN": 0,
                            "CN": 0,
                            "FS": "",
                            "MS": "0",
                            "total": "0",
                            "allTotal": "0",
                            "tmss": 0,
                            "tckzs": 0,
                            "tmmml": 0,
                            "tmch": 0,
                            "tmam": 0,
                            "tmmc": 0,
                            "tmma": 0,
                            "osc": "0",
                            "ss": "0",
                            "cyx": 0,
                            "ssbce": 0,
                            "yx": 0,
                            "yxce": 0,
                            "yxb": 1,
                            "yv": 12,
                            "cds": {"cd4": 0, "cd5": 0},
                            "stlg": 1494981582810,
                            "mmax": 0,
                            "f": {"lhs": {}, "d": {"bt": 0, "et": 0}},
                            "rd": {"br": {"i": 0, "s": "0"}},
                            "mlfc": 0,
                            "mssc": 0,
                            "msvc": 0,
                            "zsL": [],
                            "mlt": [],
                            "mslt": [{"id": 1, "lv": 0, "coolEnd": 0, "coolStart": 0}, {
                                "id": 2,
                                "lv": 0,
                                "coolEnd": 0,
                                "coolStart": 0
                            }, {"id": 3, "lv": 0, "coolEnd": 0, "coolStart": 0}, {
                                "id": 4,
                                "lv": 0,
                                "coolEnd": 0,
                                "coolStart": 0
                            }, {"id": 5, "lv": 0, "coolEnd": 0, "coolStart": 0}, {
                                "id": 6,
                                "lv": 0,
                                "coolEnd": 0,
                                "coolStart": 0
                            }],
                            "tsm": {
                                "1_1": {"id": "1_1", "s": 0},
                                "1_2": {"id": "1_2", "s": 0},
                                "1_3": {"id": "1_3", "s": 0},
                                "1_4": {"id": "1_4", "s": 0},
                                "1_5": {"id": "1_5", "s": 0},
                                "1_6": {"id": "1_6", "s": 0},
                                "1_7": {"id": "1_7", "s": 0},
                                "1_8": {"id": "1_8", "s": 0},
                                "2_1": {"id": "2_1", "s": 0},
                                "2_2": {"id": "2_2", "s": 0},
                                "2_3": {"id": "2_3", "s": 0},
                                "2_4": {"id": "2_4", "s": 0},
                                "2_5": {"id": "2_5", "s": 0},
                                "2_6": {"id": "2_6", "s": 0},
                                "2_7": {"id": "2_7", "s": 0},
                                "2_8": {"id": "2_8", "s": 0},
                                "3_1": {"id": "3_1", "s": 0},
                                "3_2": {"id": "3_2", "s": 0},
                                "3_3": {"id": "3_3", "s": 0},
                                "3_4": {"id": "3_4", "s": 0},
                                "3_5": {"id": "3_5", "s": 0},
                                "3_6": {"id": "3_6", "s": 0},
                                "3_7": {"id": "3_7", "s": 0},
                                "3_8": {"id": "3_8", "s": 0},
                                "4_1": {"id": "4_1", "s": 0},
                                "4_2": {"id": "4_2", "s": 0},
                                "4_3": {"id": "4_3", "s": 0},
                                "4_4": {"id": "4_4", "s": 0},
                                "4_5": {"id": "4_5", "s": 0},
                                "4_6": {"id": "4_6", "s": 0},
                                "5_1": {"id": "5_1", "s": 0},
                                "5_2": {"id": "5_2", "s": 0},
                                "5_3": {"id": "5_3", "s": 0},
                                "5_4": {"id": "5_4", "s": 0},
                                "5_5": {"id": "5_5", "s": 0},
                                "5_6": {"id": "5_6", "s": 0},
                                "5_7": {"id": "5_7", "s": 0},
                                "5_8": {"id": "5_8", "s": 0},
                                "6_1": {"id": "6_1", "s": 0},
                                "6_2": {"id": "6_2", "s": 0},
                                "6_3": {"id": "6_3", "s": 0},
                                "6_4": {"id": "6_4", "s": 0},
                                "6_5": {"id": "6_5", "s": 0},
                                "6_6": {"id": "6_6", "s": 0},
                                "6_7": {"id": "6_7", "s": 0},
                                "6_8": {"id": "6_8", "s": 0},
                                "6_9": {"id": "6_9", "s": 0},
                                "6_10": {"id": "6_10", "s": 0},
                                "7_1": {"id": "7_1", "s": 0},
                                "7_2": {"id": "7_2", "s": 0},
                                "7_3": {"id": "7_3", "s": 0},
                                "7_4": {"id": "7_4", "s": 0},
                                "7_5": {"id": "7_5", "s": 0},
                                "7_6": {"id": "7_6", "s": 0},
                                "7_7": {"id": "7_7", "s": 0},
                                "7_8": {"id": "7_8", "s": 0},
                                "8_1": {"id": "8_1", "s": 0},
                                "8_2": {"id": "8_2", "s": 0},
                                "8_3": {"id": "8_3", "s": 0},
                                "8_4": {"id": "8_4", "s": 0},
                                "8_5": {"id": "8_5", "s": 0},
                                "8_6": {"id": "8_6", "s": 0},
                                "8_7": {"id": "8_7", "s": 0},
                                "8_8": {"id": "8_8", "s": 0},
                                "8_9": {"id": "8_9", "s": 0},
                                "8_10": {"id": "8_10", "s": 0},
                                "9_1": {"id": "9_1", "s": 0},
                                "9_2": {"id": "9_2", "s": 0},
                                "9_3": {"id": "9_3", "s": 0},
                                "9_4": {"id": "9_4", "s": 0},
                                "9_5": {"id": "9_5", "s": 0},
                                "9_6": {"id": "9_6", "s": 0},
                                "10_1": {"id": "10_1", "s": 0},
                                "10_2": {"id": "10_2", "s": 0},
                                "10_3": {"id": "10_3", "s": 0},
                                "10_4": {"id": "10_4", "s": 0},
                                "10_5": {"id": "10_5", "s": 0},
                                "10_6": {"id": "10_6", "s": 0},
                                "11_1": {"id": "11_1", "s": 0},
                                "11_2": {"id": "11_2", "s": 0},
                                "11_3": {"id": "11_3", "s": 0},
                                "11_4": {"id": "11_4", "s": 0},
                                "11_5": {"id": "11_5", "s": 0},
                                "11_6": {"id": "11_6", "s": 0},
                                "11_7": {"id": "11_7", "s": 0},
                                "11_8": {"id": "11_8", "s": 0},
                                "12_1": {"id": "12_1", "s": 0},
                                "12_2": {"id": "12_2", "s": 0},
                                "12_3": {"id": "12_3", "s": 0},
                                "12_4": {"id": "12_4", "s": 0},
                                "12_5": {"id": "12_5", "s": 0},
                                "12_6": {"id": "12_6", "s": 0},
                                "12_7": {"id": "12_7", "s": 0},
                                "12_8": {"id": "12_8", "s": 0},
                                "13_1": {"id": "13_1", "s": 0},
                                "13_2": {"id": "13_2", "s": 0},
                                "13_3": {"id": "13_3", "s": 0},
                                "13_4": {"id": "13_4", "s": 0},
                                "13_5": {"id": "13_5", "s": 0},
                                "13_6": {"id": "13_6", "s": 0},
                                "14_1": {"id": "14_1", "s": 0},
                                "14_2": {"id": "14_2", "s": 0},
                                "14_3": {"id": "14_3", "s": 0},
                                "14_4": {"id": "14_4", "s": 0},
                                "14_5": {"id": "14_5", "s": 0},
                                "14_6": {"id": "14_6", "s": 0}
                            },
                            "BLN": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                            "item": {"2001": {"isBuy": 1, "num": 1}},
                            "iry": {},
                            "b": {
                                "r": [{"i": 3028, "l": 0}, {"i": 3029, "l": 0}, {"i": 3030, "l": 0}, {
                                    "i": 3031,
                                    "l": 0
                                }, {"i": 3045, "l": 0}], "lh": "0", "ch": "0", "th": "0", "let": 0
                            },
                            "o": {"s": "15", "d": "0", "t": 0, "m": 0},
                            "guide": 1
                        },
                        "time": 1
                    }
                },
            },
            v: "v1",
            spid: "",
            ygyssq: 0
        };
        tmpData.data = JSON.stringify(tmpData.data).replace(/[\n| ]/g, '');
        tmpData = querystring.stringify(tmpData);
        let post_options = {
            host: 'ygys.gz.1251278653.clb.myqcloud.com',
            port: '80',
            path: '/api.php',
            method: 'POST',
            headers: {
                'Content-length': tmpData.length,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        let post_req = http.request(post_options, function (res) {
            let tmp = '';
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                tmp += chunk;
            });
            res.on("end", function () {

                callback(null, tmp);
            });
            res.on("error", function (err) {
                console.log(err);
            })
        });
        // post the data
        post_req.write(tmpData);
        post_req.end();

    },
    //获取信息
    getZoneInfo: function (params, callback) {
        let paramString = querystring.stringify({
            h: params.h,
            data: '{"mod":"User","do":"getZoneInfo","p":{"data":{"platform":1,"pf":"wanba_ts","pfkey":"","openid":"C66D1E9B4C20EDE0EF235068CFB8FF2E","openkey":"D87960AD31BD81BE25DB7CCE64597B62","invkey":"","iopenid":"","itime":"","source":"","app_custom":"","spid":"SQ"}}}',
            v: 'v1',
            spid: '',
            sn: "",
            ygyssq: 1
        });
        apiClient.get("/api.php?" + paramString, function (err, req, res, data) {
            err = BingHelper.checkApiError(data);
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },
    //自动领取成就金币
    autoGetCoin: function (params) {
        // {"mod":"Achieve","do":"finish","p":{"aId":3000001}}
        // {"mod":"Achieve","do":"finish","p":{"aId":3000008}}
        for (let i = 0; i < 8; i++) {
            let aId = 3000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        // {"mod":"Achieve","do":"finish","p":{"aId":2000001}}
        // {"mod":"Achieve","do":"finish","p":{"aId":2000008}}
        for (let i = 0; i < 8; i++) {
            let aId = 2000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        // {"mod":"Achieve","do":"finish","p":{"aId":5000001}}
        // {"mod":"Achieve","do":"finish","p":{"aId":5000008}}
        for (let i = 0; i < 8; i++) {
            let aId = 5000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        // {"mod":"Achieve","do":"finish","p":{"aId":1000001}}
        // {"mod":"Achieve","do":"finish","p":{"aId":1000008}}
        for (let i = 0; i < 8; i++) {
            let aId = 1000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }

        // {"mod":"Achieve","do":"finish","p":{"aId":7000001}}
        // {"mod":"Achieve","do":"finish","p":{"aId":7000008}}
        for (let i = 0; i < 8; i++) {
            let aId = 7000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        for (let i = 0; i < 6; i++) {
            let aId = 14000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        for (let i = 0; i < 6; i++) {
            let aId = 13000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
        for (let i = 0; i < 8; i++) {
            let aId = 12000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });

        }
        for (let i = 0; i < 6; i++) {
            let aId = 4000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });

        }
        for (let i = 0; i < 6; i++) {
            let aId = 9000001 + i;
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 0,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${aId}}}`
                }), function (err, req, res, data) {
                console.log(aId, data);
            });
        }
    },
    //自动分享获取100金币
    autoShareFree5: function (params) {
        for (let i = 0; i < 6; i++) {
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    'v': 'v1',
                    'spid': '',
                    'ygyssq': 1,
                    inviteFrom: '14848114416407965178202',
                    data: '{"mod":"Share","do":"wanbaSq","p":{"ac":"newDay","type":"","top":"0"}}'
                }), function (err, req, res, data) {
                console.log(`分享获取金币第${i}次:`, data)
            });
        }
    },
    //自动祭祀山金币
    autoJsMont: function (params) {
        for (let i = 1; i <= 151; i++) {
            apiClient.get("/api.php?" + querystring.stringify({
                    h: params.h,
                    v: 'v1',
                    spid: '',
                    ygyssq: 1,
                    data: `{"mod":"Achieve","do":"finish","p":{"aId":${i}}}`
                }), function (err, req, res, data) {
                console.log(i, data);
            });
        }
    },
    //
    totalFullRobot: function (params, callback) {
        let dt = {
            "zsK": "999999",
            "akZ": 105671,
            "zsA": 99999,
            "CAN": 99999,
            "CN": 99999999,
            "FS": "",
            "MS": "8618214502425108",
            "total": "8618214502425168",
            "allTotal": "188567291084350",
            "tmss": 5778821732400,
            "tckzs": 9999999,
            "tmmml": 0,
            "tmch": 9999,
            "tmam": 9999,
            "tmmc": 0,
            "tmma": 0,
            "osc": "822943563599300",
            "ss": "3611768757750",
            "cyx": 0,
            "ssbce": 0,
            "yx": 0,
            "yxce": 0,
            "yxb": 1,
            "yv": 12,
            "cds": {
                "cd4": 0,
                "cd5": 0
            },
            "stlg": 1496282759541,
            "mmax": 150,
            "f": {
                "lhs": {},
                "d": {
                    "bt": 0,
                    "et": 0
                }
            },
            "rd": {},
            "mlfc": 10925,
            "mssc": 10027,
            "msvc": 10157,
            "zsL": [
                {
                    "id": 9,
                    "killNum": "0",
                    "time": "04/01 23:19",
                    "isKilled": true
                },
                {
                    "id": 5,
                    "killNum": "0",
                    "time": "04/02 23:17",
                    "isKilled": true
                },
                {
                    "id": 6,
                    "killNum": "0",
                    "time": "04/02 23:26",
                    "isKilled": true
                },
                {
                    "id": 8,
                    "killNum": "0",
                    "time": "04/02 23:35",
                    "isKilled": true
                }
            ],
            "mlt": [
                {
                    "id": 1,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 2,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 3,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 4,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 5,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 6,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 7,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 8,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 9,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 10,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 11,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 12,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 13,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 14,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 15,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 16,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 17,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 18,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 19,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 20,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 21,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 22,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 23,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 24,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 25,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 26,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 27,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 28,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 29,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 30,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 31,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 32,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 33,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 34,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 35,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 36,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 37,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 38,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 39,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 40,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 41,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 42,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 43,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 44,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 45,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 46,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 47,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 48,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 49,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 50,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 51,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 52,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 53,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 54,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 55,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 56,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 57,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 58,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 59,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 60,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 61,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 62,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 63,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 64,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 65,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 66,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 67,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 68,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 69,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 70,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 71,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 72,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 73,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 74,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 75,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 76,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 77,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 78,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 79,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 80,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 81,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 82,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 83,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 84,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 85,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 86,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 87,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 88,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 89,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 90,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 91,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 92,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 93,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 94,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 95,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 96,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 97,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 98,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 99,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 100,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 101,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 102,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 103,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 104,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 105,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 106,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 107,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 108,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 109,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 110,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 111,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 112,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 113,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 114,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 115,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 116,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 117,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 118,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 119,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 120,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 121,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 122,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 123,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 124,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 125,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 126,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 127,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 128,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 129,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 130,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 131,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 132,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 133,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 134,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 135,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 136,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 137,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 138,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 139,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 140,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 141,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 142,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 143,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 144,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 145,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 146,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 147,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 148,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 149,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                },
                {
                    "id": 150,
                    "startTime": 1451797330734,
                    "endTime": 1451797330734,
                    "costSon": "300",
                    "clickCount": 300,
                    "hp": "0",
                    "status": 3
                }
            ],
            "mslt": [
                {
                    "id": 1,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                },
                {
                    "id": 2,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                },
                {
                    "id": 3,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                },
                {
                    "id": 4,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                },
                {
                    "id": 5,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                },
                {
                    "id": 6,
                    "lv": 7,
                    "coolEnd": 0,
                    "coolStart": 0
                }
            ],
            "tsm": {
                "1_1": {
                    "id": "1_1",
                    "s": 2
                },
                "1_2": {
                    "id": "1_2",
                    "s": 2
                },
                "1_3": {
                    "id": "1_3",
                    "s": 2
                },
                "1_4": {
                    "id": "1_4",
                    "s": 2
                },
                "1_5": {
                    "id": "1_5",
                    "s": 2
                },
                "1_6": {
                    "id": "1_6",
                    "s": 2
                },
                "1_7": {
                    "id": "1_7",
                    "s": 2
                },
                "1_8": {
                    "id": "1_8",
                    "s": 2
                },
                "2_1": {
                    "id": "2_1",
                    "s": 2
                },
                "2_2": {
                    "id": "2_2",
                    "s": 2
                },
                "2_3": {
                    "id": "2_3",
                    "s": 2
                },
                "2_4": {
                    "id": "2_4",
                    "s": 2
                },
                "2_5": {
                    "id": "2_5",
                    "s": 2
                },
                "2_6": {
                    "id": "2_6",
                    "s": 2
                },
                "2_7": {
                    "id": "2_7",
                    "s": 2
                },
                "2_8": {
                    "id": "2_8",
                    "s": 2
                },
                "3_1": {
                    "id": "3_1",
                    "s": 2
                },
                "3_2": {
                    "id": "3_2",
                    "s": 2
                },
                "3_3": {
                    "id": "3_3",
                    "s": 2
                },
                "3_4": {
                    "id": "3_4",
                    "s": 2
                },
                "3_5": {
                    "id": "3_5",
                    "s": 2
                },
                "3_6": {
                    "id": "3_6",
                    "s": 2
                },
                "3_7": {
                    "id": "3_7",
                    "s": 2
                },
                "3_8": {
                    "id": "3_8",
                    "s": 2
                },
                "4_1": {
                    "id": "4_1",
                    "s": 2
                },
                "4_2": {
                    "id": "4_2",
                    "s": 2
                },
                "4_3": {
                    "id": "4_3",
                    "s": 2
                },
                "4_4": {
                    "id": "4_4",
                    "s": 2
                },
                "4_5": {
                    "id": "4_5",
                    "s": 2
                },
                "4_6": {
                    "id": "4_6",
                    "s": 2
                },
                "5_1": {
                    "id": "5_1",
                    "s": 2
                },
                "5_2": {
                    "id": "5_2",
                    "s": 2
                },
                "5_3": {
                    "id": "5_3",
                    "s": 2
                },
                "5_4": {
                    "id": "5_4",
                    "s": 2
                },
                "5_5": {
                    "id": "5_5",
                    "s": 2
                },
                "5_6": {
                    "id": "5_6",
                    "s": 2
                },
                "5_7": {
                    "id": "5_7",
                    "s": 2
                },
                "5_8": {
                    "id": "5_8",
                    "s": 2
                },
                "6_1": {
                    "id": "6_1",
                    "s": 1
                },
                "6_2": {
                    "id": "6_2",
                    "s": 1
                },
                "6_3": {
                    "id": "6_3",
                    "s": 1
                },
                "6_4": {
                    "id": "6_4",
                    "s": 1
                },
                "6_5": {
                    "id": "6_5",
                    "s": 1
                },
                "6_6": {
                    "id": "6_6",
                    "s": 1
                },
                "6_7": {
                    "id": "6_7",
                    "s": 1
                },
                "6_8": {
                    "id": "6_8",
                    "s": 1
                },
                "6_9": {
                    "id": "6_9",
                    "s": 1
                },
                "6_10": {
                    "id": "6_10",
                    "s": 2
                },
                "7_1": {
                    "id": "7_1",
                    "s": 2
                },
                "7_2": {
                    "id": "7_2",
                    "s": 2
                },
                "7_3": {
                    "id": "7_3",
                    "s": 2
                },
                "7_4": {
                    "id": "7_4",
                    "s": 2
                },
                "7_5": {
                    "id": "7_5",
                    "s": 2
                },
                "7_6": {
                    "id": "7_6",
                    "s": 2
                },
                "7_7": {
                    "id": "7_7",
                    "s": 2
                },
                "7_8": {
                    "id": "7_8",
                    "s": 2
                },
                "8_1": {
                    "id": "8_1",
                    "s": 0
                },
                "8_2": {
                    "id": "8_2",
                    "s": 0
                },
                "8_3": {
                    "id": "8_3",
                    "s": 0
                },
                "8_4": {
                    "id": "8_4",
                    "s": 0
                },
                "8_5": {
                    "id": "8_5",
                    "s": 0
                },
                "8_6": {
                    "id": "8_6",
                    "s": 0
                },
                "8_7": {
                    "id": "8_7",
                    "s": 0
                },
                "8_8": {
                    "id": "8_8",
                    "s": 0
                },
                "8_9": {
                    "id": "8_9",
                    "s": 0
                },
                "8_10": {
                    "id": "8_10",
                    "s": 0
                },
                "9_1": {
                    "id": "9_1",
                    "s": 2
                },
                "9_2": {
                    "id": "9_2",
                    "s": 2
                },
                "9_3": {
                    "id": "9_3",
                    "s": 2
                },
                "9_4": {
                    "id": "9_4",
                    "s": 2
                },
                "9_5": {
                    "id": "9_5",
                    "s": 2
                },
                "9_6": {
                    "id": "9_6",
                    "s": 2
                },
                "10_1": {
                    "id": "10_1",
                    "s": 0
                },
                "10_2": {
                    "id": "10_2",
                    "s": 0
                },
                "10_3": {
                    "id": "10_3",
                    "s": 0
                },
                "10_4": {
                    "id": "10_4",
                    "s": 0
                },
                "10_5": {
                    "id": "10_5",
                    "s": 0
                },
                "10_6": {
                    "id": "10_6",
                    "s": 0
                },
                "11_1": {
                    "id": "11_1",
                    "s": 0
                },
                "11_2": {
                    "id": "11_2",
                    "s": 0
                },
                "11_3": {
                    "id": "11_3",
                    "s": 0
                },
                "11_4": {
                    "id": "11_4",
                    "s": 0
                },
                "11_5": {
                    "id": "11_5",
                    "s": 0
                },
                "11_6": {
                    "id": "11_6",
                    "s": 0
                },
                "11_7": {
                    "id": "11_7",
                    "s": 0
                },
                "11_8": {
                    "id": "11_8",
                    "s": 0
                },
                "12_1": {
                    "id": "12_1",
                    "s": 2
                },
                "12_2": {
                    "id": "12_2",
                    "s": 2
                },
                "12_3": {
                    "id": "12_3",
                    "s": 2
                },
                "12_4": {
                    "id": "12_4",
                    "s": 2
                },
                "12_5": {
                    "id": "12_5",
                    "s": 2
                },
                "12_6": {
                    "id": "12_6",
                    "s": 2
                },
                "12_7": {
                    "id": "12_7",
                    "s": 2
                },
                "12_8": {
                    "id": "12_8",
                    "s": 2
                },
                "13_1": {
                    "id": "13_1",
                    "s": 2
                },
                "13_2": {
                    "id": "13_2",
                    "s": 2
                },
                "13_3": {
                    "id": "13_3",
                    "s": 2
                },
                "13_4": {
                    "id": "13_4",
                    "s": 2
                },
                "13_5": {
                    "id": "13_5",
                    "s": 2
                },
                "13_6": {
                    "id": "13_6",
                    "s": 2
                },
                "14_1": {
                    "id": "14_1",
                    "s": 2
                },
                "14_2": {
                    "id": "14_2",
                    "s": 2
                },
                "14_3": {
                    "id": "14_3",
                    "s": 2
                },
                "14_4": {
                    "id": "14_4",
                    "s": 2
                },
                "14_5": {
                    "id": "14_5",
                    "s": 2
                },
                "14_6": {
                    "id": "14_6",
                    "s": 2
                }
            },
            "BLN": [
                2000,
                2000,
                2000,
                2000,
                2000,
                2000,
                2000,
                2000,
                2000,
                1
            ],
            "item": {
                "1001": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1002": {
                    "isBuy": 1,
                    "num": 1
                },
                "1003": {
                    "isBuy": 1,
                    "num": 1
                },
                "1004": {
                    "isBuy": 1,
                    "num": 1
                },
                "1005": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1006": {
                    "isBuy": 1,
                    "num": 1
                },
                "1007": {
                    "isBuy": 1,
                    "num": 1
                },
                "1008": {
                    "isBuy": 1,
                    "num": 1
                },
                "1009": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1010": {
                    "isBuy": 1,
                    "num": 1
                },
                "1011": {
                    "isBuy": 1,
                    "num": 1
                },
                "1012": {
                    "isBuy": 1,
                    "num": 1
                },
                "1013": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1014": {
                    "isBuy": 1,
                    "num": 1
                },
                "1015": {
                    "isBuy": 1,
                    "num": 1
                },
                "1016": {
                    "isBuy": 1,
                    "num": 1
                },
                "1017": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1018": {
                    "isBuy": 1,
                    "num": 1
                },
                "1019": {
                    "isBuy": 1,
                    "num": 1
                },
                "1020": {
                    "isBuy": 1,
                    "num": 1
                },
                "1021": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1022": {
                    "isBuy": 1,
                    "num": 1
                },
                "1023": {
                    "isBuy": 1,
                    "num": 1
                },
                "1024": {
                    "isBuy": 1,
                    "num": 1
                },
                "1025": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1026": {
                    "isBuy": 1,
                    "num": 1
                },
                "1027": {
                    "isBuy": 1,
                    "num": 1
                },
                "1028": {
                    "isBuy": 1,
                    "num": 1
                },
                "1029": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1030": {
                    "isBuy": 1,
                    "num": 1
                },
                "1031": {
                    "isBuy": 1,
                    "num": 1
                },
                "1032": {
                    "isBuy": 1,
                    "num": 1
                },
                "1033": {
                    "isBuy": 1,
                    "num": 2000
                },
                "1034": {
                    "isBuy": 1,
                    "num": 1
                },
                "1035": {
                    "isBuy": 1,
                    "num": 1
                },
                "1036": {
                    "isBuy": 1,
                    "num": 1
                },
                "1037": {
                    "isBuy": 1,
                    "num": 1
                },
                "1038": {
                    "isBuy": 1,
                    "num": 1
                },
                "1039": {
                    "isBuy": 1,
                    "num": 1
                },
                "1040": {
                    "isBuy": 1,
                    "num": 1
                },
                "1041": {
                    "isBuy": 1,
                    "num": 1
                },
                "1042": {
                    "isBuy": 1,
                    "num": 1
                },
                "1043": {
                    "isBuy": 1,
                    "num": 1
                },
                "1044": {
                    "isBuy": 1,
                    "num": 1
                },
                "1045": {
                    "isBuy": 1,
                    "num": 1
                },
                "2001": {
                    "isBuy": 1,
                    "num": 1
                },
                "2002": {
                    "isBuy": 1,
                    "num": 1
                },
                "2003": {
                    "isBuy": 1,
                    "num": 1
                },
                "2004": {
                    "isBuy": 1,
                    "num": 1
                },
                "2005": {
                    "isBuy": 1,
                    "num": 1
                },
                "2006": {
                    "isBuy": 1,
                    "num": 1
                },
                "2007": {
                    "isBuy": 1,
                    "num": 1
                },
                "2008": {
                    "isBuy": 1,
                    "num": 1
                },
                "2009": {
                    "isBuy": 1,
                    "num": 1
                },
                "2010": {
                    "isBuy": 1,
                    "num": 1
                },
                "3001": {
                    "isBuy": 1,
                    "num": 10
                },
                "3002": {
                    "isBuy": 1,
                    "num": 32
                },
                "3003": {
                    "isBuy": 1,
                    "num": 1
                },
                "3004": {
                    "isBuy": 1,
                    "num": 1
                },
                "3005": {
                    "isBuy": 1,
                    "num": 1
                },
                "3006": {
                    "isBuy": 1,
                    "num": 1
                },
                "3007": {
                    "isBuy": 1,
                    "num": 1
                },
                "3008": {
                    "isBuy": 1,
                    "num": 1
                },
                "3009": {
                    "isBuy": 1,
                    "num": 1
                },
                "3010": {
                    "isBuy": 1,
                    "num": 1
                },
                "3011": {
                    "isBuy": 1,
                    "num": 2
                },
                "3012": {
                    "isBuy": 1,
                    "num": 1
                },
                "3013": {
                    "isBuy": 1,
                    "num": 1
                },
                "3014": {
                    "isBuy": 1,
                    "num": 1
                },
                "3015": {
                    "isBuy": 1,
                    "num": 1
                },
                "3016": {
                    "isBuy": 1,
                    "num": 1
                },
                "3017": {
                    "isBuy": 1,
                    "num": 1
                },
                "3018": {
                    "isBuy": 1,
                    "num": 1
                },
                "3019": {
                    "isBuy": 1,
                    "num": 1
                },
                "3020": {
                    "isBuy": 1,
                    "num": 1
                },
                "3021": {
                    "isBuy": 1,
                    "num": 1
                },
                "3022": {
                    "isBuy": 1,
                    "num": 1
                },
                "3023": {
                    "isBuy": 1,
                    "num": 1
                },
                "3024": {
                    "isBuy": 1,
                    "num": 1
                },
                "3025": {
                    "isBuy": 1,
                    "num": 1
                },
                "3026": {
                    "isBuy": 1,
                    "num": 1
                },
                "3027": {
                    "isBuy": 1,
                    "num": 1
                },
                "3028": {
                    "isBuy": 1,
                    "num": 0
                },
                "3029": {
                    "isBuy": 1,
                    "num": 0
                },
                "3030": {
                    "isBuy": 1,
                    "num": 0
                },
                "3031": {
                    "isBuy": 1,
                    "num": 0
                },
                "3041": {
                    "isBuy": 1,
                    "num": 10
                },
                "3042": {
                    "isBuy": 1,
                    "num": 1
                },
                "3043": {
                    "isBuy": 1,
                    "num": 1
                },
                "3044": {
                    "isBuy": 1,
                    "num": 1
                },
                "3045": {
                    "isBuy": 1,
                    "num": 0
                },
                "3046": {
                    "isBuy": 1,
                    "num": 1
                },
                "3047": {
                    "isBuy": 1,
                    "num": 1
                },
                "3048": {
                    "isBuy": 1,
                    "num": 1
                },
                "3051": {
                    "isBuy": 1,
                    "num": 40
                },
                "3052": {
                    "isBuy": 1,
                    "num": 38
                },
                "3053": {
                    "isBuy": 1,
                    "num": 39
                },
                "3054": {
                    "isBuy": 1,
                    "num": 31
                },
                "4001": {
                    "isBuy": 1,
                    "num": 1
                },
                "4002": {
                    "isBuy": 1,
                    "num": 1
                },
                "5001": {
                    "isBuy": 1,
                    "num": 1
                },
                "5002": {
                    "isBuy": 1,
                    "num": 1
                },
                "5003": {
                    "isBuy": 1,
                    "num": 1
                },
                "5004": {
                    "isBuy": 1,
                    "num": 1
                },
                "5005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001000": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001001": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001002": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001003": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001004": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001010": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001011": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001012": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001013": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001014": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001015": {
                    "isBuy": 1,
                    "num": 1
                },
                "80001016": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002000": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002010": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002011": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002012": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002013": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002014": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002015": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002016": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002017": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002018": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002019": {
                    "isBuy": 1,
                    "num": 1
                },
                "80002020": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003000": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003010": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003011": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003012": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003013": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003014": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003015": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003016": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003017": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003018": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003019": {
                    "isBuy": 1,
                    "num": 1
                },
                "80003020": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004000": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004010": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004011": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004012": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004013": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004014": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004015": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004016": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004017": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004018": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004019": {
                    "isBuy": 1,
                    "num": 1
                },
                "80004020": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005004": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80005010": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006004": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006005": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006006": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006007": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006008": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006009": {
                    "isBuy": 1,
                    "num": 1
                },
                "80006010": {
                    "isBuy": 1,
                    "num": 1
                }
            },
            "iry": {},
            "b": {
                "r": [
                    {
                        "i": 3028,
                        "l": 50
                    },
                    {
                        "i": 3029,
                        "l": 50
                    },
                    {
                        "i": 3030,
                        "l": 50
                    },
                    {
                        "i": 3031,
                        "l": 50
                    },
                    {
                        "i": 3045,
                        "l": 50
                    }
                ],
                "lh": "0",
                "ch": "0",
                "th": "0",
                "let": 1496296800386
            },
            "o": {
                "s": "15",
                "d": "0",
                "t": 0,
                "m": 0
            },
            "guide": 18
        };
        BingHelper.saveInfo(params, dt, function (err, data) {

            BingHelper.autoShareFree5(params);
            //自动领取金币
            BingHelper.autoGetCoin(params);
            //移山
            BingHelper.autoJsMont(params);
            callback(err, data);
        });
    },
    childTools: {
        //通过勾选构造新的data
        buildBtData: function (oldDt, checker) {
            if (checker.isFullJinTie > 0) {
                oldDt.o.s = checker.isFullJinTie;
                oldDt.o.m = -100;
                return oldDt;
            }
            if (1 === checker.fullChildren) {
                oldDt.total = "1.7e+300";
                oldDt.allTotal = "1.7e+300";
            }
            if (1 === checker.fullYj) {
                oldDt.b.r.forEach(function (item) {
                    item.l = 50;
                });
            }
            if (1 === checker.fullStore) {
                oldDt.item = {
                    "1001": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1002": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1003": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1004": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1005": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1006": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1007": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1008": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1009": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1010": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1011": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1012": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1013": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1014": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1015": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1016": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1017": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1018": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1019": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1020": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1021": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1022": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1023": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1024": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1025": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1026": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1027": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1028": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1029": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1030": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1031": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1032": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1033": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1034": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1035": {
                        "isBuy": 1,
                        "num": 2000
                    },
                    "1036": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1037": {
                        "isBuy": 1,
                        "num": 888888
                    },
                    "1038": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1039": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1040": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1041": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1042": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1043": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1044": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "1045": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2001": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2002": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2003": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "2010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3001": {
                        "isBuy": 1,
                        "num": 10
                    },
                    "3002": {
                        "isBuy": 1,
                        "num": 32
                    },
                    "3003": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3011": {
                        "isBuy": 1,
                        "num": 2
                    },
                    "3012": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3013": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3014": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3015": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3016": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3017": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3018": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3019": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3020": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3021": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3022": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3023": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3024": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3025": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3026": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3027": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3028": {
                        "isBuy": 1,
                        "num": 0
                    },
                    "3029": {
                        "isBuy": 1,
                        "num": 0
                    },
                    "3030": {
                        "isBuy": 1,
                        "num": 0
                    },
                    "3031": {
                        "isBuy": 1,
                        "num": 0
                    },
                    "3041": {
                        "isBuy": 1,
                        "num": 10
                    },
                    "3042": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3043": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3044": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3045": {
                        "isBuy": 1,
                        "num": 0
                    },
                    "3046": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3047": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3048": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "3051": {
                        "isBuy": 1,
                        "num": 40
                    },
                    "3052": {
                        "isBuy": 1,
                        "num": 38
                    },
                    "3053": {
                        "isBuy": 1,
                        "num": 39
                    },
                    "3054": {
                        "isBuy": 1,
                        "num": 31
                    },
                    "4001": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "4002": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "5001": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "5002": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "5003": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "5004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "5005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001000": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001001": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001002": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001003": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001011": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001012": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001013": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001014": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001015": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80001016": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002000": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002011": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002012": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002013": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002014": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002015": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002016": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002017": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002018": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002019": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80002020": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003000": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003011": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003012": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003013": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003014": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003015": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003016": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003017": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003018": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003019": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80003020": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004000": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004011": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004012": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004013": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004014": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004015": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004016": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004017": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004018": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004019": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80004020": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80005010": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006004": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006005": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006006": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006007": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006008": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006009": {
                        "isBuy": 1,
                        "num": 1
                    },
                    "80006010": {
                        "isBuy": 1,
                        "num": 1
                    }
                };
                Object.keys(oldDt.item).forEach(function (item) {
                    //不动祭坛
                    if (oldDt.item.key === "1037") {
                        return false;
                    }
                    oldDt.item[item].num = 2000;
                });
                Object.keys(oldDt.tsm).forEach(function (item) {
                    oldDt.tsm[item]['s'] = 2;
                });
            }
            if (1 === checker.fullChenJiu) {
                oldDt.akz = 990000;
                oldDt.zsA = 990000;
                oldDt.cyx = 105937;
                oldDt.mlfc = 10925;
                oldDt.mssc = 10027;
                oldDt.msvc = 10157;
                oldDt.tmma = 999999;
                oldDt.tmmc = 999999;
                oldDt.tmam = 1000;
                oldDt.tmch = 1000;
                oldDt.tmmml = 999;
                oldDt.ckzs = 999;
                oldDt.tmss = 9999;
                oldDt.CAN = 9999;
            }
            //满技能
            if (1 === checker.fullKit) {
                oldDt.mslt.forEach(function (item) {
                    item.lv = 20;
                })
            }
            //满山
            if (0 !== checker.fullMount) {
                oldDt.tmss = 9999;
                oldDt.mlt = [
                    {
                        "id": 1,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 2,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 3,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 4,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 5,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 6,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 7,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 8,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 9,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 10,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 11,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 12,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 13,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 14,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 15,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 16,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 17,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 18,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 19,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 20,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 21,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 22,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 23,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 24,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 25,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 26,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 27,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 28,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 29,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 30,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 31,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 32,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 33,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 34,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 35,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 36,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 37,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 38,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 39,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 40,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 41,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 42,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 43,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 44,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 45,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 46,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 47,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 48,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 49,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 50,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 51,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 52,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 53,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 54,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 55,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 56,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 57,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 58,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 59,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 60,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 61,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 62,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 63,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 64,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 65,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 66,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 67,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 68,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 69,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 70,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 71,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 72,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 73,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 74,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 75,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 76,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 77,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 78,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 79,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 80,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 81,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 82,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 83,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 84,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 85,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 86,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 87,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 88,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 89,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 90,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 91,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 92,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 93,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 94,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 95,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 96,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 97,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 98,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 99,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 100,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 101,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 102,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 103,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 104,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 105,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 106,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 107,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 108,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 109,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 110,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 111,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 112,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 113,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 114,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 115,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 116,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 117,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 118,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 119,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 120,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 121,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 122,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 123,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 124,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 125,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 126,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 127,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 128,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 129,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 130,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 131,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 132,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 133,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 134,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 135,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 136,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 137,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 138,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 139,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 140,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 141,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 142,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 143,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 144,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 145,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 146,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 147,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 148,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 149,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    },
                    {
                        "id": 150,
                        "startTime": 1451797330734,
                        "endTime": 1451797330734,
                        "costSon": "300",
                        "clickCount": 300,
                        "hp": "0",
                        "status": 3
                    }
                ];
                oldDt.mlt.forEach(function (item) {
                    item.status = 2;
                });
            }
            if (checker.JiTanCount > 0) {
                oldDt.BLN = [
                    2000,
                    2000,
                    2000,
                    2000,
                    2000,
                    2000,
                    2000,
                    2000,
                    2000,
                    888888
                ];
                oldDt.item['1037'].num = checker.JiTanCount;
                oldDt.BLN[oldDt.BLN.length - 1] = checker.JiTanCount;
            }
            return oldDt;
        }
        ,
        fullTool: function (params, checker, callback) {
            BingHelper.getUserInfo(params, function (err, data) {
                data.i.dt = BingHelper.childTools.buildBtData(data.i.dt, checker);
                BingHelper.saveInfo(params, data.i.dt, function (err, data) {
                    callback(err, data);
                });
            });
        },
    }
};


//1:小标签，2:小喇叭，3:大喇叭
/*
 setInterval(function () {
 BingHelper.getLBList(function (err, data) {
 if (err !== null) {
 loggerConsole.error(err);
 return false;
 }
 console.log(err, data);
 loggerConsole.debug("当前【小标签】用户名：" + data['1'][0].name);
 loggerConsole.debug("当前【小喇叭】用户名：" + data['2'][0].name);
 loggerConsole.debug("当前【大喇叭】用户名：" + data['3'][0].name);

 //小标签
 if (BingHelper.uId !== data['1'][0].uId && SEND_ENABLE.SMALL_TAG === 1) {
 BingHelper.sendLB(LBType.SMALL_TAG, "hello 你好哟,小标签。", function (err, data) {
 console.log(err, data);
 }
 );
 }
 //小喇叭
 if (BingHelper.uId !== data['2'][0].uId && SEND_ENABLE.SMALL_LB === 1) {
 BingHelper.sendLB(LBType.SMALL_LB, "hello 你好哟,小标签。", function (err, data) {
 console.log(err, data);
 }
 );
 }
 //大喇叭
 if (BingHelper.uId !== data['3'][0].uId && SEND_ENABLE.BIG_LB === 1) {
 BingHelper.sendLB(LBType.BIG_LB, "hello 你好哟,小标签。", function (err, data) {
 console.log(err, data);
 }
 );
 }
 });
 }, 1000000);
 */

//调用满子孙
let webUrl = "http://ygys.tcdn.myqcloud.com/wanba/staticOne/?resVer=3mh93uj&codeVer=b9270d0a&via=touch.list&platform=2&openid=7A247C6E9DE31EE7CD355630F84C8B53&openkey=A2A11D818D79F0BA026254B7FD170C18&pf=openmobile_androidts";
let parse = querystring.parse(webUrl);

module.exports.BingHelper = BingHelper;

BingHelper.getHUidCode({
    platform: parse.platform,
    openid: parse.openid,
    openkey: parse.openkey
}, function (err, data) {
    if (!err) {
        loggerConsole.debug("写入H参数成功");
        BingHelper.h = data.h;
        BingHelper.currentUid = data.uId;
    }

    let config = {
        h: data.h,
        platform: parse.platform,
        openid: parse.openid,
        openkey: parse.openkey
    };
    console.log(config);
    ///开始刷子
    // BingHelper.clearGame(config, function (err, data) {
    //     console.log("清理完毕", data);
    // });
    BingHelper.totalFullRobot(config, function (err, data) {
        console.log(data);
    });
    // BingHelper.clearGame(parse, function () {
    //
    // });
    // BingHelper.childTools.fullTool(config, BUILD_CHECKER, function (err, data) {
    //     console.log(data);
    // })
    BingHelper.getZoneInfo(config, function (err, data) {
        console.log(data);
    });

});


///GETS
/*

 apiClient.get("/api.php?" + querystring.stringify({
 h: data.h,
 'v': 'v1',
 'spid': '',
 'ygyssq': 1,
 inviteFrom: '14848114416407965178220',
 data: '{"mod": "Share", "do": "getGc", "p": {}}'
 }), function (err, req, res, data) {
 console.log(data);
 });
 apiClient.get("/api.php?" + querystring.stringify({
 h: data.h,
 'v': 'v1',
 'spid': '',
 'ygyssq': 1,
 inviteFrom: '14848114416407965178220',
 data: '{"mod": "Share", "do": "getGc", "p": {}}'
 }), function (err, req, res, data) {
 console.log(data);
 });
 apiClient.get("/api.php?" + querystring.stringify({
 h: data.h,
 'v': 'v1',
 'spid': '',
 'ygyssq': 1,
 inviteFrom: '14848114416407960178202',
 data: '{"mod":"Share","do":"wanbaSq","p":{"ac":"newDay","type":"","top":"0"}}'
 }), function (err, req, res, data) {
 console.log(data);
 });

 */
