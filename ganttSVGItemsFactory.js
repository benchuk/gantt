function GanttItemFactory() {

    var xmlns = 'http://www.w3.org/2000/svg';
    var xlinkns = 'http://www.w3.org/1999/xlink';

    //private function
    function getMousePosition(evt, ROOT) {
        var CTM = ROOT.getScreenCTM();
        return {
            x: (evt.clientX - CTM.e) / CTM.a,
            y: (evt.clientY - CTM.f) / CTM.d
        };
    };

    //private function
    function round(x) {
        //console.log('x: ' + x);
        //console.log('x round: ' + (x - (x % roundSize)));
        return x - parseInt(x % roundSize);
    }

    function roundUp(px) {
        //console.log('x: ' + x);
        //console.log('x round: ' + (x - (x % roundSize)));
        return px - parseInt(px % roundSize) + roundSize;
    }

    this.createLine = function (options) {
        if (!options) {
            options = {}
        }
        //x1, y1, x2, y2, color, strokeWidth
        var l = document.createElementNS(xmlns, 'line');
        l.setAttribute('x1', options.x1 || 0);
        l.setAttribute('y1', options.y1 || 0);
        l.setAttribute('x2', options.x2 || 10);
        l.setAttribute('y2', options.y2 || 10);
        l.setAttribute('stroke', options.color || 'black');
        l.setAttribute('stroke-width', options.strokeWidth || 1);

        function draw(container) {
            container.appendChild(l);
        }
        return {
            draw
        };
    };

    this.createUseElement = function (options) {
        if (!options) {
            options = {}
        }
        //scale,angle,class,x,y,id,fillId
        if (!options.href) {
            throw new Error('missing href');
        }
        var use = document.createElementNS(xmlns, 'use');
        var scale = options.scale || 1;
        var angle = options.angle || 0;
        var s = 'scale(' + scale + ') rotate(' + angle + ' ' + 0 + ' ' + 0 + ')';
        use.setAttributeNS(null, 'transform', s);
        use.setAttributeNS(null, 'class', options.class || 'hoverEffect');
        use.setAttributeNS(null, 'id', options.id || 'arrowRight');
        use.setAttributeNS(null, 'x', (options.x || 0) * (1 / scale));
        use.setAttributeNS(null, 'y', (options.y || 0) * (1 / scale));
        use.setAttributeNS(xlinkns, 'xlink:href', '#' + options.href);
        if (options.fillId) {
            use.setAttributeNS(null, 'fill', `url('#${options.fillId}')`);
        }
        return use;
    };

    this.createTask = function (options) {
        if (!options) {
            options = {}
        }
        if (!options.x) {
            options.x = 10
        }
        if (!options.y) {
            options.y = 10
        }
        if (!options.h) {
            options.h = 40
        }
        if (!options.w) {
            options.w = 100
        }
        //x, y, h, w, color
        var rect = document.createElementNS(xmlns, 'rect');
        //var color = '#' + Math.round(0xffffff * Math.random()).toString(16);
        rect.setAttributeNS(null, 'x', options.x);
        rect.setAttributeNS(null, 'y', options.y);
        rect.setAttributeNS(null, 'height', options.h);
        rect.setAttributeNS(null, 'width', options.w);
        rect.setAttributeNS(null, 'fill', options.color || 'red');
        //rect.setAttributeNS(null, 'filter', "url(#sofGlow)");
        rect.setAttributeNS(null, 'class', options.class || 'glower');
        //container.appendChild(rect);

        var circleStart = document.createElementNS(xmlns, 'circle');
        circleStart.setAttributeNS(null, 'cx', options.x || 10);
        circleStart.setAttributeNS(null, 'cy', options.y + options.h / 2);
        circleStart.setAttributeNS(null, 'r', options.h / 2);
        //circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
        circleStart.setAttributeNS(null, 'fill', options.color || 'red');
        circleStart.setAttributeNS(null, 'class', 'hoverEffect');
        //container.appendChild(circleStart);

        var circleEnd = document.createElementNS(xmlns, 'circle');
        circleEnd.setAttributeNS(null, 'cx', options.x + options.w);
        circleEnd.setAttributeNS(null, 'cy', options.y + options.h / 2);
        circleEnd.setAttributeNS(null, 'r', options.h / 2);
        //TBD - remove this default
        circleEnd.setAttributeNS(null, 'class', 'hoverEffect');
        //circleEnd.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
        circleEnd.setAttributeNS(null, 'fill', options.color || 'red');

        //circleStart.style.stroke = 'black';
        //tbd give in options
        circleStart.style.stroke.width = '3';

        //tbd - remove scale api?
        var scale = 1;
        // var options = {
        //   scale: 1
        // }
        var startArrow = this.createUseElement({
            x: options.x - 10,
            y: options.y + options.h / 2 - 10,
            href: 'arrowLeft',
            fillId: 'myGradient',
            scale: scale
        });

        var endArrow = this.createUseElement({
            x: options.x + options.w - 10,
            y: options.y + options.h / 2 - 10,
            href: 'arrowRight',
            fillId: 'myGradient',
            scale: scale
        });

        function makeDraggable(
            container,
            middle,
            start,
            end,
            arrowStart,
            arrowEnd,
            h,
            options
        ) {
            var scale = options ? options.scale || 1 : 1;
            var middleRect = middle;
            var startCircle = start;
            var endCircle = end;
            //var svgRoot = document.getElementById('svgOne');
            container.addEventListener('mouseup', endDrag);
            container.addEventListener('mousemove', drag);

            middleRect.addEventListener('mousedown', startDrag);
            arrowStart.addEventListener('mousedown', startDragStartArrow);
            arrowEnd.addEventListener('mousedown', startDragEndArrow);

            var startCircleSelected, initialStateDragStart;
            var endCircleSelected, initialStateDragEnd;
            var centerRect, offset;

            function startDragStartArrow(evt) {
                evt.stopPropagation();
                startCircleSelected = startCircle; //evt.target;
                initialStateDragStart = getMousePosition(evt, container);
                initialStateDragStart.w = middleRect.getAttributeNS(
                    null,
                    'width'
                );
                initialStateDragStart.middleRectStartX = parseFloat(
                    middleRect.getAttributeNS(null, 'x')
                );
                initialStateDragStart.offsetX = initialStateDragStart.x;
                initialStateDragStart.arrowOffsetX = initialStateDragStart.x;
                initialStateDragStart.offsetX -= parseFloat(
                    startCircle.getAttributeNS(null, 'cx')
                );
                initialStateDragStart.y -= parseFloat(
                    startCircle.getAttributeNS(null, 'cy')
                );
                initialStateDragStart.arrowOffsetX -= arrowStart.getAttributeNS(
                    null,
                    'x'
                );
            }

            function startDragEndArrow(evt) {
                evt.stopPropagation();
                endCircleSelected = endCircle; //evt.target;
                initialStateDragEnd = getMousePosition(evt, container);
                initialStateDragEnd.w = middleRect.getAttributeNS(null, 'width');
                initialStateDragEnd.offsetX = initialStateDragEnd.x;
                initialStateDragEnd.arrowOffsetX = initialStateDragEnd.x;
                initialStateDragEnd.offsetX -= parseFloat(
                    endCircle.getAttributeNS(null, 'cx')
                );
                initialStateDragEnd.y -= parseFloat(
                    endCircle.getAttributeNS(null, 'cy')
                );
                initialStateDragEnd.arrowOffsetX -= arrowEnd.getAttributeNS(
                    null,
                    'x'
                );
            }

            function startDrag(evt) {
                evt.stopPropagation();
                centerRect = evt.target;
                offset = getMousePosition(evt, container);
                offset.s = offset.x; //parseFloat(middleRect.getAttributeNS(null, 'x'));
                console.log('start Drag', offset.s);
                offset.x -= parseFloat(centerRect.getAttributeNS(null, 'x'));
                offset.y -= parseFloat(centerRect.getAttributeNS(null, 'y'));
            }

            //https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
            //clientX and clientY are dome coordinate system in pixels

            function drag(evt) {
                var coord = getMousePosition(evt, container);
                debugText.textContent = coord.x + 'x' + coord.y;
                //evt.preventDefault();
                if (!offset) {
                    offset = {
                        s: 0
                    };
                }
                var dt = parseInt(coord.x) - offset.s;
                handleDrag(coord, dt);
                offset.s = coord.x;
            }

            function handleDrag(coord, dt, snap, extern) {
                if (startCircleSelected) {
                    var xEndArrowBefore = parseFloat(
                        arrowStart.getAttributeNS(null, 'x')
                    );
                    if (!snap) {
                        var dt =
                            parseFloat(initialStateDragStart.x) - parseFloat(coord.x);
                        middleRect.setAttributeNS(
                            null,
                            'width',
                            parseFloat(initialStateDragStart.w) + parseFloat(dt)
                        );
                        middleRect.setAttributeNS(
                            null,
                            'x',
                            initialStateDragStart.middleRectStartX - dt
                        );
                        startCircle.setAttributeNS(
                            null,
                            'cx',
                            coord.x - initialStateDragStart.offsetX
                        );
                        arrowStart.setAttributeNS(
                            null,
                            'x',
                            coord.x - initialStateDragStart.arrowOffsetX
                        );
                    } else {
                        var startX =
                            parseFloat(startCircle.getAttributeNS(null, 'cx')) - h / 2;
                        console.log('startX:' + startX);
                        var dtStart = parseInt(startX % roundSize) * -1;
                        arrowStart.setAttributeNS(
                            null,
                            'x',
                            xEndArrowBefore + dtStart
                        );
                        var startCircleX = parseFloat(
                            startCircle.getAttributeNS(null, 'cx')
                        );
                        startCircle.setAttributeNS(
                            null,
                            'cx',
                            startCircleX + dtStart
                        );
                        var startMiddleRectX = parseFloat(
                            middleRect.getAttributeNS(null, 'x')
                        );
                        middleRect.setAttributeNS(
                            null,
                            'x',
                            startMiddleRectX + dtStart
                        );
                        var middleRectWidth = parseFloat(
                            middleRect.getAttributeNS(null, 'width')
                        );
                        middleRect.setAttributeNS(
                            null,
                            'width',
                            middleRectWidth + dtStart * -1
                        );
                    }
                }
                if (endCircleSelected) {
                    //console.log('handle drag end: coord.x: ' + coord.x);
                    var dtLocal =
                        parseFloat(coord.x) - parseFloat(initialStateDragEnd.x);
                    middleRect.setAttributeNS(
                        null,
                        'width',
                        parseFloat(initialStateDragEnd.w) + parseFloat(dtLocal)
                    );
                    endCircle.setAttributeNS(
                        null,
                        'cx',
                        coord.x - initialStateDragEnd.offsetX
                    );
                    var xEndArrowBefore = parseFloat(
                        arrowEnd.getAttributeNS(null, 'x')
                    );
                    arrowEnd.setAttributeNS(
                        null,
                        'x',
                        coord.x - initialStateDragEnd.arrowOffsetX
                    );
                }
                if (centerRect || extern) {
                    if (!offset) {
                        offset = {
                            x: 0,
                            y: 0
                        };
                    }
                    var xBefore = parseFloat(middleRect.getAttributeNS(null, 'x'));
                    var dtDrag = dt; //parseInt(coord.x) - offset.s; //parseInt(coord.x) - xBefore - offset.x; //parseInt(offset.s);
                    if (snap) {
                        var current = xBefore - h / 2; //parseFloat(startCircle.getAttributeNS(null, 'cx'));
                        dtDrag = parseInt(current % roundSize) * -1; //current - round(current);
                        //dtDrag = coord.x - current + h / 2;
                    }
                    middleRect.setAttributeNS(null, 'x', xBefore + dtDrag);
                    // if (snap) {
                    // } else {
                    //   middleRect.setAttributeNS(null, 'x', xBefore + dtDrag);
                    // }
                    var xAfter = parseFloat(middleRect.getAttributeNS(null, 'x'));
                    var dt = xAfter - xBefore;
                    var xStartCircle = parseFloat(
                        startCircle.getAttributeNS(null, 'cx')
                    );
                    startCircle.setAttributeNS(null, 'cx', xStartCircle + dt);

                    var xEndCircle = parseFloat(
                        endCircle.getAttributeNS(null, 'cx')
                    );
                    endCircle.setAttributeNS(null, 'cx', xEndCircle + dt);

                    var xStartArrow = parseFloat(
                        arrowStart.getAttributeNS(null, 'x')
                    );
                    arrowStart.setAttributeNS(null, 'x', xStartArrow + dt);

                    var xEndArrow = parseFloat(arrowEnd.getAttributeNS(null, 'x'));
                    arrowEnd.setAttributeNS(null, 'x', xEndArrow + dt);
                    //selectedElement.setAttributeNS(null, "y", coord.y - offset.y);
                }
            }

            function endDrag(evt) {
                //console.log('endDrag');
                evt.stopPropagation();
                if (centerRect) {
                    //console.log('centerRect');
                    var x = parseFloat(centerRect.getAttributeNS(null, 'x'));
                    x = round(x);
                    var coord = {
                        x: x
                    };
                    handleDrag(coord, 0, true);
                }
                if (endCircleSelected) {
                    console.log('endCircleSelected');
                    var cx = parseFloat(
                        endCircleSelected.getAttributeNS(null, 'cx')
                    );
                    console.log('before round: ' + cx);
                    cx = roundUp(cx);
                    console.log('after round: ' + cx);
                    var coord = {
                        x: cx - h / 2
                    };
                    handleDrag(coord, 0, true);
                }
                if (startCircleSelected) {
                    console.log('startCircleSelected');
                    var ccx = parseFloat(
                        startCircleSelected.getAttributeNS(null, 'cx')
                    );
                    ccx = round(ccx);
                    var coord = {
                        x: ccx + h / 2
                    };
                    handleDrag(coord, 0, true);
                }
                centerRect = null;
                endCircleSelected = null;
                startCircleSelected = null;
            }

            return handleDrag;
        }

        var drawBinded = function draw(container) {
            container.appendChild(rect);
            container.appendChild(circleStart);
            container.appendChild(circleEnd);
            container.appendChild(startArrow);
            container.appendChild(endArrow);
        }.bind(this);

        return {
            draw: drawBinded,
            draggable: function (container) {
                return makeDraggable(
                    container,
                    rect,
                    circleStart,
                    circleEnd,
                    startArrow,
                    endArrow,
                    options.h
                );
            }
        };
    };
}