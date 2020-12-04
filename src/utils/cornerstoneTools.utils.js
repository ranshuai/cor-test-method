import _ from "lodash";
/**
 * CornerstoneToolsUtils 工具
 */
class CornerstoneToolsUtils {

    constructor() {
        this.panZoomSynchronizer = null;
        this.wwwcSynchronizer = null;
        this.stackScrollSynchronizer = null;
        this.referenceLines = null;
    }
    /**
     * @param {*} obj
     * @param {*} elements 所有的二级viewport
     * @param {*} activeViewportSubIndex  当前选中的下标
     * @param {*} parentEvent  子导航的父级
     */
    init(elements, activeViewportSubIndex, fileInfo, _this) {
        let activeToolsBar = _this.$refs.customToolsBar.getActiveToolsBar()

        if (
            [
              "布局",
              "反色",
              "水平反转",
              "垂直反转",
              "顺时针旋转",
              "逆时针旋转",
              "重置",
              "显示图层",
              "显示比例尺",
              "显示四角标注",
              "同步",
              "解除同步",
              "解除定位线",
              "空间定位器",
              "清除",
              "保存",
            ].indexOf(activeToolsBar.title) == -1
          ) {
               _this.bindingEventHandlersTool = activeToolsBar.tool;
          }
        //获取当前激活的工具
        const enabledElements = CornerstoneToolsUtils._getAllSecondElements(elements, activeViewportSubIndex)
        const enabledElement = CornerstoneToolsUtils._getAllSecondElement(elements, activeViewportSubIndex)
        CornerstoneToolsUtils._resetMouseRight(activeToolsBar, enabledElements, _this);
        // console.log(activeToolsBar)
        //是否显示 4角标注
        if (activeToolsBar.tool == 'showHideTag') {
            if (!activeToolsBar.selsected) {
                _this.ViewportOverlayBOk = false;
            } else {
                _this.ViewportOverlayBOk = true;
            }
            return
        }
        //是否显示 比例迟
        if (activeToolsBar.tool == 'showHideScaleOverlay') {
            if (!activeToolsBar.selsected) {
                cornerstoneTools.setToolDisabled("ScaleOverlay", {});
            } else {
                cornerstoneTools.setToolActive("ScaleOverlay", {});
            }
            return
        }
        //调窗
        if (activeToolsBar.tool == "Wwwc") {
            let viewporTargetSub = _this.$refs.viewporTargetSub;
            if (!this['wwwcSynchronizer']) {
                this['wwwcSynchronizer'] = new cornerstoneTools.Synchronizer(
                    'cornerstoneimagerendered',
                    cornerstoneTools['wwwcSynchronizer']
                );
            }
            /**
                *  先清除
                */
            viewporTargetSub.forEach(e => {
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['wwwcSynchronizer'].remove(e);
            })

            /*
            * 添加
            */
            enabledElements.forEach((e) => {
                //如果没有image
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['wwwcSynchronizer'].add(e);
            });

            if (activeToolsBar.title == '调窗') {
                // cornerstoneTools.setToolActive(obj.tool, { mouseButtonMask: 1 });
                cornerstoneTools.setToolActive('Wwwc', {
                    mouseButtonMask: 1,
                    synchronizationContext: this['wwwcSynchronizer'],
                });

                return
            }
            //给父级导航添加样式
            if (activeToolsBar.title == "默认") {
                // cornerstone.reset(enabledElement);
                let image = cornerstone.getImage(enabledElements[0]);
                const defaultViewport = cornerstone.getDefaultViewportForImage(enabledElements[0], image)
                let viewport = cornerstone.getViewport(enabledElements[0])
                viewport.voi.windowWidth = defaultViewport.voi.windowWidth
                viewport.voi.windowCenter = defaultViewport.voi.windowCenter
                viewport.invert = false
                cornerstone.setViewport(enabledElements[0], viewport);
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
                return;
            }
            let viewport = cornerstone.getViewport(enabledElements[0]);

            viewport.voi = {
                windowWidth: Number(activeToolsBar.value.width),
                windowCenter: Number(activeToolsBar.value.center),
            };
            cornerstone.setViewport(enabledElements[0], viewport);
            cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        }
        //空间定位器
        if (activeToolsBar.tool == "Crosshairs") {
            let numImagesLoaded = 0;
            let viewporTargetSub = _this.$refs.viewporTargetSub;
            function addReferenceLinesTool() {
                const synchronizer = new cornerstoneTools.Synchronizer(
                    "cornerstonenewimage",
                    cornerstoneTools.updateImageSynchronizer
                );
                viewporTargetSub.forEach((e) => {
                    synchronizer.add(e);
                });

                cornerstoneTools.setToolActive("Crosshairs", {
                    mouseButtonMask: 1,
                    synchronizationContext: synchronizer,
                });
            }
            const handleImageRendered = (evt) => {
                evt.removeEventListener(
                    "cornerstoneimagerendered",
                    handleImageRendered
                );

                numImagesLoaded++;
                if (numImagesLoaded === 2) {
                    addReferenceLinesTool();
                }
            };
            viewporTargetSub.forEach((e) => {
                handleImageRendered(e);
            });
            return;
        }
        //反色
        if (activeToolsBar.tool == "invplain") {
            if (enabledElements.length > 0) {
                enabledElements.forEach(ele => {
                    let viewport = cornerstone.getViewport(ele);
                    viewport.invert = !viewport.invert;
                    cornerstone.setViewport(ele, viewport);
                })
            }
            return;
        }
        //重置
        if (activeToolsBar.tool == "reset") {
            if (enabledElements.length > 0) {
                enabledElements.forEach(ele => {
                    cornerstone.reset(ele);
                    cornerstoneTools.stopClip(ele);
                })

            }
            return;
        }
        if (activeToolsBar.tool == "rotateViewport+") {
            if (enabledElements.length > 0) {
                enabledElements.forEach(ele => {
                    let viewport = cornerstone.getViewport(ele);
                    viewport.rotation += 90;
                    cornerstone.setViewport(ele, viewport);
                })
            }
            return;
        }
        if (activeToolsBar.tool == "rotateViewport-") {

            if (enabledElements.length > 0) {
                enabledElements.forEach(ele => {
                    let viewport = cornerstone.getViewport(ele);
                    viewport.rotation -= 90;
                    cornerstone.setViewport(ele, viewport);
                })

            }
            return;
        }
        if (activeToolsBar.tool == "playClip") {
            if (_this.viewportPlayConfigCopy[_this.viewportPlayConfigActive]) {
                _this.viewportPlayConfigCopy[_this.viewportPlayConfigActive] = false;
                // obj.text = "播放";
                activeToolsBar.selsected = false;
                cornerstoneTools.stopClip(enabledElement);
            } else {
                _this.viewportPlayConfigCopy[_this.viewportPlayConfigActive] = true;
                // obj.text = "暂停";
                activeToolsBar.selsected = true;
                cornerstoneTools.playClip(enabledElement, 4);
            }
        }
        if (activeToolsBar.tool == "tongbu") {
            _this.tongbufanye = true;
            if (activeToolsBar.synchronizerType == "unlink") {
                _this.tongbufanye = false;
            }
            return
        }
        if (activeToolsBar.tool == "clear") {
            const enabledElement2 = cornerstone.getEnabledElement(enabledElement);
            if (!enabledElement2 || !enabledElement2.image) {
                return;
            }

            const {
                toolState,
            } = cornerstoneTools.globalImageIdSpecificToolStateManager;
            if (
                !toolState ||
                toolState.hasOwnProperty(enabledElement2.image.imageId) === false
            ) {
                return;
            }
            cornerstoneTools.globalImageIdSpecificToolStateManager.clearImageIdToolState(
                enabledElement2.image.imageId
            );
            cornerstone.updateImage(enabledElement);
            return;
        }
        if (activeToolsBar.tool == "saveImage") {

            if (activeToolsBar.type == 'dcm') {


                return
            }
            let image = cornerstone.getImage(enabledElement);
            _this.centerDialogVisible = true;
            //获取图片信息
            const { imageId } = cornerstone.getImage(enabledElement);
            let imagePlaneModule =
                cornerstone.metaData.get("imagePlaneModule", imageId) || {};
            fileInfo.width = imagePlaneModule.columns;
            fileInfo.height = imagePlaneModule.rows;
            _this.$nextTick(() => {

                let myCanvas = document.createElement("canvas");
                let canvas = enabledElement.getElementsByClassName("cornerstone-canvas")[0];
                const viewport = cornerstone.getViewport(enabledElement);
                const zoom = viewport.scale.toFixed(2);
                // const cols = image.columns * zoom;
                // const rows = image.rows * zoom;
                const cols = image.columns * zoom * 1.5;
                const rows = image.rows * zoom * 1.5;
                myCanvas = CornerstoneToolsUtils._cropCanvas(
                    canvas,
                    Math.round(canvas.width / 2 - cols / 2),
                    Math.round(canvas.height / 2 - rows / 2),
                    cols,
                    rows
                );
                let url = myCanvas.toDataURL(
                    `${fileInfo.name}.${fileInfo.type}`
                );
                _this.$refs.imagePreview.src = url;

            });
            return;
        }
        if (
            activeToolsBar.tool == "flipViewportHorizontal" ||
            activeToolsBar.tool == "flipViewportVertical"
        ) {
            let type = "hflip";
            if (activeToolsBar.tool == "flipViewportVertical") {
                type = "vflip";
            }
            if (enabledElements.length > 0) {
                enabledElements.forEach(ele => {
                    let viewport = cornerstone.getViewport(ele);
                    viewport[type] = !viewport[type];
                    cornerstone.setViewport(ele, viewport);
                })

            }
            return;
        }
        if (activeToolsBar.tool == "Pan") {
            let viewporTargetSub = _this.$refs.viewporTargetSub;
            if (!this['panZoomSynchronizer']) {
                this['panZoomSynchronizer'] = new cornerstoneTools.Synchronizer(
                    'cornerstoneimagerendered',
                    cornerstoneTools['panZoomSynchronizer']
                );
            }
            /**
                *  先清除
                */
            viewporTargetSub.forEach(e => {
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['panZoomSynchronizer'].remove(e);
            })

            /*
            * 添加
            */
            enabledElements.forEach((e) => {
                //如果没有image
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['panZoomSynchronizer'].add(e);
            });

            cornerstoneTools.setToolActive('Pan', {
                mouseButtonMask: 1,
                synchronizationContext: this['panZoomSynchronizer'],
            });

            return
        }
        if (activeToolsBar.tool == "ReferenceLines") {
            cornerstoneTools.setToolActive("StackScroll", { mouseButtonMask: 1 });

            if (activeToolsBar.synchronizerType == "unlink") {
                if (!this['referenceLines']) { return }
                //解除同步器
                this['referenceLines'].destroy();

                //更新

                let viewporTargetSub = _this.$refs.viewporTargetSub;
                viewporTargetSub.forEach(ele => {
                    if (cornerstone.getImage(ele)) {
                        cornerstone.updateImage(ele);
                    }
                })

                // _this.tongbusynchronizer = null;
                this['referenceLines'] = null;
                toolsList.forEach((item) => {
                    item.selsected = false;
                    if (item.children.length > 0) {
                        item.children.forEach((ele) => {
                            ele.selsected = false;
                        });
                    }
                });

                toolsList[4].selsected = true;

                return


            }
            const enabledElement = CornerstoneToolsUtils._getAllSecondElement(elements, activeViewportSubIndex)
            // console.log('enabledElement', enabledElement)
            if (!cornerstone.getImage(enabledElement)) {
                return
            }

            if (!this.referenceLines) {
                this.referenceLines = new cornerstoneTools.Synchronizer(
                    'cornerstonenewimage',
                    cornerstoneTools.updateImageSynchronizer
                );
            }

            let self = this;
            let numImagesLoaded = 0;
            function addReferenceLinesTool(synchronizerEleArr) {
              self.referenceLines.add(enabledElement);
              cornerstone.updateImage(enabledElement);
            }
            const handleImageRendered = (evt, ReferenceLinesArr) => {
                evt.removeEventListener(
                    "cornerstoneimagerendered",
                    handleImageRendered
                );
                numImagesLoaded++;
                if (numImagesLoaded === 2) {
                    addReferenceLinesTool(ReferenceLinesArr);
                }
            };

            //获取定位图像
            let viewporTargetSub = _this.$refs.viewporTargetSub;

          viewporTargetSub.forEach((ele, i) => {
                handleImageRendered(ele, viewporTargetSub);
            })

            cornerstoneTools.setToolEnabled("ReferenceLines", {
                mouseButtonMask: 1,
                synchronizationContext: self.referenceLines,
            });
            return
        }

        cornerstoneTools.setToolActive(activeToolsBar.tool, { mouseButtonMask: 1 });
    }

