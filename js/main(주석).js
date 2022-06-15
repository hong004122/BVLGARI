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
            // 0
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
                // canvas는 getContext 객체로 들어올 이미지를 호출하기 때문에 꼭 지정하기
                videoImages: []
                // 여기에 이미지 시퀀스 수백장을 넣을거라 배열 객체 호출
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
            // 1
            type: 'normal',
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-1'),

            }
        },
        {
            // 2
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
                // canvas는 getContext 객체로 들어올 이미지를 호출하기 때문에 꼭 지정하기
                videoImages: []
                // 여기에 이미지 시퀀스 수백장을 넣을거라 배열 객체 호출
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
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-3'),
                canvasCaption: document.querySelector('.canvas-caption'),
                canvas: document.querySelector('.image-blend-canvas'),
                context: document.querySelector('.image-blend-canvas').getContext('2d'),
                imagesPath: [
                    '../images/blendImg01.jpg',
                    '../images/blendImg02.jpg'
                ],
                images: []
                // 0, 2번에서 이미지 시퀀스를 넣었던 것처럼 동일하게 img 넣어줄 배열 만든 것

            },
            values: {
                rect1X: [0, 0, { start: 0, end: 0 }],
                rect2X: [0, 0, { start: 0, end: 0 }],
                // 첫번째 이미지에서 양 옆에 사용되는 흰색박스의 위치와 움직임으로 사용될 예정
                rectStartY: 0,
                // 첫번째 이미지에서 양 옆에 있는 흰색 박스의 animation이 시작될 Y위치로 사용할 예정
                blendHeight: [0, 0, { start: 0, end: 0 }],
                // 두번째 이미지에서 위에서 서서히 올라오는 animation으로 사용할 예정
                canvas_scale: [0, 0, { start: 0, end: 0 }],
                // 두번째 이미지가 다 올라온 후 스크롤 되면서 점점 작아지는 animation으로 사용할 예정
                canvasCaption_opacity: [0, 1, { start: 0, end: 0 }],
                canvasCaption_translateY: [20, 0, { start: 0, end: 0 }]
            }
        },
        {
            // 4
            type: 'normal',
            scrollHeight: 0,
            objs: {
                container : document.querySelector('#scroll-section-4'),

            }
        }
    ]
    
    function setCanvasImages() {
        let imgElem;
        for (let i = 0; i < sceneInfo[0].values.videoImageCount; i++) {
            imgElem = new Image(); // 이미지객체 생성 (= document.createElement('img');)
            imgElem.src = `../images/scrollImage01/scroll${1001 + i}.jpg`;
            sceneInfo[0].objs.videoImages.push(imgElem);
            // push를 이용해 objs에 만들어 놓은 videoImages 배열에 넣어줌
        }
        // console.log(sceneInfo[0].objs.videoImages);

        
        let imgElem2;
        for (let i = 0; i < sceneInfo[2].values.videoImageCount; i++) {
            imgElem2 = new Image(); // 이미지객체 생성 (= document.createElement('img');)
            imgElem2.src = `../images/scrollImage02/scroll${3001 + i}.jpg`;
            sceneInfo[2].objs.videoImages.push(imgElem2);
            // push를 이용해 objs에 만들어 놓은 videoImages 배열에 넣어줌
        }

        let imgElem3;
        for (let i = 0; i < sceneInfo[3].objs.imagesPath.length; i++) {
            imgElem3 = new Image();
            imgElem3.src = sceneInfo[3].objs.imagesPath[i];
            sceneInfo[3].objs.images.push(imgElem3);
        }
        // console.log(sceneInfo[3].objs.images);
    }

    function setLayout() {
        for (let i = 0; i < sceneInfo.length; i++) {
            if (sceneInfo[i].type === 'sticky') {
                sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
                sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
            }
            //  else if (sceneInfo[i].type === 'normal') {
            //     sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight
            // }
        }
        yOffset = window.pageYOffset;
        let totalScrollHeight = 0;
        for (let i = 0; i < sceneInfo.length; i++) {
            totalScrollHeight += sceneInfo[i].objs.container.offsetHeight;
            // totalScrollHeight에 현재 scroll되고 있는 scene의 height를 넣고
            if (totalScrollHeight >= yOffset) {
                currentScene = i;
                // 현재 scroll위치가 현재 scene의 height보다 높아졌을 경우 scene이 넘어가도록 설정
                // (최상단에 선언한 currentScene에 i를 재할당)
                // console.log(totalScrollHeight);
                // console.log(currentScene);
                // console.log(yOffset);
                // console.log(sceneInfo[0].scrollHeight);
                break;
            }
            // 위 if문은 scrollLoop에서 currentScene을 정해준 로직을 또 다시 세팅하는 건데
            //    중간에 새로고침하면 currentScene이 제대로 안잡혀서 확실하게 해준 것.
            //    break는 계속 하면 안되니까 yOffset보다 크면 아예 로직을 멈춰버리게 한 것
        }
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        const heightRatio = window.innerHeight / 1080;
        sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
        // scale은 1이 100%이기 때문에 현재 img의 높이 1080에서 window.innerHeight를 나누면
        //  적정한 비율이 나오고 그 비율을 scale 안에 넣어주면 됨
        sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
    }

    //                            현재 scene에서 얼마나 scroll이 됐는지
    function calcValues(values, currentYOffset) {
        let rv;
        const scrollHeight = sceneInfo[currentScene].objs.container.offsetHeight;
        // setLayout에서 지정한 currentScene(현재 scene)의 height 할당
        const scrollRatio = currentYOffset / scrollHeight;
        // 현재 scroll 위치를 currentScene의 height로 나눠서 scroll 비율 구함
        //    이 소수점이 애니메이션이 시작하는 위치와 끝나는 위치를 잡아줄 수 있게 됨
        // * currentYOffset = yOffset - prevScrollHeight(이전 scene들의 height)
        // *    = 현재 scene 시작점부터 현재 scroll 위치까지의 거리
        if (values.length === 3) {
            const partScrollStart = values[2].start * scrollHeight;
            // start(소수점)와 scrollHeight를 곱해서 시작시점의 scrollHeight 위치를 잡음
            const partScrollEnd = values[2].end * scrollHeight;
            // end(소수점)와 scrollHeight를 곱해서 종료시점의 scrollHeight 위치를 잡음
            const partScrollHeight = partScrollEnd - partScrollStart;
            // end와 start를 빼서 animation의 구간을 잡는 것

            if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd) {
            // 현재 scene의 scroll위치가 start보다 크거나 같고 end보다 작거나 같을 때(animation구간이란 소리)
                rv = (currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0];
                //                               얘가 빠지니까 ↓ start시점부터 현재 scroll까지 구함
                // 1. currentYOffset = partScrollStart -> ㅣ-----ㅣ---ㅣ 
                //                                        0   start  yOffset
                // 2. / partScrollHeight -> animation 구간에서 1번의 값을 나누면
                //                       총 구간에서 현재 위치의 비율을 구함
                //                    ex_ 총구간: 500 / 현재scroll: 100 -> 100/500 -> 0.2
                // 3. 2번에서 구한 비율을 values 값을 곱하면 그 비율에 대한 values의 속성 값이 나옴
                //      ex_ 0.2 X (900 - 200) + 200 = 0.2 X 700 = 140 + 200 = 340
                //          현재 0.2라는 scroll 위치에서는 속성값이 340이라는 값이 나와야 하는 것
            } else if (currentYOffset < partScrollStart) {
                rv = values[0];
            } else if (currentYOffset > partScrollEnd) {
                rv = values[1];
            }
        } else {
            rv = scrollRatio * (values[1] - values[0]) + values[0];
            // 현재는 opacity와 translate밖에 없는데 이 변화값이 어떤게 될지, 어떤 수치가 될지 모름
            //   so, 나중 값[1]과 첫값[0]을 빼면 전체 범위가 나오는데 그 전체 범위에서
            //       scrollRatio를 곱해주고 그 후 곱해준 값에 초기값을 더해주면 그 값이 animation범위
            // ! ex_ [200, 900]일 경우 900 - 200만 했을 때는 결국 700이 나와서 0 ~ 700의 범위를
            // !     animation 하게 되는데 200~900을 해야하기 때문에 초기값인 200을 더해
            // !     200에서 시작해 900에서 끝날 수 있게 하는 것임.
        }
        return rv;
        // rv는 그냥 return values 줄인거임..
    }


    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        // sceneInfo에 있는 objs, values object를 그냥 변수에 넣어준 것
        const currentYOffset = yOffset - prevScrollHeight;
        // 현재 scroll 위치에서 이전 height 값들을 빼면 현재 scene의 scroll값이 나올 것
        // console.log(currentScene, currentYOffset);
        const scrollHeight = sceneInfo[currentScene].objs.container.offsetHeight;
        const scrollRatio = currentYOffset / scrollHeight;

        switch (currentScene) {
            case 0:
                // console.log(calcValues(messageA_opacity_in, currentYOffset));
                // console.log(scrollRatio);
                // * let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                // console.log(sequence);
                // calcValues를 이용해 imageSequence[0, 195]를 이용해
                //  scroll의 시작부터 끝까지 잡을 수 있게 해놓았고 소수점이 나와서 Math.round를
                //  사용해서 반올림처리 해서 정수로 나올 수 있게 함
                // * objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                // context에서 getContext('2d')를 잡은 걸 이용해 drawImage로 이미지를 넣어줄거고
                //  img를 현재 setCanvasImages에서 videoImages 배열 안에 넣어두었기 때문에
                //  순서를 잡아준 sequence를 안에 넣고 x: 0, y: 0까지 적어놓고 세팅
                objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

                if (scrollRatio <= 0.19) {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                    // console.log(calcValues(values.messageA_opacity_in, currentYOffset));
                    // translateY 대신 translate3d를 쓴 이유는 하드웨어 가속이 고정이 되어 퍼포먼스가 더 좋음
                    //      애플에서도 translate로 이동시킬 때 3d가 아니더라도 translate3d를 사용한다고 함
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
                // let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
                // objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
                if (scrollRatio <= 0.42) {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
                    // console.log(calcValues(values.messageA_opacity_in, currentYOffset));
                } else {
                    objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
                    objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
                }
                if (scrollRatio <= 0.62) {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                    // console.log(calcValues(values.messageB_opacity_in, currentYOffset));
                } else {
                    objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
                    objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
                }
                if (scrollRatio <= 0.85) {
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleX(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                    // console.log(calcValues(values.messageC_opacity_in, currentYOffset));
                } else {
                    objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
                    objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
                    objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
                    objs.pinC.style.transform = `scaleX(${calcValues(values.pinC_scaleY, currentYOffset)})`;
                }

                // currentSene 3에서 쓰는 캔버스를 미리 그려주기 시작
                if (scrollRatio > 0.9) {
                    const objs = sceneInfo[3].objs;
                    const values = sceneInfo[3].values;
                    // 2번에서 3번을 미리 다시 그려주는 역할을 해야하기 때문에 위에서 같이쓸 수 없는
                    //  objs, values를 다시 선언해서 이 if문 안에서 쓸 수 있도록 함
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
                    // 왼쪽 박스
                    values.rect1X[0] = objs.canvas.offsetLeft;
                    console.log(values.rect1X[0])
                    values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                    // 오른쪽 박스
                    values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                    values.rect2X[1] = values.rect2X[0] + whiteRectWidth;;

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

                    values.rect1X[2].start = (window.innerHeight / 3) / scrollHeight;
                    values.rect2X[2].start = (window.innerHeight / 3) / scrollHeight;
                    values.rect1X[2].end = values.rectStartY / scrollHeight;
                    values.rect2X[2].end = values.rectStartY / scrollHeight;
                }
                // ! offsetTop은 부모태그로 타고 올라가면서 position: relative를 가지고 있는 
                // !    태그를 기준으로 잡음(아무리 타고 올라가도 없으면 결국 홈페이지 최상단 기준으로 계산)
                // console.log(values.rectStartY)
                // console.log(objs.canvas.offsetTop, objs.canvas.height, canvasScaleRatio);

                const whiteRectWidth = recalculatedInnerWidth * 0.2;
                // 왼쪽 박스
                // values.rect1X[0] = (objs.canvas.width - recalculatedInnerWidth) / 2;
                values.rect1X[0] = objs.canvas.offsetLeft;
                values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
                // 오른쪽 박스
                values.rect2X[0] = values.rect1X[0] + recalculatedInnerWidth - whiteRectWidth;
                values.rect2X[1] = values.rect2X[0] + whiteRectWidth;

                // objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);
                // * parseInt를 감쌀 필요는 없었는데 canvas에서 정수로 해줘야 그릴 때 성능이 조금 더 좋아짐
                // *    그리고 canvas에서 그리면 default로 검정색이 그려짐
                // objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), objs.canvas.height);

                // 좌우 흰색 박스 그리기
                objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
                objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

                let step = 0;
                // 

                if (scrollRatio < values.rect1X[2].end) {
                    step = 1;
                    // console.log(step);
                    objs.canvas.classList.remove('sticky');
                    // 1번 캔버스가 닿기 전이니까 sticky라는 class가 붙으면 안되기 때문에 지움
                } else {
                    step = 2;
                    // console.log(step);
                    values.blendHeight[0] = 0;
                    // 위로 올라가는 느낌의 canvas기 때문에 처음엔 0에서 시작
                    values.blendHeight[1] = objs.canvas.height;
                    // 서서히 올라가면서 마지막엔 canvas의 height만큼 커져야 하기 때문에 지정
                    values.blendHeight[2].start = values.rect1X[2].end;
                    // rect1X[2].end가 1번 canvas 끝나는 시점과 동일하기 때문에 지정
                    //  -> rect2X[2].end와 다르지 않음
                    values.blendHeight[2].end = values.blendHeight[2].start + 0.3;
                    // 시작 시점에서 0.2의 구간동안만 올라가게끔 지정함(숫자 바뀌어도 상관없음)
                    const blendHeight = calcValues(values.blendHeight, currentYOffset);
                    // so, blendHeight라는 변수에 calcValues 함수를 사용해 할당해주는데
                    //  sceneInfo안에 있는 values에 blendHeight object 값이 완성되었기 때문에
                    //  인자로 넣어준 것.
                    // console.log(scrollRatio);
                    // console.log(values.rect1X[2].end);

                    objs.context.drawImage(
                        objs.images[1],
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight,
                        0, objs.canvas.height - blendHeight, objs.canvas.width, blendHeight
                        // 현재 9개의 value가 들어있는 상황
                        // drawImage(image, sx, sy sWidth, SHeight, dx, dy, dWidth, dHeight)
                        //   -> image에는 위 setCanvasImages에서 넣어준 2번째 img를 넣어준 거고
                        //       s는 source로 원래 우리가 그릴 이미지(완성본)
                        //       d는 destination으로 캔버스에 실제 그리는 이미지()
                        //   -> 2번 쓴 이유가 하나만 쓰게 되면 거기서 고정이 되어 있는데 2번 쓰게 되면
                        //      s와 d를 활용해서 이동 및 크기조정을 할 수 있기 때문에 scroll 값에 따라
                        //      애니메이션 되는 효과를 줄 수 있는 것
                    )
                    objs.canvas.classList.add('sticky');
                    objs.canvas.style.top = `${-(objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2}px`
                    // 현재 canvas scale이 조정된 상태라 top: 0을 하면 위가 조금 떠있음.
                    //   so, 원래 canvas 크기에서 scale이 줄어든 비율 만큼 곱한 값을 뺀 후 /2를 하면 
                    //      붕 떠있는 공간 값이 나올거고 그 값에 -를 해야 top이 다시 조정되기 때문에 
                    //      결국은 top: -(스케일 조정된 비율 / 2)px이 되는 것.
                    objs.container.style.backgroundColor = 'transparent';
                    // objs.canvas.style.transformOrigin = 'left center';

                    if (scrollRatio > values.blendHeight[2].end) { // 2번째 img 올라오는 게 끝났을 때
                        console.log('축소 시작');
                        values.canvas_scale[0] = canvasScaleRatio;
                        // 첫 시작은 커져있는 그대로이기 때문에 브라우저에 맞춰있는 크기 그대로
                        values.canvas_scale[1] = document.body.offsetWidth / (1.5 * objs.canvas.width);
                        // 어찌됐든 작아지는 크기는 브라우저의 크기보다는 더 작아야 하기 때문에
                        //   현재 body의 offsetWidth를 현재 canvas.width(1920)에 나눠서 비율을 정해주는데
                        //   너무 미비할 수 있어 1.5를 곱해서 분모를 더 크게 해준 후 축소비율을 키운 것
                        values.canvas_scale[2].start = values.blendHeight[2].end;
                        // 두번째 이미지에서 height가 모두 커진 후에 바로 들어가면 되기 때문에 end로 잡음
                        values.canvas_scale[2].end = values.canvas_scale[2].start + 0.3;
                        // start에서 0.2를 더한 건 전체 스크롤의 20%정도로 animation을 해준다는 것

                        objs.canvas.style.transform = `scale(${calcValues(values.canvas_scale, currentYOffset)})`;
                        // objs.canvas.style.transformOrigin = 'center';
                        objs.canvas.style.marginTop = 0;
                        objs.container.style.backgroundColor = '#fff5f4';
                        // 밑의 if문에서 sticky Class를 없애고 margin-top을 주어야 canvas 밑에 있는
                        //   text가 정상적으로 나오는데 다시 올릴 때는 margin-top이 있으면 안되서
                        //   초기화 시켜주기 위해 작성
                    }

                    if (scrollRatio > values.canvas_scale[2].end && values.canvas_scale[2].end > 0) {
                        // canvas_scale에 해당하는 animation이 실행되지 않으면 values.canvas_scale[2]가
                        //  0이기 때문에 시점에 안 맞게 먼저 실행이 되어서 0보다 클때로도 조건을 맞춰준 것
                        objs.canvas.classList.remove('sticky');
                        objs.canvas.style.marginTop = `${scrollHeight * 0.6}px`;
                        // 현재 scrollHeight에서 cixed로 변환시킨 구간은 
                        //  values.blendHeight.end에서 0.2, objs.canvas_scale.end에서 0.2
                        //  총 0.4에 해당하는 scroll만 fixed이고 나머지는 scroll에 영향을 주지
                        //  않았기 때문에 전체 scrollHeight에서 0.4만큼만 곱해 margin-top으로 주면
                        //  그 자리에서 자연스럽게 scroll로 변환되는 움직임을 줄 수 있음

                        
                        values.canvasCaption_opacity[2].start = values.canvas_scale[2].end;
                        // canvas_scale이 끝난 시점에서 마지막 text animation 시작
                        values.canvasCaption_opacity[2].end = values.canvasCaption_opacity[2].start + 0.1;
                        // 10%만큼의 애니메이션을 하기 위해 start에서 + 0.1을 더해 end 설정
                        values.canvasCaption_translateY[2].start = values.canvasCaption_opacity[2].start;
                        // opacity 시작할 때 translate도 같이 시작
                        values.canvasCaption_translateY[2].end = values.canvasCaption_opacity[2].end;
                        // opacity 끝날 때 translate도 같이 끝
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
        // 밑의 for문이 돌면서 height가 기하급수적으로 늘기 때문에 초기화시켜주는 역할
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].objs.container.offsetHeight;
        }

        // if (yOffset > prevScrollHeight + sceneInfo[currentScene].objs.container.offsetHeight) {
            // prevScrollHeight의 for문 조건을 currentScene보다 작게 했을 때로 바꿔서
            //    결국 prevScrollHeight는 이전 Scene들의 height 합계가 됨
        if (delayedYOffset > prevScrollHeight + sceneInfo[currentScene].objs.container.offsetHeight) {
            // yOffset으로 썼을 경우 scene이 바뀌는 과정에서 delay때문에 오류가 나서 변경
            enterNewScene = true;
            currentScene++;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // if (yOffset < prevScrollHeight) {
        if (delayedYOffset < prevScrollHeight) {
            enterNewScene = true;
            if(currentScene === 0) return;
            // mobile에서 순간적으로 새로고침할 때 올라가는 순간이 있는데 그럴 때 -1이 돼버려서
            //   그걸 방지하고자 0일 때는 그대로 return으로 로직을 끝내버림
            currentScene--;
            document.body.setAttribute('id', `show-scene-${currentScene}`);
        }
        // console.log(currentScene);

        if (enterNewScene) return;
        // currentScene이 바뀌는 그 찰나에 enterNewScene을 이용해 playAnimation 함수가 돌지 못하도록
        //    하는 장치이고 어차피 scrollLoop는 scroll될 때마다 작동하기 때문에 playAnimation에서
        //     찰나에 opacity나 translate가 -가 되어버리는 것을 방지한 뒤 다시 로직이 돌게 하는 것
        playAnimation();
    }

    function loop() {
        delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
        
        if (!enterNewScene) {
            // scene이 바뀔 때 순간적으로 오류가 나서 false일 때만 작동하도록 함
            const currentYOffset = delayedYOffset - prevScrollHeight;
            const objs = sceneInfo[currentScene].objs;
            const values = sceneInfo[currentScene].values;
            if (currentScene === 0 || currentScene === 2) {
                // 다른 scene일 때는 그려질 필요 없으니 currentScene이 0일 떄만 작동
                let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
                if (objs.videoImages[sequence]) {
                    // img가 없다는 오류가 생겨서 if로 조건 걸어서 넣어준 것.
                    //  -> img가 있을 때만 그리는 것
                    objs.context.drawImage(objs.videoImages[sequence], 0, 0);
                }
                console.log('loop');
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
        
        sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
        sceneInfo[2].objs.context.drawImage(sceneInfo[2].objs.videoImages[2], 0, 0);

        let tempYOffset = yOffset;
        // 현재 스크롤 위치를 저장할 변수
        let tempScrollCount = 0;
        // 중간에서 새로고침 했을 때 스크롤이 5px씩 몇 번 갔는지 count 할 변수
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
                // setLayout();
                // sceneInfo[3].values.rectStartY = 0;
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
        // (e) => {
        //     document.body.removeChild(e.currentTarget);
        // });

    });



    

})();


