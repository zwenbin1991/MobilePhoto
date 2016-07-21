/**
 * @description 图片预加载
 * @author 曾文彬
 * @date 2016.7.16
 */

'use strict';

function preload (imgPaths) {
    Array.isArray(imgPaths) || (imgPaths = [imgPaths]);

    let cloneImgPaths = imgPaths.slice();
    let loadedCount = 0;
    let length = cloneImgPaths.length;
    let delayTimeStamp = 2000;
    let timer, img;

    const generate = function (i, imgObj) {
        if (imgObj instanceof Image)
            cloneImgPaths[i] = imgObj;
        else
            delete cloneImgPaths[i];
    };

    return new Promise((resolve, reject) => {
        imgPaths.forEach((imgPath, index) => {
            img = new Image;
            img.src = imgPath;

            if (img.complete) {
                generate(index, img);
                loadedCount++;

                if (loadedCount === length)
                    resolve(cloneImgPaths);
            }
            else {
                (i => {
                    timer = setTimeout(() => {
                        img.onload = img.onerror = null;
                        generate(i, new Error('加载超时'));
                        loadedCount++;

                        if (loadedCount === length)
                            resolve(cloneImgPaths);
                    }, delayTimeStamp);
                })(index);

                ((timer, i) => {
                    img.onload = function () {
                        clearTimeout(timer);
                        generate(i, this);
                        loadedCount++;

                        if (loadedCount === length)
                            resolve(cloneImgPaths);
                    };
                })(timer, index);

                ((timer, i) => {
                    img.onerror = () => {
                        clearTimeout(timer);
                        generate(i, new Error('加载失败'));
                        loadedCount++;

                        if (loadedCount === length)
                            resolve(cloneImgPaths);
                    };
                })(timer, index);
            }
        });
    });
}

export default preload;