    /**
     * 重置鼠标右键
    */
    static _resetMouseRight(obj, enabledElements, _this) {
        if (_this.bindingEventHandlersTool !== 'Pan') {
            if (!this['wwwcSynchronizer']) {
                this['wwwcSynchronizer'] = new cornerstoneTools.Synchronizer(
                    'cornerstoneimagerendered',
                    cornerstoneTools['wwwcSynchronizer']
                );
            }
            /**
                *  先清除
                */
            let viewporTargetSub = _this.$refs.viewporTargetSub;
            viewporTargetSub.forEach(e => {
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['wwwcSynchronizer'].remove(e);
            })

            /*
            * 添加
            */
            enabledElements.forEach((e) => {
                //如果没有image
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['wwwcSynchronizer'].add(e);
            });

            cornerstoneTools.setToolActive("Wwwc", {
                mouseButtonMask: 2, synchronizationContext: this['wwwcSynchronizer'],
            });

        } else {
            cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 2 });
        }
        //滚轮是翻页
        cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
    }

    /**
     * 获取当前的二级viewport
    */

    static _getAllSecondElements(elements, activeViewportSubIndex) {
        return _.filter(elements, function (e) {
            let strToNum = e.getAttribute("data-num").split("-")[0];
            let ACstrToNum = activeViewportSubIndex.split("-")[0];
            return strToNum == ACstrToNum;
        });
    }
    static _getAllSecondElement(elements, activeViewportSubIndex) {
        return _.filter(elements, function (e) {
            return e.getAttribute("data-num") == activeViewportSubIndex;
        })[0];
    }

    /**
     *
     * @param {*} canvas
     * @param {*} x
     * @param {*} y
     * @param {*} width
     * @param {*} height
     */
    static _cropCanvas(canvas, x, y, width, height) {
        // create a temp canvas
        const newCanvas = document.createElement("canvas");
        // set its dimensions
        newCanvas.width = width;
        newCanvas.height = height;
        // draw the canvas in the new resized temp canvas
        newCanvas
            .getContext("2d")
            .drawImage(canvas, x, y, width, height, 0, 0, width, height);
        return newCanvas;
    }

    static _downLoadQRcode(name, imgUrl) {
        if (!!imgUrl) {
            let imgData = imgUrl;
            CornerstoneToolsUtils._downloadFile(name, imgData);
        }
    }
    // 下载
    static _downloadFile(fileName, content) {
        let aLink = document.createElement("a");
        let blob = CornerstoneToolsUtils._base64ToBlob(content); // new Blob([content]);
        let evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", true, true); // initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(
            new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                view: window,
            })
        ); // 兼容火狐
    }
    // base64转blob
    static _base64ToBlob(code) {
        let parts = code.split(";base64,");
        let contentType = parts[0].split(":")[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;

        let uInt8Array = new Uint8Array(rawLength);

        for (let i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
    }
    saveImage(_this) {
        _this.centerDialogVisible = false;
        CornerstoneToolsUtils._downLoadQRcode(
            `${_this.fileInfo.name}.${_this.fileInfo.type}`,
            _this.$refs.imagePreview.src
        );
    }
    getAllSecondElement(elements, activeViewportSubIndex) {
        return _.filter(elements, function (e) {
            return e.getAttribute("data-num") == activeViewportSubIndex;
        })[0];
    }
    getAllSecondElements(elements, activeViewportSubIndex) {
        return _.filter(elements, function (e) {
            let strToNum = e.getAttribute("data-num").split("-")[0];
            let ACstrToNum = activeViewportSubIndex.split("-")[0];
            return strToNum == ACstrToNum;
        });
    }
    //binding Event Handlers 点击||滚轮 重新绑定事件
    bindingEventHandlers(activeViewportSubIndex, _this) {
        // console.log('bindingEventHandlersTool', _this.bindingEventHandlersTool);
        let viewporTargetSub = _this.$refs.viewporTargetSub;
        const enabledElements = CornerstoneToolsUtils._getAllSecondElements(viewporTargetSub, activeViewportSubIndex)
        const enabledElement = CornerstoneToolsUtils._getAllSecondElement(viewporTargetSub, activeViewportSubIndex)
        if (!cornerstone.getImage(enabledElement)) {
            return
        }

        if (this['stackScrollSynchronizer']) {
            let getTargetElements = this['stackScrollSynchronizer'].getTargetElements();
            //获取选中的序列 需要清除的ele
            let eleDelete = null;
            getTargetElements.forEach(ele => {
                if (ele.getAttribute("data-num").split("-")[0] == activeViewportSubIndex.split("-")[0]) {
                    eleDelete = ele;
                }
            })
            this['stackScrollSynchronizer'].remove(eleDelete);
            this['stackScrollSynchronizer'].add(enabledElement);
        }

        if (this['referenceLines']) {
            let getTargetElements = this['referenceLines'].getTargetElements();
            //获取选中的序列 需要清除的ele
            getTargetElements.forEach(ele => {
                let getImage = cornerstone.getImage(ele);
                if (getImage) {
                    let byteArray = getImage.data.byteArray;
                    let dataSet = dicomParser.parseDicom(byteArray /*, options */);
                    //只能添加第一个序列的检查报告
                    this['referenceLines'].remove(ele);
                }
            })
            this['referenceLines'].add(enabledElement);
            cornerstoneTools.setToolEnabled("ReferenceLines", {
              mouseButtonMask: 1,
              synchronizationContext: this['referenceLines'],
            });
        }
        //如果点击的是平移缩放
        if (_this.bindingEventHandlersTool == 'Pan') {
            if (!this['panZoomSynchronizer']) {
                this['panZoomSynchronizer'] = new cornerstoneTools.Synchronizer(
                    'cornerstoneimagerendered',
                    cornerstoneTools['panZoomSynchronizer']
                );
            }
            /*** 先清除 */
            viewporTargetSub.forEach(e => {
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['panZoomSynchronizer'].remove(e);
            })
            /*
            * 添加
            */
            enabledElements.forEach((e) => {
                //如果没有image
                if (!cornerstone.getImage(e)) {
                    return
                }
                this['panZoomSynchronizer'].add(e);
            });

            cornerstoneTools.setToolActive('Pan', {
                mouseButtonMask: 1,
                synchronizationContext: this['panZoomSynchronizer'],
            });
            return

        }

        if (_this.bindingEventHandlersTool == 'tongbu') {
            cornerstoneTools.setToolActive('StackScroll', { mouseButtonMask: 1 });
            // cornerstoneTools.setToolActive("StackScrollMouseWheel", {});
        }

        CornerstoneToolsUtils._resetMouseRight({
            tool: _this.bindingEventHandlersTool
        }, enabledElements, _this);



    }
}
const cornerstoneToolsUtils = new CornerstoneToolsUtils()


export default cornerstoneToolsUtils;
