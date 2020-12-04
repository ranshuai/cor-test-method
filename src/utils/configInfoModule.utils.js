/**
 * ConfigInfoModulUtils 工具
 */
import { HttpService } from "@/provides/httpService";

class ConfigInfoModulUtils {
    constructor() {
        this.$vue = null;
        this.$route = null;
    }
    init(vue,callback) {
        this.$vue = vue;
        this.$route = this.$vue.$route;
        this.getConfigInfo(callback);
    }
    async getConfigInfo(callback) {
        //获取getReportxml
        let reportxml = null;
        try {
            reportxml = await this.getReportxml();
        } catch (err) {
            console.warn('获取getReportxml失败')
        }
        if (reportxml && reportxml.tbTagging) {
            //解析 cornerMark 字符串json
            let cornerMark = JSON.parse(reportxml.tbTagging.cornerMark);
            //给 cornerMark 赋值
            this.$vue.V2_cornerMark = await this.cornerMark(cornerMark);
            //布局配置
            if (reportxml.tbTagging.htmlData) {
                this.$vue.V2_defaultLayoutConfig = {};


                let _dataT = JSON.parse(reportxml.tbTagging.htmlData);

                if (_dataT.inspectH) {
                    this.$vue.V2_defaultLayoutConfig.inspectQ = _dataT.inspectQ.ViewprtNum
                    this.$vue.clickEventInspectTable(_dataT.inspectQ, _dataT.inspectH.type);
                } else {
                    this.$vue.clickEventInspectTable({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'clickEventInspectTable');
                }
                if (JSON.stringify(_dataT.sequenceH) != "{}") {
                    this.$vue.V2_defaultLayoutConfig.sequenceQ = _dataT.sequenceQ.ViewprtNum
                    setTimeout(() => {
                        for (let i = 0; i < _dataT.inspectQ.ViewprtNum; i++) {
                            if (i < this.$vue.patientSeriesList.length) {
                                this.$vue.LayoutController.secondLayoutBlock[i] = _dataT.sequenceQ.ViewprtNum;
                            }
                        }
                        this.$vue.refreshViewprtGridSub(_dataT.sequenceQ, 'layoutInspectInit', _dataT.inspectQ.ViewprtNum);
                    }, 300)
                    //   _this.clickEventOrderTable(_dataT.sequenceQ, _dataT.sequenceH.type);
                } else {
                    this.$vue.refreshViewprtGridSub({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'layoutInspectInit', 1);
                }


            } else {
                this.$vue.clickEventInspectTable({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'clickEventInspectTable');
                this.$vue.refreshViewprtGridSub({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'layoutInspectInit', 1);
            }


        } else {
            //默认模版 1*1
            this.$vue.clickEventInspectTable({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'clickEventInspectTable');
            this.$vue.refreshViewprtGridSub({ style: 'width:100%;height:100%;', ViewprtNum: 1 }, 'layoutInspectInit', 1);
        }

        callback(this.$vue)
    }

    getReportxml() {
        return new Promise((reslove, reject) => {
            HttpService({
                url: "/powerfilmer/login/getReportxml",
                method: "post",
                data: {
                    note: "1", // 是区分影像还是报告的配置的
                    hospCode: this.$route.query.hospcode,
                    tcStType: this.$route.query.tcStType,
                },
                headers: {},
            }).then((res) => {
                if (res.success && res.result) {
                    reslove(res.result)
                }
            })
        })

    }

    async cornerMark(cornerMark) {
        let _cornerMark = {};
        for (let item in cornerMark) {
            _cornerMark[item] = [];

            for (let data in cornerMark[item]) {
                let _data = cornerMark[item][data];
                /**
                   type = 1 从后台接口返回的数据里面找对应的key 并赋值
                   type = 2 从DICOM源数据中读取数据
                   tyoe = 3 用户手动输入的信息 直接显示
               */
                let str = "";
                if (_data.note == 1) {
                    if (sessionStorage.getItem("configInfoKeyRow")) {
                        let configInfoKey = JSON.parse(sessionStorage.getItem("configInfoKeyRow"));
                        if (cornerMark[item][data].name == "TC_PT_GENDER") {
                            if (configInfoKey[data.name] == "F") {
                                str = "女";
                            } else if (configInfoKey[data.name] == "M") {
                                str = "男";
                            } else {
                                str = configInfoKey[data.name];
                            }
                        } else {
                            str = configInfoKey[cornerMark[item][data].name];
                        }
                    }

                }
                if (_data.note == 2) {
                    let imageId = this.$vue.patientSeriesList[0].getDcmFilePath[0];
                    let _this = this;
                    function aa() {
                        return new Promise((reslove, reject) => {
                            cornerstone.loadImage(imageId).then(image => {
                                if (image && image.data && image.data.byteArray) {
                                    let byteArray = image.data.byteArray;
                                    var dataSet = dicomParser.parseDicom(byteArray /*, options */);
                                    let dicomCodeW = _this.replaceW(_data.name);
                                    if (dicomCodeW == "x00100040") {
                                        if (dataSet.string(`${dicomCodeW}`) == "F") {
                                            str = "女";
                                            reslove(str);
                                        } else {
                                            str = "男";
                                            reslove(str);
                                        }
                                    } else {
                                        //判断字符集编码类型
                                        let characterSet = dataSet.string('x00080005');

                                        if (characterSet == 'GB18030') {
                                            function readFixedString(byteArray, position, length) {
                                                if (length < 0) {
                                                    throw 'dicomParser.readFixedString - length cannot be less than 0'
                                                }
                                                if (position + length > byteArray.length) {
                                                    throw 'dicomParser.readFixedString: attempt to read past end of buffer'
                                                }
                                                let byteArr = []
                                                for (let i = 0; i < length; i++) {
                                                    let byte = byteArray[position + i]
                                                    byteArr.push(byte)
                                                }
                                                return byteArr
                                            }

                                            function stringChinese(tag, data, callback) {
                                                let element = data.elements[tag]
                                                if (element && element.length > 0) {
                                                    let fixedString = readFixedString(data.byteArray, element.dataOffset, element.length)
                                                    let array = new Uint8Array(fixedString)
                                                    let blob = new Blob([array])
                                                    let reader = new FileReader()
                                                    reader.readAsText(blob, 'gb18030')
                                                    reader.onload = callback
                                                }
                                            }

                                            stringChinese(`${dicomCodeW}`, image.data, function (e) {
                                                str = e.target.result;
                                                reslove(str);
                                            })
                                        } else {
                                            str = dataSet.string(`${dicomCodeW}`);
                                            reslove(str);
                                        }
                                    }

                                } else {
                                    reslove(str);
                                }
                            })
                        })
                    }
                    str = await aa();
                }
                if (_data.note == 3) {
                    str = _data.name;
                }
                _cornerMark[item].push(str)
            }
        }
        return _cornerMark;
    }

    replaceW(item) {//吧f替换成e
        let newstr = item.replace('(', '');
        newstr = newstr.replace(')', '');
        newstr = newstr.replace(',', '');
        if (newstr.indexOf("x") == -1) {
            newstr = 'x' + newstr;
        }
        return newstr;
    }

}

const configInfoModulUtils = new ConfigInfoModulUtils()


export default configInfoModulUtils;
