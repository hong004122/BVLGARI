'use strict';

(() => {
    let yOffset = 0;
    let prevScrollHeight = 0;
    let currentScene = 0;
    let enterNewScene = false;
    let acc = 0.1;
    let delayedYOffset = 0;
    let rafId;
    let rafState;

    const sceneInfo = [
        {
        
            type: 'sticky',
            heightNum: 10,
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-0'),
                messageA: document.querySelector('#scroll-section-0 .main-message.a'),
                messageB: document.querySelector('#scroll-section-0 .main-message.b'),
                messageC: document.querySelector('#scroll-section-0 .main-message.c'),
                messageD: document.querySelector('#scroll-section-0 .main-message.d'),
                messageE: document.querySelector('#scroll-section-0 .main-message.e'),
                canvas: document.querySelector('#video-canvas-0'),
                context: document.querySelector('#video-canvas-0').getContext('2d'),
            
                videoImages: []
            
            },
            values: {
                videoImageCount: 204,
                imageSequence: [0, 203],
                canvas_opacity: [1, 0, { start: 0.9, end: 1 }],
                canvasContainer_opacity: [1, 0, { start: 0.9, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.1, end: 0.18}],
                messageB_opacity_in: [0, 1, { start: 0.27, end: 0.35}],
                messageC_opacity_in: [0, 1, { start: 0.44, end: 0.52}],
                messageD_opacity_in: [0, 1, { start: 0.6, end: 0.63}],
                messageE_opacity_in: [0, 1, { start: 0.72, end: 0.77}],
                messageA_translateY_in: [20, 0, { start: 0.1, end: 0.18}],
                messageB_translateY_in: [20, 0, { start: 0.27, end: 0.35}],
                messageC_translateY_in: [20, 0, { start: 0.44, end: 0.52}],
                messageD_translateY_in: [20, 0, { start: 0.6, end: 0.63}],
                messageE_translateY_in: [20, 0, { start: 0.72, end: 0.77}],
                messageA_opacity_out: [1, 0, { start: 0.2, end: 0.27}],
                messageB_opacity_out: [1, 0, { start: 0.37, end: 0.44}],
                messageC_opacity_out: [1, 0, { start: 0.54, end: 0.6}],
                messageD_opacity_out: [1, 0, { start: 0.65, end: 0.72}],
                messageE_opacity_out: [1, 0, { start: 0.79, end: 0.84}],
                messageA_translateY_out: [0, -20, { start: 0.2, end: 0.27}],
                messageB_translateY_out: [0, -20, { start: 0.37, end: 0.44}],
                messageC_translateY_out: [0, -20, { start: 0.54, end: 0.6}],
                messageD_translateY_out: [0, -20, { start: 0.65, end: 0.72}],
                messageE_translateY_out: [0, -20, { start: 0.79, end: 0.84}]
            }
        },
        {
        
            type: 'normal',
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-1'),

            }
        },
        {
        
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-2'),
                messageA: document.querySelector('#scroll-section-2 .a'),
                messageB: document.querySelector('#scroll-section-2 .b'),
                messageC: document.querySelector('#scroll-section-2 .c'),
                pinB: document.querySelector('#scroll-section-2 .b .pin'),
                pinC: document.querySelector('#scroll-section-2 .c .pin'),
                canvas: document.querySelector('#video-canvas-1'),
                context: document.querySelector('#video-canvas-1').getContext('2d'),
            
                videoImages: []
            
            },
            values: {
                videoImageCount: 171,
                imageSequence: [0, 170],
                canvas_opacity_in: [0, 1, { start: 0.01, end: 0.06 }],
                canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                messageA_opacity_in: [0, 1, { start: 0.2, end: 0.4}],
                messageB_opacity_in: [0, 1, { start: 0.52, end: 0.6}],
                messageC_opacity_in: [0, 1, { start: 0.7, end: 0.78}],
                messageA_translateY_in: [20, 0, { start: 0.2, end: 0.4}],
                messageB_translateY_in: [20, 0, { start: 0.52, end: 0.6}],
                messageC_translateY_in: [20, 0, { start: 0.7, end: 0.78}],
                messageA_opacity_out: [1, 0, { start: 0.43, end: 0.5}],
                messageB_opacity_out: [1, 0, { start: 0.65, end: 0.7}],
                messageC_opacity_out: [1, 0, { start: 0.88, end: 0.95}],
                messageA_translateY_out: [0, -20, { start: 0.43, end: 0.5}],
                messageB_translateY_out: [0, -20, { start: 0.65, end: 0.7}],
                messageC_translateY_out: [0, -20, { start: 0.88, end: 0.95}],
                pinB_scaleY: [0.2, 1, { start: 0.52, end: 0.6}],
                pinC_scaleY: [0.2, 1, { start: 0.7, end: 0.85}],
                pinB_opacity_in: [0, 1, { start: 0.52, end: 0.6}],
                pinC_opacity_in: [0, 1, { start: 0.7, end: 0.78}],
                pinB_opacity_out: [1, 0, { start: 0.65, end: 0.7}],
                pinC_opacity_out: [1, 0, { start: 0.88, end: 0.95}]
            }
        },
        {
        
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath: [
                    './images/blendImg01.jpg',
                    './images/blendImg02.jpg'
                ],
                images: []
            

            },
            values: {
                rect1X: [0, 0, { start: 0, end: 0 }],
                rect2X: [0, 0, { start: 0, end: 0 }],
                rectStartY: 0,
                blendHeight: [0, 0, { start: 0, end: 0 }],
                canvas_scale: [0, 0, { start: 0, end: 0 }],
                canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
                canvasCaption_translateY: [20, 0, { start: 0, end: 0 }]
            }
        },
        {
        
            type: 'normal',
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-4'),
            }
        }
    ]
    
    function setCanvasImages() {
        let imgElem;
        const windowWidth = window.innerWidth;
        if (windowWidth >= 500) {
            for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
                imgElem = new Image();
                imgElem.src = `./images/scrollImg${1001 + i}.jpg`
                sceneInfo[0].objs.videoImages.push(imgElem);
            }
        } else {
            for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
                imgElem = new Image();
                // imgElem.src = `../images/scrollImg${1001 + i}.JPG`;
                imgElem.src = `./images/mobileImg${1001 + i}.jpg`
                sceneInfo[0].objs.videoImages.push(imgElem);
            }
        }
    
        
        
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image();
            imgElem2.src = `./images/scrollImg${3001 + i}.jpg`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
        
        }

        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
    
    }

    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
            }
        }
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].objs.container.offsetHeight;
        
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                break;
            }
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    function calcValues(values, currentYOffset) {
        let rv;
        const scrollHeight = sceneInfo[currentScene].objs.container.offsetHeight;
        const scrollRatio = currentYOffset / scrollHeight;
    
        if (values.length === 3) {
            const partScrollStart = values[2].start * scrollHeight;
            const partScrollEnd = values[2].end * scrollHeight;
            const partScrollHeight = partScrollEnd - partScrollStart;
            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
        }
        return rv;
    
    }


    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;
        const scrollHeight = sceneInfo[currentScene].objs.container.offsetHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.19) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                
                
                
                } else if (scrollRatio > 0.19) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.36) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.53) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.64) {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
                    objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.78) {
                    objs.messageE.style.opacity = calcValues(values.messageE_opacity_in, currentYOffset);
                    objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translateY_in, currentYOffset)}%, 0)`;
                } else {
                    objs.messageE.style.opacity = calcValues(values.messageE_opacity_out, currentYOffset);
                    objs.messageE.style.transform = `translate3d(0, ${calcValues(values.messageE_translateY_out, currentYOffset)}%, 0)`;
                    objs.container.style.opacity = calcValues(values.canvasContainer_opacity, currentYOffset);
                }
                break;
            case 2:
                if (scrollRatio <= 0.42) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.62) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
                if (scrollRatio <= 0.85) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleX(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleX(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }
                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                
                
                    const widthRatio = window.innerWidth / objs.canvas.width;
                    const heightRatio = window.innerHeight / objs.canvas.height;
                    let canvasScaleRatio;

                    if (widthRatio <= heightRatio) {
                        canvasScaleRatio = heightRatio;
                    } else {
                        canvasScaleRatio = widthRatio;
                    }
                    objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                    objs.context.fillStyle = 'white';
                    objs.context.drawImage(objs.images[0], 0, 0);

                    const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
                    const recalculatedInnerHeight = window.innerHeight / canvasScaleRatio;

                    const whiteRectWidth = recalculatedInnerWidth * 0.2;
                
                    values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                    objs.context.fillRect(parseInt(values.rect1X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                    objs.context.fillRect(parseInt(values.rect2X[0]), 0, parseInt(whiteRectWidth), objs.canvas.height);
                }
                break;
            case 3:
                const widthRatio = window.innerWidth / objs.canvas.width;
                const heightRatio = window.innerHeight / objs.canvas.height;
                let canvasScaleRatio;

                if (widthRatio <= heightRatio) {
                    canvasScaleRatio = heightRatio;
                } else {
                    canvasScaleRatio = widthRatio;
                }
                objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
                objs.context.fillStyle = 'white';
                objs.context.drawImage(objs.images[0], 0, 0);

                const recalculatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;

                if(!values.rectStartY) {
                    values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

                    values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }

                const whiteRectWidth = recalculatedInnerWidth * 0.2;
                values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                objs.context.fillRect(
                    parseInt(calcValues(values.rect1X, currentYOffset)),
                    0, 
                    parseInt(whiteRectWidth), 
                    objs.canvas.height);
                objs.context.fillRect(
                    parseInt(calcValues(values.rect2X, currentYOffset)), 
                    0, 
                    parseInt(whiteRectWidth), 
                    objs.canvas.height);

                let step = 0;

                if (scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    objs.canvas.classList.remove('sticky');
                } else {
                    step = 2;
                    values.blendHeight[0] = 0;
                    values.blendHeight[1] = objs.canvas.height;
                    values.blendHeight[2].start = values.rect1X[2].end;
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.3;
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                
                    objs.context.drawImage(
                        objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                    )
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`
                    objs.container.style.backgroundColor = 'transparent';
                
                    if (scrollRatio > values.blendHeight[2].end) {
                        
                        values.canvas_scale[0] = canvasScaleRatio;
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.3;

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        objs.canvas.style.marginTop = 0;
                        objs.container.style.backgroundColor = '#fff5f4';
                    }

                    if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.6}px`;
                    
                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;

                        objs.canvasCaption.style.opacity = calcValues(values.canvasCaption_opacity, currentYOffset);
                        objs.canvasCaption.style.transform = `translate3d(0, ${calcValues(values.canvasCaption_translateY, currentYOffset)}%, 0)`;
                    }
                }

                break;
            }
    }


    function scrollLoop() {
        enterNewScene = false;
        prevScrollHeight = 0;
    
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].objs.container.offsetHeight;
        }
        
        if (delayedYOffset < prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
            document.body.classList.remove('scroll-effect-end');
        }

        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].objs.container.offsetHeight) {
            enterNewScene = true;
            if (currentScene === sceneInfo.length - 1) {
                document.body.classList.add('scroll-effect-end');
            }
            if (currentScene < sceneInfo.length - 1) {
                currentScene++;
            }
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
    
        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return;
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
    

        if (enterNewScene) return;
    
        playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        
        if (!enterNewScene) {
        
            const currentYOffset = delayedYOffset - prevScrollHeight;
            const objs = sceneInfo[currentScene].objs;
            const values = sceneInfo[currentScene].values;
            if (currentScene === 0 || currentScene === 2) {
            
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                const windowWidth = window.innerWidth;
                const canvasWidth = sceneInfo[0].objs.canvas.width;
                const imgWidth = sceneInfo[0].objs.videoImages[0].width;
                const imgDx = (canvasWidth - imgWidth) / 2;
                const windowHeight = window.innerHeight;
                const imgHeight = sceneInfo[0].objs.videoImages[0].height;
                const imgDy = (imgHeight - windowHeight) / 2;
                if (objs.videoImages[sequence]) {
                    if (windowWidth < 500) {
                        sceneInfo[0].objs.context.drawImage(objs.videoImages[sequence], imgDx,0);
                        sceneInfo[2].objs.context.drawImage(objs.videoImages[sequence], 0, 0)
                    } else {
                        objs.context.drawImage(objs.videoImages[sequence], 0, 0)
                    }
                }
                
            }
        }

        rafId = requestAnimationFrame(loop);

        if (Math.abs(yOffset - delayedYOffset) < 1) {
            cancelAnimationFrame(rafId);
            rafState = false;
        }
    }


    setCanvasImages();
    

    window.addEventListener('load', () => {
        document.body.classList.remove('before-load');
        setLayout();
        
        const windowWidth = window.innerWidth;
        const canvasWidth = sceneInfo[0].objs.canvas.width;
        const imgWidth = sceneInfo[0].objs.videoImages[0].width;
        const imgDx = (canvasWidth - imgWidth) / 2;
        const windowHeight = window.innerHeight;
        const imgHeight = sceneInfo[0].objs.videoImages[0].height;
        const imgDy = (imgHeight - windowHeight) / 2;
        if (windowWidth < 500) {
            sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], imgDx,0);
        } else {
            sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        }
        sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[2], 0, 0);

        let tempYOffset = yOffset;
    
        let tempScrollCount = 0;
    
        if (yOffset > 0) {
            let siId = setInterval(() => {
                window.scrollTo(0, tempYOffset);
                tempYOffset += 5;

                if(tempScrollCount > 20) {
                    clearInterval(siId);
                }
                tempScrollCount++;
            }, 20);
        }
        
        window.addEventListener('scroll', () => {
            yOffset = window.pageYOffset;
            scrollLoop();
            if (!rafState) {
                rafId = requestAnimationFrame(loop);
                rafState = true;
            }
        });

        
        window.addEventListener('resize', () => {
            if (window.innerWidth > 500) {
                window.location.reload();
            }
        });

        window.addEventListener('orientationchange', () => {
            scrollTo(0, 0);

            setTimeout(() => {
                window.location.reload();
            }, 200);
        });

        
        document.querySelector('.loading').addEventListener('transitionend', function() {
            this.style.display = 'none';
        });
    
    
    

    });



    

})();


